import React from 'react';

export default function VideoBlock({ title, summary, videoId }: { title?: string; summary?: string; videoId?: string }) {
  return (
    <div className="my-4 rounded border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="mb-2 font-medium">{title ?? 'Video'}</div>
      {summary ? <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">{summary}</div> : null}
      <div className="aspect-video w-full rounded bg-neutral-100 dark:bg-neutral-900">
        {videoId ? (
          <iframe
            title={title ?? 'Video'}
            className="h-full w-full rounded"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
            Placeholder video frame
          </div>
        )}
      </div>
    </div>
  );
}
