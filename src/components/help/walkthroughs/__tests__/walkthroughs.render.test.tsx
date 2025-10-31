import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserManual from '@/user-manual/UserManual';

function renderManual(pathname: string) {
  try {
    window.localStorage.removeItem('NEXT_PUBLIC_HELP_SAFE_MODE');
  } catch {}

  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/user-manual/*" element={<UserManual />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('User Manual walkthroughs experience', () => {
  beforeEach(() => {
    renderManual('/user-manual');
  });

  it('renders the Walkthroughs heading from MDX', async () => {
    const heading = await screen.findByRole('heading', { name: /walkthroughs/i, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('shows an auto-scrolling carousel with wide items', async () => {
    const carousel = await screen.findByTestId('walkthroughs-carousel');
    const figures = within(carousel).getAllByRole('figure');
    expect(figures.length).toBeGreaterThan(0);
    expect((figures[0] as HTMLElement).style.minWidth).toBe('640px');
  });

  it('renders at least six grid items from the walkthroughs data', async () => {
    const grid = await screen.findByTestId('walkthroughs-grid');
    const figures = within(grid).getAllByRole('figure');
    expect(figures.length).toBeGreaterThanOrEqual(6);
  });
});
