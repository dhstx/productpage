// Redaction utilities for removing common PII and secret tokens
// This module is framework-agnostic and safe to import in tests.

export function redact(input: string): string {
  if (!input) return input;

  let output = input;

  // Emails
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  output = output.replace(emailRegex, '[REDACTED_EMAIL]');

  // JWTs (header.payload.signature) and base64-like tokens
  const jwtRegex = /\b[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b/g;
  output = output.replace(jwtRegex, '[REDACTED_TOKEN]');

  // Obvious API keys (OpenAI, Google, AWS, generic long tokens)
  const openAiKeyRegex = /\bsk-[A-Za-z0-9]{16,}\b/g;
  const googleKeyRegex = /\bAIza[0-9A-Za-z\-_]{20,}\b/g;
  const awsKeyRegex = /\bAKIA[0-9A-Z]{16}\b/g;
  const longTokenRegex = /\b[0-9A-Za-z_\-]{32,}\b/g;
  output = output
    .replace(openAiKeyRegex, '[REDACTED_KEY]')
    .replace(googleKeyRegex, '[REDACTED_KEY]')
    .replace(awsKeyRegex, '[REDACTED_KEY]')
    .replace(longTokenRegex, (m) => (m.length >= 40 ? '[REDACTED_KEY]' : m));

  // Bearer tokens
  const bearerRegex = /Bearer\s+[0-9A-Za-z._\-]+/gi;
  output = output.replace(bearerRegex, 'Bearer [REDACTED]');

  return output;
}

// Utility to condense long text by trimming and normalizing whitespace
export function condenseText(text: string, maxChars: number): string {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) return normalized;
  return normalized.slice(0, Math.max(0, maxChars - 3)) + '...';
}
