import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DHStxCogwheelLoader } from '../DHStxCogwheelLoader';

describe('DHStxCogwheelLoader', () => {
  beforeEach(() => {
    // Mock matchMedia for normal motion
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with default text', () => {
    const { container } = render(<DHStxCogwheelLoader />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders without text when text prop is empty string', () => {
    const { container } = render(<DHStxCogwheelLoader text="" />);
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('respects prefers-reduced-motion', () => {
    // Mock matchMedia to return reduced motion preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<DHStxCogwheelLoader />);
    
    // Check that the component renders without errors
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // The component should not have inline transform styles when reduced motion is preferred
    // (anime.js won't be initialized, so no transforms will be applied)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBe(2);
  });

  it('renders with custom size', () => {
    const { container } = render(<DHStxCogwheelLoader size="lg" />);
    const statusDiv = container.querySelector('[role="status"]');
    expect(statusDiv).toBeInTheDocument();
  });

  it('renders with custom speed', () => {
    const { container } = render(<DHStxCogwheelLoader speed="fast" />);
    const statusDiv = container.querySelector('[role="status"]');
    expect(statusDiv).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<DHStxCogwheelLoader />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
});
