import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import PublicChatbox from '../components/chat/PublicChatbox';

const HERO_SENTENCE = 'Welcome, Commander. Meet your Chief of Staff';

describe('PublicChatbox hero typewriter', () => {
  let originalRAF: typeof window.requestAnimationFrame | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0)) as typeof window.requestAnimationFrame;
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRAF ?? window.requestAnimationFrame;
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders the exact hero sentence and centers the text', async () => {
    const { container } = render(<PublicChatbox />);

    const typewriterContainer = container.querySelector('.typewriter-container');
    expect(typewriterContainer).toBeTruthy();
    expect(typewriterContainer?.classList.contains('chatbox-typewriter')).toBe(true);

    const prefix = container.querySelector('.typewriter-prefix');
    expect(prefix?.textContent).toBe('Welcome, Commander. Meet your ');

    // advance enough time for the first agent name to finish typing (Chief of Staff)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200);
    });

    const typewriterText = container.querySelector('.typewriter-text');
    const rendered = typewriterText?.textContent?.replace(/\|/g, '');
    expect(rendered).toBe(HERO_SENTENCE);

    const agentSpan = container.querySelector('.public-typer');
    expect(agentSpan?.textContent).toBe('Chief of Staff');
  });

  it('does not wrap the Commander prefix in a special agent span', () => {
    const { container } = render(<PublicChatbox />);
    const prefix = container.querySelector('.typewriter-prefix');
    expect(prefix?.querySelector('.agent-name')).toBeNull();
  });
});
