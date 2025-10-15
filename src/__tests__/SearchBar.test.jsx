import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('SearchBar', () => {
  it('filters results by query and shows list', () => {
    renderWithRouter(<SearchBar />);
    const input = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(input, { target: { value: 'integ' } });
    const result = screen.findByText(/Integrations/i);
    return expect(result).resolves.toBeTruthy();
  });
});
