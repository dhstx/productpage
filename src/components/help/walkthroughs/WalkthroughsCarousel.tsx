'use client';

import * as React from 'react';
// @ts-expect-error: JSON modules are provided by the bundler.
import data from '@/content/manual/walkthroughs.json';
// import data from '../../../content/manual/walkthroughs.json';
import { YouTube } from '@/components/YouTube';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';

type Walkthrough = {
  title: string;
  summary?: string;
  videoId: string;
  duration?: string;
};

function resolveWalkthroughs(): Walkthrough[] {
  const source = (data as any)?.default ?? data;
  return Array.isArray(source) ? (source as Walkthrough[]) : [];
}

function isWalkthroughsForced(): boolean {
  try {
    const candidates = [
      (import.meta as any)?.env?.NEXT_PUBLIC_WALKTHROUGHS_FORCE,
      (import.meta as any)?.env?.VITE_WALKTHROUGHS_FORCE,
      typeof process !== 'undefined' ? (process as any)?.env?.NEXT_PUBLIC_WALKTHROUGHS_FORCE : undefined,
      typeof process !== 'undefined' ? (process as any)?.env?.VITE_WALKTHROUGHS_FORCE : undefined,
      typeof window !== 'undefined' ? window.localStorage?.getItem('NEXT_PUBLIC_WALKTHROUGHS_FORCE') : undefined,
    ];
    const raw = candidates.find((val) => typeof val === 'string' && val.length > 0);
    return raw ? /^(1|true|yes|on)$/i.test(raw.toString()) : false;
  } catch {
    return false;
  }
}

export default function WalkthroughsCarousel() {
  const list = React.useMemo(() => resolveWalkthroughs(), []);
  const safeMode = React.useMemo(() => isHelpSafeMode(), []);
  const force = React.useMemo(() => isWalkthroughsForced(), []);
  const devMode = React.useMemo(() => isDevEnvironment(), []);
  const allow = !safeMode || force || devMode;
  const items = React.useMemo(() => {
    if (!list.length) return [] as Walkthrough[];
    return [...list, ...list, ...list];
  }, [list]);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [pause, setPause] = React.useState(false);

  React.useEffect(() => {
    if (!devMode) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log('[walkthroughs:carousel] mount', {
      allow,
      safeMode,
      force,
      devBypass: devMode && safeMode,
      len: list.length,
    });
  }, [allow, safeMode, force, list.length, devMode]);

  React.useEffect(() => {
    if (!allow || !list.length) {
      return;
    }
    const el = boxRef.current;
    if (!el) {
      return;
    }

    let raf = 0;
    const tick = () => {
      if (!pause) {
        el.scrollBy({ left: 1, behavior: 'auto' });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollTo({ left: 0, behavior: 'auto' });
        }
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [allow, list.length, pause]);

  if (!allow) {
    return null;
  }

  if (!list.length) {
    return (
      <section aria-labelledby="walkthroughs-carousel-title" className="mt-6">
        <h3 id="walkthroughs-carousel-title" className="text-lg font-semibold mb-3">
          Featured Walkthroughs
        </h3>
        <p className="text-sm text-muted-foreground">No walkthroughs yet.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="walkthroughs-carousel-title" className="mt-6">
      <h3 id="walkthroughs-carousel-title" className="text-lg font-semibold mb-3">
        Featured Walkthroughs
      </h3>
      <div
        ref={boxRef}
        className="relative flex gap-6 overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
        onFocusCapture={() => setPause(true)}
        onBlurCapture={() => setPause(false)}
      >
        {items.map((v, i) => (
          <figure key={`${v.videoId}-${i}`} className="min-w-[640px] max-w-[720px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
            <YouTube videoId={v.videoId} title={v.title} />
            <figcaption className="mt-2">
              <div className="text-base font-medium">{v.title}</div>
              {v.summary && <p className="text-sm opacity-80">{v.summary}</p>}
              {v.duration && <p className="text-xs opacity-70">Duration: {v.duration}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="sr-only">Carousel auto-scrolls; hover or focus to pause. Use shift+wheel or arrows to scroll.</p>
    </section>
  );
}
