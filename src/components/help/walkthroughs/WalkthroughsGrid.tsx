'use client';

import * as React from 'react';
import { YouTube } from '@/components/YouTube';
import { walkthroughs } from './data';

export default function WalkthroughsGrid() {
  const items = React.useMemo(() => walkthroughs, []);

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section
      aria-labelledby="walkthroughs-grid-title"
      className="mt-12"
      data-testid="walkthroughs-grid"
    >
      <h3 id="walkthroughs-grid-title" className="text-2xl font-semibold">
        Walkthroughs Library
      </h3>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Short, practical videos. Start with the Quickstart, then dive into workflows and security topics.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
        {items.map((v, i) => (
          <figure
            key={`${v.videoId}-${i}`}
            className="rounded-lg border border-neutral-200 bg-background p-4 shadow-sm dark:border-neutral-800"
          >
            <YouTube videoId={v.videoId} title={v.title} poster={v.poster} />
            <figcaption className="mt-3 space-y-1">
              <h4 className="text-lg font-medium">{v.title}</h4>
              {v.summary ? <p className="text-sm text-neutral-600 dark:text-neutral-400">{v.summary}</p> : null}
              {v.duration ? <p className="text-xs opacity-70">Duration: {v.duration}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
