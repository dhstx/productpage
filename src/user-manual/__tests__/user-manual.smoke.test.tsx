import { vi } from 'vitest';

vi.mock('../../components/help/walkthroughs/ArrowSlider', () => ({
  default: () => (
    <section data-testid="walkthrough-slider" role="group" aria-label="Walkthrough videos">
      <figure />
    </section>
  ),
}));

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

import UserManual from '../UserManual';

function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/user-manual/*" element={<UserManual />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('User Manual smoke tests', () => {
  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }
  });

  afterEach(() => {
    cleanup();
  });

  it('sets the --um-title-color variable and applies it to the active tab', async () => {
    renderAt('/user-manual');

    await screen.findByRole('heading', { name: /user manual/i });

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--um-title-color')).not.toBe('');
    });

    const activeTab = screen.getByRole('link', { name: /overview/i });
    expect(activeTab.className).toContain('dark:text-[color:var(--um-title-color)]');
  });

  it('renders the walkthrough slider only on the walkthroughs route', async () => {
    const overview = renderAt('/user-manual');
    expect(overview.queryByTestId('walkthrough-slider')).toBeNull();

    cleanup();

    renderAt('/user-manual/walkthroughs');

    const slider = await screen.findByTestId('walkthrough-slider');
    expect(slider).toBeInTheDocument();
  });

  it('reserves identical subnav height between overview and walkthroughs', () => {
    const { container: overviewContainer } = renderAt('/user-manual');
    const overviewSubnav = overviewContainer.querySelector('.um-subnav');
    expect(overviewSubnav).not.toBeNull();
    const overviewClassName = overviewSubnav?.className;

    cleanup();

    const { container: walkthroughContainer } = renderAt('/user-manual/walkthroughs');
    const walkthroughSubnav = walkthroughContainer.querySelector('.um-subnav');
    expect(walkthroughSubnav).not.toBeNull();
    expect(walkthroughSubnav?.className).toBe(overviewClassName);
  });
});
