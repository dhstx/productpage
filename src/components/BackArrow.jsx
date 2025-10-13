import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getLastLocation,
  isBackArrowEnabled,
  queueScrollRestoration,
  shouldShowBackArrow,
} from '../lib/scrollState';

export default function BackArrow() {
  const location = useLocation();
  const featureEnabled = useMemo(isBackArrowEnabled, []);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!featureEnabled) {
      setTarget(null);
      return;
    }

    const currentUrl = typeof window !== 'undefined' ? window.location.href : undefined;
    if (!currentUrl || !shouldShowBackArrow(currentUrl)) {
      setTarget(null);
      return;
    }

    const lastLocation = getLastLocation();
    if (!lastLocation) {
      setTarget(null);
      return;
    }

    setTarget(lastLocation);
  }, [featureEnabled, location]);

  const handleActivate = useCallback(() => {
    if (!target?.url) {
      return;
    }

    queueScrollRestoration(target.scroll ?? 0);
    window.location.href = target.url;
  }, [target]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleActivate();
      }
    },
    [handleActivate],
  );

  if (!featureEnabled || !target?.url) {
    return null;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Return to previous page"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className="md:fixed md:left-4 md:top-1/2 md:-translate-y-1/2 z-50 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1F1F1F]/70 text-[#8A8A8A] backdrop-blur-sm shadow-lg transition-all duration-200 ease-out md:hover:-translate-x-1 hover:bg-[#1F1F1F]/85 hover:text-[#F2F2F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C] cursor-pointer animate-pulse"
      style={{ animationDuration: '2.8s' }}
    >
      <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
  );
}

