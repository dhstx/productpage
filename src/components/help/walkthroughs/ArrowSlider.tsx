'use client';

import * as React from 'react';
import { WALKTHROUGHS } from '../../../../content/manual/walkthroughs.data';

type Slide = (typeof WALKTHROUGHS)[number];

function buildVideoSrc(videoId: string) {
  const base = 'https://www.youtube-nocookie.com/embed/';
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
  return `${base}${encodeURIComponent(videoId)}?${params.toString()}`;
}

function VideoPanel({ videoId, title, poster }: Slide) {
  const src = React.useMemo(() => buildVideoSrc(videoId), [videoId]);
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-lg"
      style={{ aspectRatio: '16 / 9', maxHeight: 640 }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0, backgroundImage: poster ? `url(${poster})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    </div>
  );
}

export default function ArrowSlider() {
  const slides = React.useMemo(() => (Array.isArray(WALKTHROUGHS) ? WALKTHROUGHS : []), []);
  const [index, setIndex] = React.useState(0);
  const slideRefs = React.useRef<Array<HTMLElement | null>>([]);

  React.useEffect(() => {
    const target = slideRefs.current[index];
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [index]);

  if (!slides.length) return null;

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  const goTo = (nextIndex: number) => {
    setIndex(Math.min(Math.max(nextIndex, 0), slides.length - 1));
  };

  return (
    <section aria-labelledby="walkthroughs-heading" className="um-walkthroughs mx-auto w-full max-w-[1200px]" data-testid="walkthrough-slider">
      <div className="flex items-center justify-between gap-4">
        <h2 id="walkthroughs-heading" className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Walkthroughs
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous video"
            onClick={() => goTo(index - 1)}
            disabled={isFirst}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-lg text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={() => goTo(index + 1)}
            disabled={isLast}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-lg text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="relative mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        role="group"
        aria-label="Walkthrough videos"
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
        >
          {slides.map((slide, i) => (
            <figure
              id={`video-${i}`}
              key={`${slide.videoId}-${i}`}
              className="flex w-full shrink-0 flex-col items-center px-6 pb-10 pt-6"
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
            >
              <VideoPanel videoId={slide.videoId} title={slide.title} poster={slide.poster} />
              <figcaption className="mt-6 w-full max-w-[1200px] space-y-2 text-left">
                <h3 className="text-lg font-semibold leading-tight text-neutral-900 line-clamp-2 dark:text-neutral-50">
                  {slide.title}
                </h3>
                {slide.summary ? (
                  <p className="text-sm text-neutral-600 line-clamp-3 dark:text-neutral-300">{slide.summary}</p>
                ) : null}
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  {slide.duration ? <span>Duration: {slide.duration}</span> : null}
                  <a
                    className="underline decoration-neutral-400 decoration-dotted underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(slide.videoId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
