import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AIChatInterface from '../components/AIChatInterface';

const ORIGINAL_MATCH_MEDIA = typeof window !== 'undefined' ? window.matchMedia : undefined;
const ORIGINAL_INTERSECTION_OBSERVER = typeof window !== 'undefined' ? window.IntersectionObserver : undefined;
const ORIGINAL_INNER_WIDTH = typeof window !== 'undefined' ? window.innerWidth : undefined;

describe('AIChatInterface welcome banner', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    if (typeof window !== 'undefined') {
      window.innerWidth = 500;

      window.matchMedia = vi.fn((query) => {
        const matchesReduced = query.includes('prefers-reduced-motion');
        const matchesMobile = query.includes('max-width: 768px');
        return {
          matches: matchesReduced ? true : matchesMobile ? window.innerWidth <= 768 : false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        };
      });

      class ImmediateIntersectionObserver {
        constructor(callback) {
          this.callback = callback;
        }

        observe(element) {
          this.callback([{ isIntersecting: true, target: element }]);
        }

        unobserve() {}

        disconnect() {}
      }

      window.IntersectionObserver = ImmediateIntersectionObserver;
    }
  });

  afterEach(() => {
    if (typeof window !== 'undefined') {
      if (ORIGINAL_MATCH_MEDIA) {
        window.matchMedia = ORIGINAL_MATCH_MEDIA;
      }
      if (ORIGINAL_INTERSECTION_OBSERVER) {
        window.IntersectionObserver = ORIGINAL_INTERSECTION_OBSERVER;
      }
      if (ORIGINAL_INNER_WIDTH !== undefined) {
        window.innerWidth = ORIGINAL_INNER_WIDTH;
      }
    }
  });

  it('reserves placeholder geometry, stacks on mobile, exposes typewriter metadata, and renders check icon for the agent option', async () => {
    const { container } = render(
      <MemoryRouter>
        <AIChatInterface />
      </MemoryRouter>
    );

    const placeholder = container.querySelector('.welcome-placeholder');
    expect(placeholder).toBeTruthy();

    const placeholderFirst = placeholder?.querySelector('.welcome-first');
    expect(placeholderFirst?.textContent).toBe('Welcome, Commander.');

    const placeholderRest = placeholder?.querySelector('.welcome-rest');
    expect(placeholderRest?.textContent).toBe(' Meet your Chief of Staff');

    const placeholderStyle = placeholder ? window.getComputedStyle(placeholder) : null;
    expect(placeholderStyle?.visibility).toBe('hidden');

    const typewriter = container.querySelector('.welcome-typewriter');
    expect(typewriter).toBeTruthy();
    expect(typewriter?.getAttribute('data-final-first')).toBe('Welcome, Commander.');
    expect(typewriter?.getAttribute('data-final-rest')).toBe(' Meet your Chief of Staff');
    const expectedPauseIndex = 'Welcome, Commander.'.length - 1;
    expect(Number(typewriter?.getAttribute('data-pause-index'))).toBe(expectedPauseIndex);

    expect(window.matchMedia('(max-width: 768px)').matches).toBe(true);

    const stylesheetText = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ');
    expect(stylesheetText.includes('@media (max-width: 768px)')).toBe(true);
    expect(stylesheetText.includes('.welcome-rest { display: block')).toBe(true);

    const toggleButton = await screen.findByRole('button', { name: /chief of staff/i });
    const user = userEvent.setup();
    await user.click(toggleButton);

    const chiefOption = await screen.findByRole('option', { name: 'Chief of Staff' });
    const checkIcon = chiefOption.querySelector('.agent-option-check');
    expect(checkIcon).toBeTruthy();
  });
});
