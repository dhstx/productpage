'use client';

import * as React from 'react';
import { YouTube } from '@/components/YouTube';
import { loadWalkthroughs, type Walkthrough } from './loadWalkthroughs';

export default function WalkthroughsCarousel(): JSX.Element | null {
  const [list, setList] = React.useState<Walkthrough[]>([]);
  const loggedRef = React.useRef(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    loadWalkthroughs()
      .then((data) => {
        const safeList = Array.isArray(data) ? data : [];
        if (!loggedRef.current && process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('[walkthroughs:carousel] len=', safeList.length);
          loggedRef.current = true;
        }
        if (mounted) setList(safeList);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[walkthroughs:carousel] load failed', error);
        }
        if (mounted) setList([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!list.length) return;
    const el = boxRef.current;
    if (!el) return;

    let rafId: number;
    const step = () => {
      if (!paused) {
        el.scrollBy({ left: 1, behavior: 'auto' });
        const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
        if (nearEnd) {
          el.scrollTo({ left: 0, behavior: 'auto' });
        }
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [list, paused]);

  if (!list.length) return null;

  const items = React.useMemo(() => [...list, ...list, ...list], [list]);

  return (
    <section aria-labelledby="walkthroughs-carousel-title" className="mt-6">
      <h3 id="walkthroughs-carousel-title" className="text-lg font-semibold mb-3">
        Featured Walkthroughs
      </h3>
      <div
        ref={boxRef}
        className="relative flex gap-6 overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {items.map((item, index) => (
          <figure
            key={`${item.videoId}-${index}`}
            className="min-w-[640px] max-w-[720px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <YouTube videoId={item.videoId} title={item.title} />
            <figcaption className="mt-2">
              <div className="text-base font-medium">{item.title}</div>
              {item.summary ? <p className="text-sm opacity-80">{item.summary}</p> : null}
              {item.duration ? <p className="text-xs opacity-70">Duration: {item.duration}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

