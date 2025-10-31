import React from 'react';
import { YouTube } from '@/components/YouTube';

type VideoBlockProps = {
  title?: string;
  summary?: string;
  videoId?: string;
  poster?: string;
};

export default function VideoBlock({ title, summary, videoId, poster }: VideoBlockProps) {
  try {
    const resolvedTitle = title ?? 'Video';
    return (
      <figure className="my-6 rounded-lg border border-neutral-200 bg-background p-4 shadow-sm dark:border-neutral-800">
        <figcaption className="mb-3 space-y-1">
          <div className="text-lg font-medium">{resolvedTitle}</div>
          {summary ? <p className="text-sm text-neutral-600 dark:text-neutral-400">{summary}</p> : null}
        </figcaption>
        {videoId ? (
          <YouTube videoId={videoId} title={resolvedTitle} poster={poster} />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded bg-neutral-100 text-sm text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            Placeholder video frame
          </div>
        )}
      </figure>
    );
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[user-manual:widget]', e);
    }
    return null;
  }
}
