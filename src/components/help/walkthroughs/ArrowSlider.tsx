'use client';

import * as React from 'react';
import { YouTube } from '../../YouTube';
import { WALKTHROUGHS } from '../../../../content/manual/walkthroughs.data';

import './styles.css';

export default function ArrowSlider() {
  const slides = Array.isArray(WALKTHROUGHS) ? WALKTHROUGHS : [];
  const [index, setIndex] = React.useState(0);
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const arrowClass =
    'rounded border border-neutral-300 bg-white px-3 py-1 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40';

  if (!slides.length) return null;

  return (
    <section aria-labelledby="walkthroughs-heading" className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="walkthroughs-heading" className="text-2xl font-semibold uppercase tracking-wide">
          Walkthroughs
        </h2>
        <div className="flex gap-2">
          <button aria-label="Previous video" onClick={prev} disabled={index === 0} className={arrowClass}>
            ‹
          </button>
          <button aria-label="Next video" onClick={next} disabled={index === slides.length - 1} className={arrowClass}>
            ›
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
        >
          {slides.map((slide, i) => (
            <figure id={`video-${i}`} key={slide.videoId} className="flex w-full shrink-0 justify-center px-4 py-6">
              <div className="w-full max-w-[1200px]">
                <div className="video-panel rounded-md bg-black">
                  <div className="video-embed">
                    <YouTube videoId={slide.videoId} title={slide.title} className="video-frame" />
                  </div>
                  <div className="video-caption bg-zinc-100 p-4 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                    <h3 className="line-clamp-2 text-base font-medium">{slide.title}</h3>
                    {slide.summary ? (
                      <p className="mt-1 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-300">{slide.summary}</p>
                    ) : null}
                    {slide.duration ? <p className="mt-2 text-xs opacity-70">Duration: {slide.duration}</p> : null}
                    <a
                      className="mt-2 inline-block text-xs underline"
                      href={`https://www.youtube.com/watch?v=${encodeURIComponent(slide.videoId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
