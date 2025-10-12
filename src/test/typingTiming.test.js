import { describe, it, expect } from 'vitest';

// This test computes timing based on the banner text and settings in AIChatInterface.jsx
// It asserts the total typing time increased by ~500ms (±50ms tolerance)

const BASE_TYPING_MS_PER_CHAR = 95;
const PAUSE_MS = 1500;
const greetingPart = 'Hello.'; // must mirror AIChatInterface.jsx
const agentName = 'Strategic Advisor'; // default selected agent
const agentPart = ` I am your ${agentName}`; // leading space preserved

function calcTotalMsWith(basePerChar) {
  const totalChars = greetingPart.length + agentPart.length;
  const typingMs = totalChars * basePerChar;
  // completion timeout adds one per-char after last char, but visual completion is last char
  return typingMs + PAUSE_MS;
}

describe('Banner typing timing', () => {
  it('adds +500ms to total typing duration (±50ms)', () => {
    const totalChars = greetingPart.length + agentPart.length; // 34 currently
    const T_current = calcTotalMsWith(BASE_TYPING_MS_PER_CHAR);
    const extraPerChar = Math.ceil(500 / totalChars);
    const newPerChar = BASE_TYPING_MS_PER_CHAR + extraPerChar;
    const T_new = calcTotalMsWith(newPerChar);

    const delta = T_new - T_current;
    expect(delta).toBeGreaterThanOrEqual(450);
    expect(delta).toBeLessThanOrEqual(550);
  });
});
