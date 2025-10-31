'use client';

import React, { useMemo } from 'react';

type Props = { videoId: string; title?: string; poster?: string; className?: string; start?: number };

export const YouTube: React.FC<Props> = ({ videoId, title = 'Video', poster, className, start }) => {
  const src = useMemo(() => {
    const base = 'https://www.youtube-nocookie.com/embed/';
    const qs = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
    if (typeof start === 'number' && Number.isFinite(start) && start > 0) {
      qs.set('start', String(Math.floor(start)));
    }
    return `${base}${encodeURIComponent(videoId)}?${qs.toString()}`;
  }, [videoId, start]);

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  return (
    <div className={className}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, backgroundImage: poster ? `url(${poster})` : undefined, backgroundSize: 'cover' }}
        />
      </div>
      <noscript>
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </noscript>
    </div>
  );
};
