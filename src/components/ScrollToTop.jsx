import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { storageKeys } from '../lib/scrollState';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If a pending scroll restoration is queued (from an in-page BackArrow),
    // do not force-scroll to top; the ScrollHistoryManager will restore it.
    try {
      const storage = typeof window !== 'undefined' ? window.sessionStorage : null;
      const hasPending = storage && storage.getItem(storageKeys.pendingScroll) !== null;
      if (hasPending) {
        return;
      }
    } catch {
      // If sessionStorage is unavailable, fall back to default behavior
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

