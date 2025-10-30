import React from 'react';

export type VideoBlockProps = {
  title: string;
  summary?: string;
  videoId?: string; // e.g., YouTube ID
  duration?: string; // e.g., "3:12"
  poster?: string;
};

export default function VideoBlock({ title, summary, videoId, duration, poster }: VideoBlockProps) {
  return (
    <section className="my-6">
      <div className="mb-2">
        <h3 id="video" className="text-lg font-semibold">{title}</h3>
        {summary ? <p className="text-sm" style={{ color: 'var(--muted)' }}>{summary}</p> : null}
      </div>
      {videoId ? (
        <div className="aspect-video rounded-[4px] overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <iframe
            title={title}
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center rounded-[4px]" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="text-center">
            {poster ? <img src={poster} alt="Coming soon" className="max-h-40 mx-auto mb-3" /> : null}
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Video coming soon</div>
            {duration ? <div className="text-xs" style={{ color: 'var(--muted)' }}>Estimated duration: {duration}</div> : null}
          </div>
        </div>
      )}
    </section>
  );
}
