'use client';

import * as React from 'react';
import { YouTube } from '@/components/YouTube';
import { walkthroughs } from './data';

export default function WalkthroughsCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHover, setHover] = React.useState(false);

  const baseItems = React.useMemo(() => walkthroughs, []);
  const items = React.useMemo(() => {
    if (baseItems.length === 0) return baseItems;
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  const autoScrollEnabled = items.length > 1;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !autoScrollEnabled) return;
    if (typeof window === 'undefined') return;
    if (typeof el.scrollBy !== 'function' || typeof el.scrollTo !== 'function') return;

    const request = typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame.bind(window) : null;
    const cancel = typeof window.cancelAnimationFrame === 'function' ? window.cancelAnimationFrame.bind(window) : null;
    if (!request || !cancel) return;

    el.scrollTo({ left: 0, behavior: 'auto' });

    let raf: number | null = null;

    const step = () => {
      if (isHover) {
        raf = request(step);
        return;
      }

      el.scrollBy({ left: 1, behavior: 'auto' });
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (maxScrollLeft > 0 && el.scrollLeft >= maxScrollLeft - 2) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      }

      raf = request(step);
    };

    raf = request(step);

    return () => {
      if (raf !== null) {
        cancel(raf);
      }
    };
  }, [autoScrollEnabled, isHover]);

  if (!Array.isArray(baseItems) || baseItems.length === 0) return null;

  const pause = () => setHover(true);
  const resume = () => setHover(false);

  return (
    <section
      aria-labelledby="walkthroughs-carousel-title"
      className="mt-8"
      data-testid="walkthroughs-carousel"
    >
      <h3 id="walkthroughs-carousel-title" className="mb-3 text-lg font-semibold">
        Featured Walkthroughs
      </h3>
      <div
        ref={containerRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        className="relative flex gap-6 overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((v, i) => (
          <figure
            key={`${v.videoId}-${i}`}
            className="shrink-0"
            style={{ scrollSnapAlign: 'start', minWidth: '640px', maxWidth: '720px' }}
          >
            <YouTube videoId={v.videoId} title={v.title} poster={v.poster} />
            <figcaption className="mt-2 space-y-1">
              <div className="text-base font-medium">{v.title}</div>
              {v.summary ? <p className="text-sm opacity-80">{v.summary}</p> : null}
              {v.duration ? <p className="text-xs opacity-70">Duration: {v.duration}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="sr-only">
        Carousel auto-scrolls; hover or focus to pause. Use shift+mousewheel or arrow keys to scroll.
      </p>
    </section>
  );
}
