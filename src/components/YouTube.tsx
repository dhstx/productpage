import React from 'react';

type YouTubeProps = {
  videoId: string;
  title: string;
  start?: number;
};

export function YouTube({ videoId, title, start }: YouTubeProps) {
  const searchParams = new URLSearchParams({ rel: '0' });
  if (typeof start === 'number' && Number.isFinite(start) && start > 0) {
    searchParams.set('start', String(Math.floor(start)));
  }
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${searchParams.toString()}`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingBottom: '56.25%' }}>
      <iframe
        title={title}
        src={src}
        className="absolute left-0 top-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
