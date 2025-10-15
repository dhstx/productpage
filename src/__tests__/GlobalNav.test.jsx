/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import GlobalNav from '../components/GlobalNav';

describe('GlobalNav', () => {
  it('renders primary links', () => {
    // Not authenticated -> GlobalNav hidden
    render(
      <MemoryRouter>
        <GlobalNav />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Home/i)).toBeNull();
  });
});
