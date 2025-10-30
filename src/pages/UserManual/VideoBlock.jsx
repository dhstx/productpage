import React from 'react';

export default function VideoBlock({ videoId }) {
  // Inline, non-modal video placeholder. If videoId provided, render YouTube embed.
  if (!videoId) {
    return (
      <div className="rounded-md border p-3 text-sm" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)', color: 'var(--muted)' }}>
        Video tutorial coming soon
      </div>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-md border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
      <iframe
        title="Tutorial video"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
