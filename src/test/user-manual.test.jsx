import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserManual from '@/pages/UserManual';
import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'vitest-axe';

expect.extend(toHaveNoViolations);

function renderManual(initial = '/user-manual') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <UserManual />
    </MemoryRouter>
  );
}

describe('User Manual', () => {
  beforeEach(() => {
    // Ensure JSDOM viewport changes don't affect tests
  });

  it('renders title and left nav', async () => {
    renderManual('/user-manual');
    expect(await screen.findByRole('heading', { name: /how can we help\?/i })).toBeTruthy();
    // Left nav category link
    expect(screen.getByText(/Getting started/i)).toBeTruthy();
  });

  it('builds right TOC anchors', async () => {
    renderManual('/user-manual');
    // We expect an "On this page" section if headings exist
    expect(await screen.findByText(/On this page/i)).toBeTruthy();
  });

  it('focuses search on ⌘/Ctrl+K and closes on Esc', async () => {
    renderManual('/user-manual');
    const input = await screen.findByLabelText(/Search help/i);
    // Trigger Cmd/Ctrl+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(document.activeElement).toBe(input);
    // Close with Esc
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).not.toBe(input);
  });

  it('has no basic accessibility violations', async () => {
    const { container } = renderManual('/user-manual');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
