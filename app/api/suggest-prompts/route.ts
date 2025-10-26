/*
  Edge API Route: /api/suggest-prompts
  - JSON schema mode (OpenAI Responses API)
  - Redaction of secrets/PII
  - History condensation
  - Simple in-memory LRU cache (soft limit 128)
  - Fail-soft behavior: always returns { suggestions: [] } on error
  - Minimal telemetry placeholders
*/

import { NextResponse } from 'next/server';
import { redact, condenseText } from '@/lib/redact';

export const runtime = 'edge';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };
type UIHint = { n?: number; language?: string; style?: string };
type ClientInfo = { session_id?: string; app_version?: string };

type Suggestion = {
  text: string;
  confidence?: number;
  reason?: string;
  source?: 'llm' | 'cache' | 'heuristic';
};

type APIRequestBody = {
  current_draft: string;
  chat_history: ChatMessage[];
  ui_hint?: UIHint;
  client?: ClientInfo;
};

type APIResponseBody = {
  suggestions: Suggestion[];
};

// Strict JSON schema for OpenAI Responses API
export const SUGGESTION_SCHEMA = {
  name: 'DHSPromptSuggestions',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      suggestions: {
        type: 'array',
        minItems: 0,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            text: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            reason: { type: 'string' },
            source: { type: 'string', enum: ['llm', 'cache', 'heuristic'] },
          },
          required: ['text'],
        },
      },
    },
    required: ['suggestions'],
  },
  strict: true,
} as const;

// Basic in-memory LRU cache
const CACHE_SOFT_LIMIT = 128;
const cache = new Map<string, APIResponseBody>();

function setCache(key: string, value: APIResponseBody) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  if (cache.size > CACHE_SOFT_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

function getCache(key: string): APIResponseBody | undefined {
  const val = cache.get(key);
  if (val) {
    // refresh recency
    cache.delete(key);
    cache.set(key, val);
  }
  return val;
}

// Token bucket rate limiter (per session) - simple, in-memory
type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();
const RATE_LIMIT_PER_MIN = 60;

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(sessionId) ?? { tokens: RATE_LIMIT_PER_MIN, lastRefill: now };
  const elapsed = (now - bucket.lastRefill) / 60000; // minutes
  const refill = Math.floor(elapsed * RATE_LIMIT_PER_MIN);
  if (refill > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_PER_MIN, bucket.tokens + refill);
    bucket.lastRefill = now;
  }
  const allowed = bucket.tokens > 0;
  if (allowed) bucket.tokens -= 1;
  buckets.set(sessionId, bucket);
  return allowed;
}

// Telemetry placeholders
function recordLatencyMs(_ms: number) {}
function recordCacheHit(_hit: boolean) {}
function recordAcceptanceRate(_accepted: boolean) {}

function systemPrompt(ui: UIHint | undefined): string {
  const n = typeof ui?.n === 'number' ? Math.max(1, Math.min(5, ui!.n!)) : 3;
  const language = ui?.language || 'en';
  const style = ui?.style || 'concise';
  return [
    'You are a prompt suggestion engine for a chat composer.',
    'Return only JSON that conforms to the provided JSON schema.',
    `Generate ${n} high-quality suggestions to help the user continue writing.`,
    `Language: ${language}. Style: ${style}.`,
    'Suggestions must be distinct, brief, and actionable. Do not include quotes or numbering in the text.',
  ].join(' ');
}

function condense(history: ChatMessage[], maxChars = 3000): string {
  if (!Array.isArray(history) || history.length === 0) return '';
  const sampled = history.slice(-8); // sample recent
  const lines = sampled.map((m) => `${m.role}: ${m.content}`);
  return condenseText(lines.join('\n'), maxChars);
}

async function sha256Base64(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hash));
  const b64 = btoa(String.fromCharCode.apply(null, bytes as unknown as number[]));
  return b64;
}

function toFailSoft(): NextResponse {
  return NextResponse.json<APIResponseBody>({ suggestions: [] }, { status: 200 });
}

export async function POST(req: Request) {
  const t0 = Date.now();
  try {
    const body = (await req.json()) as APIRequestBody;
    const draft = (body?.current_draft ?? '').trim();
    const ui = body?.ui_hint ?? { n: 3, language: 'en', style: 'concise' };
    const client = body?.client ?? {};

    // Validate inputs per contract
    if (!draft) {
      recordLatencyMs(Date.now() - t0);
      return NextResponse.json<APIResponseBody>({ suggestions: [] }, { status: 200 });
    }

    const condensed = condense(body.chat_history || []);
    const redactedDraft = redact(draft);
    const redactedHistory = redact(condensed);

    // Cache key based on redacted inputs and UI parameters
    const cacheKey = await sha256Base64(
      JSON.stringify({ m: process.env.OPENAI_MODEL || 'gpt-4.1-mini', redactedDraft, redactedHistory, ui })
    );

    const cached = getCache(cacheKey);
    if (cached) {
      recordCacheHit(true);
      recordLatencyMs(Date.now() - t0);
      return NextResponse.json<APIResponseBody>(cached, { status: 200 });
    }
    recordCacheHit(false);

    // Rate limiting (fail-soft)
    const sid = client.session_id || 'anon';
    if (!checkRateLimit(sid)) {
      recordLatencyMs(Date.now() - t0);
      return NextResponse.json<APIResponseBody>({ suggestions: [] }, { status: 200 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    if (!OPENAI_API_KEY) {
      // Missing key: fail-soft
      recordLatencyMs(Date.now() - t0);
      return NextResponse.json<APIResponseBody>({ suggestions: [] }, { status: 200 });
    }

    const sys = systemPrompt(ui);
    const user = [
      'Current draft (redacted):',
      redactedDraft,
      '',
      'Recent chat history (redacted):',
      redactedHistory || '[none]',
    ].join('\n');

    // Build JSON schema response request
    const payload = {
      model,
      input: [
        { role: 'system', content: [{ type: 'text', text: sys }] },
        { role: 'user', content: [{ type: 'text', text: user }] },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: SUGGESTION_SCHEMA,
      },
      max_output_tokens: 1024,
    } as const;

    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      recordLatencyMs(Date.now() - t0);
      return toFailSoft();
    }

    const data = await resp.json();
    // Try to extract parsed JSON per Responses API
    let parsed: APIResponseBody | null = null;
    if (data?.output_parsed) {
      parsed = data.output_parsed as APIResponseBody;
    } else if (typeof data?.output_text === 'string') {
      try { parsed = JSON.parse(data.output_text) as APIResponseBody; } catch { /* ignore */ }
    } else if (Array.isArray(data?.output)) {
      // Fallback traversal to find parsed content
      try {
        for (const item of data.output) {
          if (Array.isArray(item?.content)) {
            for (const c of item.content) {
              if (c?.type === 'output_text' && typeof c?.text === 'string') {
                parsed = JSON.parse(c.text) as APIResponseBody;
                break;
              }
              if (c?.type === 'json' && c?.parsed) {
                parsed = c.parsed as APIResponseBody;
                break;
              }
            }
          }
          if (parsed) break;
        }
      } catch {
        // ignore
      }
    }

    const safe: APIResponseBody = parsed && Array.isArray(parsed.suggestions)
      ? { suggestions: parsed.suggestions.slice(0, ui.n ?? 3) }
      : { suggestions: [] };

    setCache(cacheKey, safe);
    recordLatencyMs(Date.now() - t0);
    return NextResponse.json<APIResponseBody>(safe, { status: 200 });
  } catch (err) {
    // Fail-soft on any error
    recordLatencyMs(Date.now() - t0);
    return toFailSoft();
  }
}
