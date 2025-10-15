import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import PublicLayout from '../components/PublicLayout';

function TestPage() {
  return <div>Test Page Content</div>;
}

describe('PublicLayout', () => {
  it('should not render GlobalNav on public pages', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify the test page content is rendered
    expect(screen.getByText('Test Page Content')).toBeTruthy();
    
    // Verify GlobalNav elements are NOT present
    // GlobalNav contains links to "Home", "Agents", "Integrations", etc.
    const homeLinks = screen.queryAllByRole('link', { name: /home/i });
    const agentsLinks = screen.queryAllByRole('link', { name: /agents/i });
    
    // These should not exist on public pages
    expect(homeLinks.length).toBe(0);
    expect(agentsLinks.length).toBe(0);
  });

  it('should not render SearchBar on public pages', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // SearchBar has a search input with placeholder text
    const searchInput = screen.queryByPlaceholderText(/search agents, integrations, pages/i);
    expect(searchInput).toBeNull();
  });
});
