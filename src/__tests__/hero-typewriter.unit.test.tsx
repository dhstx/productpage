import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import AIChatInterface from '@/components/AIChatInterface';

let intersectionCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
let observedElements: Element[] = [];
let heroStyleSheet: CSSStyleSheet | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback as any;
  }

  observe(element: Element) {
    observedElements.push(element);
  }

  unobserve(element: Element) {
    observedElements = observedElements.filter((el) => el !== element);
  }

  disconnect() {
    observedElements = [];
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeAll(() => {
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;

  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => {
        const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
        const maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[1], 10) : undefined;
        const matches = typeof maxWidth === 'number' ? window.innerWidth <= maxWidth : false;
        return {
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(() => false),
        } as MediaQueryList;
      },
    });
  }

  const style = document.createElement('style');
  style.setAttribute('data-test-style', 'hero-typewriter');
  style.textContent = `
    #syntek-welcome-typewriter {
      position: relative;
      display: inline-block;
    }
    #syntek-welcome-typewriter .welcome-text {
      position: relative;
      display: inline-block;
      white-space: pre-wrap;
      text-align: center;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      color: inherit;
    }
    #syntek-welcome-typewriter .welcome-placeholder {
      visibility: hidden;
      display: inline-block;
      white-space: pre-wrap;
    }
    #syntek-welcome-typewriter .welcome-first,
    #syntek-welcome-typewriter .welcome-rest,
    #syntek-welcome-typewriter .typewriter-typed {
      color: #b3b3b3;
    }
    #syntek-welcome-typewriter .welcome-typewriter {
      position: absolute;
      inset: 0;
      display: inline-block;
      text-align: center;
      white-space: pre-wrap;
      pointer-events: none;
    }
    #syntek-welcome-typewriter .typewriter-typed {
      display: inline;
      vertical-align: middle;
    }
    #syntek-welcome-typewriter .typewriter-cursor {
      display: inline-block;
      width: 8px;
      height: 1em;
      background: currentColor;
      border-radius: 1px;
      margin-left: 6px;
      vertical-align: middle;
      opacity: 1;
      transition: opacity 300ms ease;
      animation: tw-caret-blink 1s steps(1, end) infinite;
      will-change: opacity;
    }
    @keyframes tw-caret-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    #syntek-welcome-typewriter .typewriter-cursor.done {
      animation: none;
      opacity: 0;
      transition: opacity 280ms ease;
    }
    @media (prefers-reduced-motion: reduce) {
      #syntek-welcome-typewriter .typewriter-cursor {
        animation: none;
        opacity: 1;
      }
      #syntek-welcome-typewriter .typewriter-cursor.done {
        opacity: 0;
        transition: opacity 200ms linear;
      }
    }
    @media (max-width: 768px) {
      #syntek-welcome-typewriter .welcome-rest {
        display: block;
        text-align: center;
      }
      #syntek-welcome-typewriter .welcome-rest .agent-name {
        display: inline-block;
      }
    }
  `;
  document.head.appendChild(style);
  heroStyleSheet = style.sheet as CSSStyleSheet;
});

beforeEach(() => {
  observedElements = [];
  intersectionCallback = null;
  vi.useFakeTimers();
  try {
    window.localStorage.clear();
  } catch {}
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function renderHero() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<AIChatInterface />} />
      </Routes>
    </MemoryRouter>
  );
}

function startTypewriter() {
  if (!intersectionCallback || observedElements.length === 0) return;
  act(() => {
    intersectionCallback!(observedElements.map((element) => ({
      isIntersecting: true,
      target: element,
      intersectionRatio: 1,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: performance.now(),
    })) as IntersectionObserverEntry[]);
  });
}

describe('Hero typewriter', () => {
  it('renders hidden placeholder and overlay structure immediately', () => {
    renderHero();

    const placeholder = document.querySelector('#syntek-welcome-typewriter .welcome-placeholder') as HTMLElement | null;
    const typed = document.querySelector('#syntek-welcome-typewriter .typewriter-typed');
    const cursor = document.querySelector('#syntek-welcome-typewriter .typewriter-cursor');

    expect(placeholder).not.toBeNull();
    expect(getComputedStyle(placeholder!).visibility).toBe('hidden');
    expect(typed).not.toBeNull();
    expect(cursor).not.toBeNull();
  });

  it('keeps caret aligned with typed color and fades on completion', async () => {
    renderHero();
    startTypewriter();

    const typed = document.querySelector('#syntek-welcome-typewriter .typewriter-typed') as HTMLElement;
    const cursor = document.querySelector('#syntek-welcome-typewriter .typewriter-cursor') as HTMLElement;

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const typedColor = getComputedStyle(typed).color;
    expect(getComputedStyle(cursor).backgroundColor).toBe(typedColor);
    expect(getComputedStyle(cursor).width).toBe('8px');

    await act(async () => {
      vi.runAllTimers();
    });

    expect(cursor.classList.contains('done')).toBe(true);
    expect(getComputedStyle(cursor).opacity).toBe('0');
  });

  it('preserves layout position before and after animation', async () => {
    renderHero();
    startTypewriter();

    const wrapper = document.getElementById('syntek-welcome-typewriter') as HTMLElement;
    const initialTop = wrapper.getBoundingClientRect().top;

    await act(async () => {
      vi.runAllTimers();
    });

    const finalTop = wrapper.getBoundingClientRect().top;
    expect(finalTop).toBe(initialTop);
  });

  it('replays animation when agent changes and updates caret color', async () => {
    renderHero();
    startTypewriter();

    const typed = document.querySelector('#syntek-welcome-typewriter .typewriter-typed') as HTMLElement;
    const cursor = document.querySelector('#syntek-welcome-typewriter .typewriter-cursor') as HTMLElement;

    await act(async () => {
      vi.runAllTimers();
    });
    expect(typed.textContent).toBe('Welcome, Commander. Meet your Commander');

    const selectorButton = document.querySelector('button.select-agent') as HTMLButtonElement;
    fireEvent.click(selectorButton);

    const connectorOption = screen.getByRole('option', { name: 'Connector' });
    fireEvent.click(connectorOption);

    expect(cursor.classList.contains('done')).toBe(false);

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      vi.runAllTimers();
    });

    expect(typed.textContent).toBe('Welcome, Commander. Meet your Connector');
    const agentSpan = typed.querySelector('.agent-name') as HTMLElement;
    if (agentSpan) {
      expect(getComputedStyle(cursor).backgroundColor).toBe(getComputedStyle(agentSpan).color);
    }
    expect(cursor.classList.contains('done')).toBe(true);
  });

  it('includes a mobile stacking rule for the welcome rest span', () => {
    renderHero();

    expect(heroStyleSheet).toBeTruthy();

    const mediaRule = Array.from(heroStyleSheet!.cssRules).find((rule) => {
      return (rule as CSSMediaRule)?.conditionText?.includes('max-width: 768px');
    }) as CSSMediaRule | undefined;

    expect(mediaRule).toBeTruthy();

    const hasBlockRule = Array.from(mediaRule!.cssRules).some((rule) => {
      return (rule as CSSStyleRule).selectorText === '#syntek-welcome-typewriter .welcome-rest'
        && (rule as CSSStyleRule).style.display === 'block';
    });

    expect(hasBlockRule).toBe(true);
  });
});
