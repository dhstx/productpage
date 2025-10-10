import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  clearLastLocation,
  consumePendingScroll,
  isBackArrowEnabled,
  isSameOrigin,
  storeLastLocation,
} from '../lib/scrollState';

const shouldIgnoreAnchor = (anchor) => {
  if (!anchor) {
    return true;
  }

  if (anchor.target && anchor.target !== '_self') {
    return true;
  }

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true;
  }

  if (anchor.hasAttribute('download')) {
    return true;
  }

  return false;
};

export default function ScrollHistoryManager() {
  const location = useLocation();
  const featureEnabled = useMemo(isBackArrowEnabled, []);
  const hasInitializedRef = useRef(false);
  const lastScrollRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    if (!featureEnabled || typeof window === 'undefined') {
      return;
    }

    const updateScroll = () => {
      lastScrollRef.current = window.scrollY;
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, [featureEnabled]);

  useEffect(() => {
    if (!featureEnabled) {
      return;
    }

    const pendingScroll = consumePendingScroll();
    if (pendingScroll === null) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: pendingScroll, behavior: 'auto' });
    });
  }, [featureEnabled, location]);

  useEffect(() => {
    if (!featureEnabled) {
      return;
    }

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (typeof document !== 'undefined' && document.referrer && isSameOrigin(document.referrer)) {
        storeLastLocation(document.referrer, 0);
      } else {
        clearLastLocation();
      }
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const previousUrl = window.location.href;

    const handleAnchorClick = (event) => {
      if (!event || event.defaultPrevented) {
        return;
      }

      const anchor = event.target.closest('a');
      if (shouldIgnoreAnchor(anchor)) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) {
          return;
        }
        if (targetUrl.href === window.location.href) {
          return;
        }

        storeLastLocation(window.location.href, lastScrollRef.current);
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [featureEnabled]);

  return null;
}

