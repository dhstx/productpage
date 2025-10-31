'use client';

import * as React from 'react';
import { YouTube } from '../../YouTube';
import { WALKTHROUGHS } from '../../../../content/manual/walkthroughs.data';

import './styles.css';

export default function ArrowSlider() {
  const slides = Array.isArray(WALKTHROUGHS) ? WALKTHROUGHS : [];
  const [index, setIndex] = React.useState(0);
  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  if (!slides.length) return null;

  return (
    <section aria-labelledby="walkthroughs-heading" className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="walkthroughs-heading" className="text-2xl font-semibold">
          Walkthroughs
        </h2>
        <div className="flex gap-2">
          <button
            aria-label="Previous video"
            onClick={prev}
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-200 hover:bg-neutral-800"
          >
            ‹
          </button>
          <button
            aria-label="Next video"
            onClick={next}
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-200 hover:bg-neutral-800"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
        >
          {slides.map((v, i) => (
            <figure id={`video-${i}`} key={i} className="w-full shrink-0 flex justify-center px-2 py-4">
              <div className="w-full max-w-[960px]">
                <div className="video-panel rounded-md border border-neutral-800 bg-neutral-900 shadow-lg shadow-black/20">
                  <div className="video-embed overflow-hidden rounded-t-md">
                    <YouTube videoId={v.videoId} title={v.title} />
                  </div>
                  <div className="p-4 bg-neutral-950 rounded-b-md">
                    <h3 className="text-base font-medium line-clamp-2">{v.title}</h3>
                    {v.summary && <p className="mt-1 text-sm text-neutral-300 line-clamp-3">{v.summary}</p>}
                    {v.duration && <p className="mt-2 text-xs opacity-70">Duration: {v.duration}</p>}
                    <a
                      className="text-xs underline mt-2 inline-block"
                      href={`https://www.youtube.com/watch?v=${encodeURIComponent(v.videoId)}`}
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
