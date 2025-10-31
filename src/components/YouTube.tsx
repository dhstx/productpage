'use client';

import React, { useMemo } from 'react';

export type YouTubeProps = {
  videoId: string;
  title?: string;
  poster?: string;
  className?: string;
};

export const YouTube: React.FC<YouTubeProps> = ({ videoId, title = 'Video', poster, className }) => {
  const src = useMemo(() => {
    const base = 'https://www.youtube-nocookie.com/embed/';
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    return `${base}${encodeURIComponent(videoId)}?${params.toString()}`;
  }, [videoId]);

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundImage: poster ? `url(${poster})` : undefined,
    backgroundPosition: poster ? 'center' : undefined,
    backgroundSize: poster ? 'cover' : undefined,
    backgroundRepeat: poster ? 'no-repeat' : undefined,
  };

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 0,
  };

  return (
    <div className={className}>
      <div style={containerStyle}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={iframeStyle}
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
