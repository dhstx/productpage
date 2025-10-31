'use client';

type Props = {
  title: string;
  summary?: string;
  videoId: string;
  duration?: string;
  poster?: string;
};

export function WalkthroughCard({ title, summary, videoId, duration, poster }: Props) {
  const posterStyles = poster
    ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' as const }
    : undefined;

  return (
    <figure className="rounded-lg border bg-background p-3 transition hover:shadow-sm focus-within:shadow-sm">
      <div className="mb-3">
        <div className="aspect-video overflow-hidden rounded bg-muted" style={posterStyles}>
          <iframe
            title={title}
            src={`https://www.youtube.com/embed/${videoId}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <figcaption className="space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {summary ? <p className="text-sm text-muted-foreground">{summary}</p> : null}
        {duration ? <p className="text-xs opacity-70">Duration: {duration}</p> : null}
      </figcaption>
    </figure>
  );
}
