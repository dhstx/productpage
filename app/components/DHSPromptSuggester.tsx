'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };
type UIHint = { n?: number; language?: string; style?: string };

type Props = {
  history?: ChatMessage[];
  uiHint?: UIHint;
  onApply?: (text: string) => void;
};

type Suggestion = { text: string; confidence?: number; reason?: string };

const sampleHistory = (history: ChatMessage[] = [], max: number) => history.slice(-max);

export default function DHSPromptSuggester({ history = [], uiHint = { n: 3, language: 'en', style: 'concise' }, onApply }: Props) {
  const [draft, setDraft] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const latencyTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const debouncedDraft = useDebouncedValue(draft, 250);

  useEffect(() => {
    if (!debouncedDraft.trim()) {
      setSuggestions([]);
      setLoading(false);
      setShowSkeleton(false);
      return;
    }

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Show skeleton if > 300ms
    setShowSkeleton(false);
    if (latencyTimer.current) window.clearTimeout(latencyTimer.current);
    latencyTimer.current = window.setTimeout(() => setShowSkeleton(true), 300);

    setLoading(true);
    const payload = {
      current_draft: debouncedDraft,
      chat_history: sampleHistory(history, 8),
      ui_hint: uiHint,
      client: {
        session_id: safeSessionId(),
        app_version: 'web-1',
      },
    };

    fetch('/api/suggest-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) return { suggestions: [] } as { suggestions: Suggestion[] };
        return (await r.json()) as { suggestions: Suggestion[] };
      })
      .then((data) => {
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions.slice(0, uiHint.n ?? 3) : []);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setSuggestions([]);
      })
      .finally(() => {
        setLoading(false);
        if (latencyTimer.current) window.clearTimeout(latencyTimer.current);
        setShowSkeleton(false);
      });

    return () => controller.abort();
  }, [debouncedDraft, history, uiHint]);

  // Keyboard shortcuts: Enter applies top suggestion, Cmd/Ctrl+1..3 insert nth
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 3) {
          e.preventDefault();
          const s = suggestions[num - 1];
          if (s) applySuggestion(s.text);
        }
      } else if (e.key === 'Enter') {
        if (suggestions[0]) {
          e.preventDefault();
          applySuggestion(suggestions[0].text);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [suggestions]);

  const applySuggestion = useCallback(
    (text: string) => {
      setDraft(text);
      if (onApply) onApply(text);
    },
    [onApply]
  );

  return (
    <div className="max-w-2xl mx-auto p-4" ref={containerRef} tabIndex={0} aria-label="Prompt suggester container">
      <label htmlFor="dhs-draft" className="block text-sm font-medium mb-2">Current draft</label>
      <textarea
        id="dhs-draft"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        placeholder="Type your message..."
        aria-label="Draft input"
      />

      <div
        className="mt-3 flex flex-wrap gap-2 items-center"
        aria-live="polite"
        tabIndex={0}
      >
        {showSkeleton && loading && (
          <SkeletonChips reducedMotion={reducedMotion} count={uiHint.n ?? 3} />
        )}

        {!loading && suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            className={
              'rounded-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors'
            }
            onClick={() => applySuggestion(s.text)}
            aria-label={`Suggestion ${idx + 1}: ${s.text}`}
          >
            {s.text}
            <kbd className="ml-2 text-[10px] text-gray-500">{shortcutLabel(idx + 1)}</kbd>
          </button>
        ))}
      </div>
    </div>
  );
}

function SkeletonChips({ reducedMotion, count = 3 }: { reducedMotion: boolean; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="rounded-full px-3 py-1 text-xs bg-gray-100 text-transparent"
          style={{
            animation: reducedMotion ? undefined : 'fadeIn 300ms ease both',
            animationDelay: reducedMotion ? undefined : `${i * 80}ms`,
          }}
          aria-hidden="true"
        >
          Loading…
        </span>
      ))}
      <style>{
        `@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`
      }</style>
    </>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function safeSessionId(): string {
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function shortcutLabel(n: number): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return `${isMac ? '⌘' : 'Ctrl+'}${n}`;
}
