'use client';

import React from 'react';
import { walkthroughs, type Walkthrough } from './data';

function WalkthroughTile({ item }: { item: Walkthrough }) {
  const title = item.title ?? 'Walkthrough';
  const summary = item.summary ?? 'Review the guided steps end-to-end.';
  const videoId = item.videoId;
  const href = typeof item.href === 'string' ? item.href : videoId ? `https://youtu.be/${videoId}` : undefined;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</div>
        <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{summary}</div>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
        {videoId ? (
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
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
        <div className="text-xs">
          <a href={href} target="_blank" rel="noreferrer" className="text-primary underline">
            Watch on YouTube
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function WalkthroughsGrid() {
  if (!Array.isArray(walkthroughs) || walkthroughs.length === 0) return null;

  return (
    <section aria-label="Walkthroughs grid" className="mt-10">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">More step-by-step guides</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {walkthroughs.map((item, index) => (
          <WalkthroughTile key={item.id ?? item.videoId ?? item.title ?? index} item={item} />
        ))}
      </div>
    </section>
  );
}

