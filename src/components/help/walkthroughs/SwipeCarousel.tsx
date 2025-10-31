'use client';

import * as React from 'react';
import { YouTube } from '@/components/YouTube';
import walkthroughsSource from '../../../../content/manual/walkthroughs.json?raw';

type WalkthroughItem = {
  videoId: string;
  title: string;
  summary?: string;
  duration?: string;
};

function ensureList(data: unknown): WalkthroughItem[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is WalkthroughItem => typeof item?.videoId === 'string' && typeof item?.title === 'string');
}

function loadList(raw: string): WalkthroughItem[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return ensureList(parsed);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[walkthroughs:data]', error);
    }
    return [];
  }
}

const GAP_PX = 24;

export default function SwipeCarousel() {
  const list = React.useMemo(() => loadList(walkthroughsSource), []);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const lastIndexRef = React.useRef(0);
  const [, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotionRef = React.useRef(false);
  const autoTimerRef = React.useRef<number>();

  const slideCount = list.length;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      prefersReducedMotionRef.current = media.matches;
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const stopAutoAdvance = React.useCallback(() => {
    if (autoTimerRef.current) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = undefined;
    }
  }, []);

  const snapTo = React.useCallback(
    (target: number, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest', inline: 'center' }) => {
      const el = trackRef.current;
      if (!el) return;
      const slides = Array.from(el.children) as HTMLElement[];
      if (!slides.length) return;
      const max = slides.length - 1;
      let next = target;
      if (next < 0) next = max;
      if (next > max) next = 0;
      slides[next]?.scrollIntoView(options);
      lastIndexRef.current = next;
      setIndex(next);
    },
    []
  );

  const goRelative = React.useCallback(
    (delta: number) => {
      if (slideCount <= 0) return;
      snapTo(lastIndexRef.current + delta);
    },
    [slideCount, snapTo]
  );

  const startAutoAdvance = React.useCallback(() => {
    if (slideCount <= 1) return;
    if (prefersReducedMotionRef.current) return;
    stopAutoAdvance();
    autoTimerRef.current = window.setInterval(() => {
      goRelative(1);
    }, 7000);
  }, [goRelative, slideCount, stopAutoAdvance]);

  React.useEffect(() => {
    if (isPaused) {
      stopAutoAdvance();
      return;
    }
    startAutoAdvance();
    return stopAutoAdvance;
  }, [isPaused, startAutoAdvance, stopAutoAdvance]);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0;
    let scrollX = 0;
    let dragging = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      scrollX = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      setIsPaused(true);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = scrollX - (e.clientX - startX);
    };

    const finalizeDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || `${GAP_PX}`) || GAP_PX;
      const slideWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width ?? 0;
      const divisor = slideWidth + gap;
      const rawIndex = divisor > 0 ? Math.round(el.scrollLeft / divisor) : 0;
      snapTo(rawIndex);
      setTimeout(() => setIsPaused(false), 1500);
    };

    const onPointerLeave = () => {
      if (!dragging) return;
      dragging = false;
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || `${GAP_PX}`) || GAP_PX;
      const slideWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width ?? 0;
      const divisor = slideWidth + gap;
      const rawIndex = divisor > 0 ? Math.round(el.scrollLeft / divisor) : 0;
      snapTo(rawIndex);
      setTimeout(() => setIsPaused(false), 1500);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', finalizeDrag);
    el.addEventListener('pointercancel', finalizeDrag);
    el.addEventListener('pointerleave', onPointerLeave);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', finalizeDrag);
      el.removeEventListener('pointercancel', finalizeDrag);
      el.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [snapTo]);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || `${GAP_PX}`) || GAP_PX;
      const slideWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width ?? 0;
      const divisor = slideWidth + gap;
      if (divisor <= 0) return;
      const approxIndex = Math.round(el.scrollLeft / divisor);
      const clamped = Math.max(0, Math.min(approxIndex, slideCount - 1));
      lastIndexRef.current = clamped;
      setIndex((prev) => (prev === clamped ? prev : clamped));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [slideCount]);

  if (slideCount === 0) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goRelative(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goRelative(-1);
    }
  };

  const pause = () => setIsPaused(true);
  const resumeIfAllowed = (event?: React.FocusEvent<HTMLDivElement>) => {
    if (!event) {
      setIsPaused(false);
      return;
    }
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setIsPaused(false);
  };

  return (
    <section
      aria-labelledby="walkthroughs-carousel-title"
      className="mt-6"
      onMouseEnter={pause}
      onMouseLeave={() => resumeIfAllowed()}
      onFocusCapture={pause}
      onBlurCapture={resumeIfAllowed}
      aria-live="polite"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 id="walkthroughs-carousel-title" className="text-2xl font-semibold">
          Walkthroughs
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous video"
            onClick={() => goRelative(-1)}
            className="rounded border border-neutral-300 px-2 py-1 text-lg leading-none text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={() => goRelative(1)}
            className="rounded border border-neutral-300 px-2 py-1 text-lg leading-none text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-2 [--carousel-gap:24px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' as const }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Walkthrough videos"
      >
        {list.map((item, i) => (
          <figure
            key={item.videoId ?? i}
            className="min-w-[640px] max-w-[720px] shrink-0 rounded-lg bg-neutral-50 p-3 shadow-sm dark:bg-neutral-900"
            style={{ scrollSnapAlign: 'center' }}
            aria-roledescription="slide"
            aria-label={`${item.title} (${i + 1} of ${slideCount})`}
          >
            <YouTube videoId={item.videoId} title={item.title} />
            <figcaption className="mt-3 space-y-1">
              <div className="text-base font-medium text-neutral-900 dark:text-neutral-50">{item.title}</div>
              {item.summary ? <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.summary}</p> : null}
              {item.duration ? <p className="text-xs text-neutral-500 dark:text-neutral-400">Duration: {item.duration}</p> : null}
              <a
                className="text-xs text-neutral-500 underline transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                href={`https://www.youtube.com/watch?v=${encodeURIComponent(item.videoId)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="sr-only">Swipe, drag, or use arrow buttons and keys to navigate videos.</p>
    </section>
  );
}
