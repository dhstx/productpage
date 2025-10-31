'use client';

import * as React from 'react';
import data from '@/content/manual/walkthroughs.json';
import { YouTube } from '@/components/YouTube';

type WalkthroughItem = {
  videoId: string;
  title: string;
  summary?: string;
  duration?: string;
};

function toSlides(input: unknown): WalkthroughItem[] {
  if (!Array.isArray(input)) return [];
  return input.filter((item): item is WalkthroughItem => typeof item?.videoId === 'string' && typeof item?.title === 'string');
}

const buttonBase =
  'rounded border border-neutral-300 bg-neutral-50 px-2 py-1 text-lg leading-none text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950';

export default function WalkthroughsSlider() {
  const slides = React.useMemo(() => toSlides(data), []);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!slides.length) {
      setIndex(0);
      return;
    }
    setIndex((prev) => Math.min(prev, slides.length - 1));
  }, [slides.length]);

  const next = React.useCallback(() => {
    setIndex((current) => Math.min(current + 1, slides.length - 1));
  }, [slides.length]);

  const prev = React.useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  if (!slides.length) return null;

  return (
    <section aria-labelledby="walkthroughs-carousel-title" className="mt-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="walkthroughs-carousel-title" className="text-2xl font-semibold">
          Walkthroughs
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous video"
            onClick={prev}
            className={buttonBase}
            disabled={index === 0}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={next}
            className={buttonBase}
            disabled={index === slides.length - 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <figure
              key={slide.videoId ?? i}
              className="flex basis-full shrink-0 flex-col gap-3 px-4 py-4 md:px-6 md:py-6"
              aria-label={`${slide.title} (${i + 1} of ${slides.length})`}
            >
              <div className="mb-1">
                <YouTube videoId={slide.videoId} title={slide.title} />
              </div>
              <figcaption className="space-y-1">
                <h3 className="text-base font-medium text-neutral-900 line-clamp-2 dark:text-neutral-50">{slide.title}</h3>
                {slide.summary ? (
                  <p className="text-sm text-neutral-600 line-clamp-3 dark:text-neutral-300">{slide.summary}</p>
                ) : null}
                {slide.duration ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Duration: {slide.duration}</p>
                ) : null}
                <a
                  className="text-xs text-amber-600 underline transition hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(slide.videoId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
