import { describe, it, expect } from 'vitest';
import { redact, condenseText } from './redact';

describe('redact', () => {
  it('redacts emails', () => {
    const input = 'Contact me at test.user@example.com for details';
    const out = redact(input);
    expect(out).not.toContain('test.user@example.com');
    expect(out).toContain('[REDACTED_EMAIL]');
  });

  it('redacts JWT-like tokens', () => {
    const input = 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiYiJ9.sgn';
    const out = redact(input);
    expect(out).toContain('[REDACTED_TOKEN]');
  });

  it('redacts common API keys', () => {
    const input = 'sk-abc1234567890abcdef and AKIAABCDEFGHIJKLMN';
    const out = redact(input);
    expect(out).toContain('[REDACTED_KEY]');
  });
});

describe('condenseText', () => {
  it('trims and limits length with ellipsis', () => {
    const out = condenseText('  hello   world  ', 5);
    expect(out).toBe('he...');
  });
});
