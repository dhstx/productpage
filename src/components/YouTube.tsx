'use client';

import React, { useMemo } from 'react';

type Props = { videoId: string; title?: string; poster?: string; className?: string };

export const YouTube: React.FC<Props> = ({ videoId, title = 'Video', poster, className }) => {
  // poster is supported for API parity but handled upstream; suppress unused warning.
  void poster;
  const src = useMemo(() => {
    const base = 'https://www.youtube-nocookie.com/embed/';
    const qs = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
    return `${base}${encodeURIComponent(videoId)}?${qs.toString()}`;
  }, [videoId]);

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  return (
    <div className={className}>
      <div
        style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
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

export default YouTube;
