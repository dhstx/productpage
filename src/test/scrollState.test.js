import { describe, expect, beforeEach, it } from 'vitest';
import {
  clearLastLocation,
  consumePendingScroll,
  getLastLocation,
  isSameOrigin,
  queueScrollRestoration,
  shouldShowBackArrow,
  storeLastLocation,
} from '../lib/scrollState';

const resetEnvironment = () => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/product');
};

const buildSameOriginUrl = (path) => `${window.location.origin}${path}`;

describe('scrollState utilities', () => {
  beforeEach(() => {
    resetEnvironment();
  });

  it('stores and retrieves last location for same-origin URLs', () => {
    const landingUrl = buildSameOriginUrl('/landing');
    expect(isSameOrigin(landingUrl)).toBe(true);
    storeLastLocation(landingUrl, 320);
    expect(getLastLocation()).toEqual({ url: landingUrl, scroll: 320 });
  });

  it('normalizes invalid scroll values to zero', () => {
    const landingUrl = buildSameOriginUrl('/landing');
    storeLastLocation(landingUrl, -50);
    expect(getLastLocation()).toEqual({ url: landingUrl, scroll: 0 });
  });

  it('ignores cross-origin URLs when storing history', () => {
    storeLastLocation('https://example.com/external', 150);
    expect(getLastLocation()).toBeNull();
  });

  it('queues and consumes pending scroll restoration', () => {
    queueScrollRestoration(420);
    expect(consumePendingScroll()).toBe(420);
    expect(consumePendingScroll()).toBeNull();
  });

  it('determines visibility of the back arrow based on stored state', () => {
    const landingUrl = buildSameOriginUrl('/landing');
    storeLastLocation(landingUrl, 200);
    window.history.replaceState({}, '', '/product');
    expect(shouldShowBackArrow(window.location.href)).toBe(true);

    // Same URL should not trigger the arrow
    storeLastLocation(window.location.href, 10);
    expect(shouldShowBackArrow(window.location.href)).toBe(false);
  });

  it('clears stored history entries', () => {
    const landingUrl = buildSameOriginUrl('/landing');
    storeLastLocation(landingUrl, 120);
    clearLastLocation();
    expect(getLastLocation()).toBeNull();
  });
});

