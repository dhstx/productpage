import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AIChatInterface from '../components/AIChatInterface.jsx';

const originalMatchMedia = typeof window !== 'undefined' ? window.matchMedia : undefined;
const originalIntersectionObserver = typeof window !== 'undefined' ? window.IntersectionObserver : undefined;

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage?.clear?.();
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: () => false,
  }));

  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe = () => {
      this.callback?.([{ isIntersecting: true }]);
    };
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  window.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver;
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  if (originalMatchMedia) {
    window.matchMedia = originalMatchMedia;
  } else {
    delete window.matchMedia;
  }
  if (originalIntersectionObserver) {
    window.IntersectionObserver = originalIntersectionObserver;
    global.IntersectionObserver = originalIntersectionObserver;
  } else {
    delete window.IntersectionObserver;
    delete global.IntersectionObserver;
  }
});

describe('Hero typewriter caret', () => {
  const renderHero = () =>
    render(
      <MemoryRouter>
        <AIChatInterface />
      </MemoryRouter>
    );

  it('renders placeholder and overlay caret structure', () => {
    const { container } = renderHero();

    const placeholder = container.querySelector('.welcome-placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder?.getAttribute('aria-hidden')).toBe('true');
    expect(placeholder?.style.visibility).toBe('hidden');

    const overlay = container.querySelector('.welcome-typewriter');
    expect(overlay).toBeTruthy();
    expect(overlay?.querySelector('.typewriter-typed')).toBeTruthy();
    expect(overlay?.querySelector('.typewriter-cursor')).toBeTruthy();
  });

  it('fades the cursor after typing completes', async () => {
    const { container } = renderHero();

    const cursor = container.querySelector('.typewriter-cursor');
    expect(cursor).toBeTruthy();

    await act(async () => {
      vi.runAllTimers();
    });

    expect(cursor?.classList.contains('done')).toBe(true);
    expect(cursor?.style.opacity).toBe('0');
  });

  it('restarts the animation when selecting a new agent', async () => {
    const { container } = renderHero();

    const cursor = container.querySelector('.typewriter-cursor');
    expect(cursor).toBeTruthy();

    await act(async () => {
      vi.runAllTimers();
    });

    expect(cursor?.classList.contains('done')).toBe(true);

    const trigger = container.querySelector('.select-agent');
    expect(trigger).toBeTruthy();

    act(() => {
      fireEvent.click(trigger);
    });

    const connectorOption = screen.getByRole('option', { name: 'Connector' });

    act(() => {
      fireEvent.click(connectorOption);
    });

    expect(cursor?.classList.contains('done')).toBe(false);
    expect(cursor?.style.opacity).toBe('1');
    const typed = container.querySelector('.typewriter-typed');
    expect(typed?.textContent).toBe('');

    await act(async () => {
      vi.runAllTimers();
    });

    const srOnly = container.querySelector('.sr-only');
    expect(srOnly?.textContent).toContain('Connector');
    expect(cursor?.classList.contains('done')).toBe(true);
    expect(cursor?.style.opacity).toBe('0');
  });
});
