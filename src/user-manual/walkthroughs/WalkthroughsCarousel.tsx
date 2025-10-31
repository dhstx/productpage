'use client';

import React from 'react';
import { walkthroughs, type Walkthrough } from './data';

function fallbackHref(item: Walkthrough): string | undefined {
  if (item.href && typeof item.href === 'string') return item.href;
  if (item.videoId && typeof item.videoId === 'string') return `https://youtu.be/${item.videoId}`;
  return undefined;
}

function WalkthroughCard({ item }: { item: Walkthrough }) {
  const href = fallbackHref(item);

  return (
    <article className="min-w-[280px] max-w-[320px] flex-1 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.title ?? 'Walkthrough'}</div>
      <div className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">{item.summary ?? 'Watch the guided walkthrough to see the flow in action.'}</div>
      <div className="aspect-video w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
        {item.videoId ? (
          <iframe
            title={item.title ?? 'Walkthrough video'}
            src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : href ? (
          <a
            href={href}
            className="flex h-full w-full items-center justify-center text-xs text-neutral-600 underline dark:text-neutral-300"
            target="_blank"
            rel="noreferrer"
          >
            Open walkthrough
          </a>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500 dark:text-neutral-400">
            Walkthrough coming soon
          </div>
        )}
      </div>
      {href ? (
        <div className="mt-3 text-xs">
          <a href={href} target="_blank" rel="noreferrer" className="text-primary underline">
            Open in new tab
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function WalkthroughsCarousel() {
  if (!Array.isArray(walkthroughs) || walkthroughs.length === 0) return null;

  return (
    <section aria-label="Walkthrough videos" className="mt-12">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Walkthroughs</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Watch concise videos that pair with the manual sections above.
        </p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {walkthroughs.map((item, index) => (
          <WalkthroughCard key={item.id ?? item.videoId ?? item.title ?? index} item={item} />
        ))}
      </div>
    </section>
  );
}

