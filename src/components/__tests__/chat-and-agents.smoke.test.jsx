import { describe, it, beforeAll, afterAll, afterEach, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LandingChatInterface from '../LandingChatInterface';
import AIAgents from '../AIAgents';

const setupStubbedApis = () => {
  const matchMediaMock = vi.fn().mockImplementation(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  vi.stubGlobal('matchMedia', matchMediaMock);

  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }

    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  class MockResizeObserver {
    constructor() {}
    observe() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', MockResizeObserver);

  vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 0));
  vi.stubGlobal('cancelAnimationFrame', (id) => clearTimeout(id));
};

describe('Landing chat and agents popup smoke tests', () => {
  beforeAll(() => {
    setupStubbedApis();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders the updated greeting and default agent name', async () => {
    render(
      <MemoryRouter>
        <LandingChatInterface />
      </MemoryRouter>
    );

    const greeting = await screen.findByText('Welcome, Commander. Meet your Chief of Staff');
    expect(greeting).toBeVisible();

    expect(screen.getAllByText('Chief of Staff')[0]).toBeInTheDocument();
  });

  it('opens the agents popup and focuses the close control on open', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AIAgents />
      </MemoryRouter>
    );

    const viewButton = screen.getByRole('button', { name: /view all agents/i });
    await user.click(viewButton);

    const dialog = await screen.findByRole('dialog', { name: /all agents/i });
    expect(dialog).toBeVisible();

    const closeButton = within(dialog).getByRole('button', { name: /close/i });
    await waitFor(() => expect(closeButton).toHaveFocus());

    const chiefOfStaffTile = within(dialog).getAllByText('Chief of Staff')[0];
    expect(chiefOfStaffTile).toBeVisible();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: /all agents/i })).not.toBeInTheDocument());
    expect(viewButton).toHaveFocus();
  });
});
