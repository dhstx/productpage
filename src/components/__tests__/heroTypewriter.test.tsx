import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react';
import AIChatInterface from '../AIChatInterface.jsx';

vi.mock('../chat/ChatTools', () => ({
  default: () => null,
}));

vi.mock('../MessageBubble', () => ({
  default: () => null,
}));

vi.mock('../ConversationHistory', () => ({
  default: () => null,
}));

vi.mock('../UpfadeOnOpen', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('../ui/agentThemes', () => ({
  getAgentColor: (name: string, fallback?: string) => {
    const palette: Record<string, string> = {
      Commander: '#FFC96C',
      Connector: '#75E3FF',
      Conductor: '#F38D8D',
    };
    return palette[name] || fallback || '#FFC96C';
  },
}));

vi.mock('../../lib/agents-enhanced', () => ({
  agents: [
    { id: 'commander', name: 'Commander', color: '#FFC96C', icon: 'Bot', domain: 'ops' },
    { id: 'connector', name: 'Connector', color: '#75E3FF', icon: 'Spark', domain: 'sales' },
    { id: 'conductor', name: 'Conductor', color: '#F38D8D', icon: 'Wave', domain: 'ops' },
  ],
}));

vi.mock('../../lib/api/agentClient', () => ({
  sendMessage: vi.fn(),
  getSession: vi.fn(),
}));

declare global {
  interface Window {
    IntersectionObserver: any;
  }
}

const setupWindowMocks = () => {
  class MockIntersectionObserver {
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }

    disconnect() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: () => false,
    })),
  });

  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
  });
};

const renderHero = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<AIChatInterface initialAgent="Commander" />} />
      </Routes>
    </MemoryRouter>
  );

describe('syntek hero typewriter', () => {
  beforeAll(() => {
    setupWindowMocks();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    cleanup();
  });

  it('renders placeholder and overlay structure with hidden geometry reserved', () => {
    const { container } = renderHero();
    const placeholder = container.querySelector('#syntek-welcome-typewriter .welcome-placeholder') as HTMLElement | null;
    expect(placeholder).not.toBeNull();
    expect(placeholder?.getAttribute('aria-hidden')).toBe('true');
    expect(placeholder?.style.visibility).toBe('hidden');

    const overlay = container.querySelector('#syntek-welcome-typewriter .welcome-typewriter') as HTMLElement | null;
    expect(overlay).not.toBeNull();
    expect(overlay?.style.position).toBe('absolute');
    expect(overlay?.querySelector('.typewriter-typed')).not.toBeNull();

    const cursor = overlay?.querySelector('.typewriter-cursor') as HTMLElement | null;
    expect(cursor).not.toBeNull();
    expect(cursor?.style.background?.toLowerCase()).toBe('currentcolor');
    expect(cursor?.style.width).toBe('8px');
  });

  it('completes animation, fades cursor, and maintains layout', () => {
    const { container } = renderHero();
    const wrapper = container.querySelector('#syntek-welcome-typewriter') as HTMLElement;
    const cursor = wrapper.querySelector('.typewriter-cursor') as HTMLElement;

    const topBefore = wrapper.getBoundingClientRect().top;

    act(() => {
      vi.runAllTimers();
    });

    expect(cursor.className).toContain('done');
    const typed = wrapper.querySelector('.typewriter-typed') as HTMLElement;
    expect(typed.textContent).toBe('Welcome, Commander. Meet your Commander');

    const topAfter = wrapper.getBoundingClientRect().top;
    expect(topAfter).toBe(topBefore);
  });

  it('restarts typing with new agent selection and updates text/caret', () => {
    const { container } = renderHero();

    act(() => {
      vi.runAllTimers();
    });

    const toggle = screen.getByRole('button', { name: /Commander/i });
    act(() => {
      fireEvent.click(toggle);
    });

    const connectorOption = screen.getByRole('option', { name: /Connector/i });
    act(() => {
      fireEvent.click(connectorOption);
    });

    const typed = container.querySelector('#syntek-welcome-typewriter .typewriter-typed') as HTMLElement;
    const cursor = container.querySelector('#syntek-welcome-typewriter .typewriter-cursor') as HTMLElement;

    expect(typed.textContent).toBe('');
    expect(cursor.className).not.toContain('done');

    const doneSpy = vi.fn();
    document.addEventListener('typewriter:done', doneSpy);
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    document.removeEventListener('typewriter:done', doneSpy);

    expect(doneSpy).toHaveBeenCalled();

    const typedAfter = container.querySelector('#syntek-welcome-typewriter .typewriter-typed') as HTMLElement;
    const cursorAfter = container.querySelector('#syntek-welcome-typewriter .typewriter-cursor') as HTMLElement;

    expect(typedAfter.textContent).toBe('Welcome, Commander. Meet your Connector');
    expect(cursorAfter.className).toContain('done');
  });
});
