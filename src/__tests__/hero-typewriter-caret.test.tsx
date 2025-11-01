import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AIChatInterface from '../components/AIChatInterface';

const originalMatchMedia = window.matchMedia;
const originalIntersectionObserver = window.IntersectionObserver;
const originalRequestAnimationFrame = window.requestAnimationFrame;

describe('Hero typewriter caret', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb?.(0);
      return 0;
    };

    class ImmediateIntersectionObserver implements IntersectionObserver {
      private readonly _callback: IntersectionObserverCallback;

      readonly root: Element | Document | null = null;

      readonly rootMargin = '0px';

      readonly thresholds = [0];

      constructor(callback: IntersectionObserverCallback) {
        this._callback = callback;
      }

      observe(target: Element) {
        this._callback([{ isIntersecting: true, target, intersectionRatio: 1, time: 0, boundingClientRect: target.getBoundingClientRect(), intersectionRect: target.getBoundingClientRect(), rootBounds: target.getBoundingClientRect() }], this);
      }

      unobserve() {}

      disconnect() {}

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    window.IntersectionObserver = ImmediateIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();

    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    } else {
      // @ts-expect-error - restoring to undefined when not originally defined
      window.matchMedia = undefined;
    }

    if (originalIntersectionObserver) {
      window.IntersectionObserver = originalIntersectionObserver;
    } else {
      // @ts-expect-error - restoring to undefined when not originally defined
      window.IntersectionObserver = undefined;
    }

    if (originalRequestAnimationFrame) {
      window.requestAnimationFrame = originalRequestAnimationFrame;
    }
  });

  it('keeps placeholder hidden and fades caret on completion', () => {
    const { container } = render(
      <MemoryRouter>
        <AIChatInterface />
      </MemoryRouter>
    );

    const placeholder = container.querySelector('.hero-typewriter-placeholder') as HTMLElement;
    expect(placeholder).toBeTruthy();
    expect(placeholder?.style.visibility).toBe('hidden');

    const overlay = container.querySelector('.hero-typewriter-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.querySelector('.typewriter-typed')).toBeTruthy();

    const cursor = overlay?.querySelector('.typewriter-cursor') as HTMLElement;
    expect(cursor).toBeTruthy();
    expect(cursor?.classList.contains('done')).toBe(false);

    act(() => {
      vi.runAllTimers();
    });

    expect(cursor.classList.contains('done')).toBe(true);
    expect(cursor.style.opacity).toBe('0');
  });

  it('restarts animation with visible caret when selected agent changes', () => {
    const { container } = render(
      <MemoryRouter>
        <AIChatInterface />
      </MemoryRouter>
    );

    const getCursor = () => container.querySelector('.typewriter-cursor') as HTMLElement | null;

    act(() => {
      vi.runAllTimers();
    });

    expect(getCursor()?.classList.contains('done')).toBe(true);

    const agentToggle = screen.getByRole('button', { name: /Commander/i });
    fireEvent.click(agentToggle);

    const connectorOption = screen.getByRole('option', { name: 'Connector' });
    fireEvent.click(connectorOption);

    expect(getCursor()?.classList.contains('done')).toBe(false);
    expect(getCursor()?.style.opacity).toBe('1');

    act(() => {
      vi.runAllTimers();
    });

    expect(getCursor()?.classList.contains('done')).toBe(true);
  });
});
