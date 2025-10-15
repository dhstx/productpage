/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import GlobalNav from '../components/GlobalNav';

describe('GlobalNav', () => {
  it('renders primary links', () => {
    render(
      <MemoryRouter>
        <GlobalNav />
      </MemoryRouter>
    );
    expect(screen.getByText(/Home/i)).toBeTruthy();
    expect(screen.getByText(/Integrations/i)).toBeTruthy();
    expect(screen.getByText(/Pricing/i)).toBeTruthy();
  });
});
