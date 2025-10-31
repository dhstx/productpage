'use client';

import React from 'react';
import { YouTube } from '@/components/YouTube';
import { loadWalkthroughs, type Walkthrough } from './loadWalkthroughs';

export default function WalkthroughsGrid(): JSX.Element | null {
  const [list, setList] = React.useState<Walkthrough[]>([]);
  const loggedRef = React.useRef(false);

  React.useEffect(() => {
    let mounted = true;
    loadWalkthroughs()
      .then((data) => {
        const safeList = Array.isArray(data) ? data : [];
        if (!loggedRef.current && process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('[walkthroughs:grid] len=', safeList.length);
          loggedRef.current = true;
        }
        if (mounted) setList(safeList);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[walkthroughs:grid] load failed', error);
        }
        if (mounted) setList([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Array.isArray(list) || list.length === 0) return null;

  return (
    <section id="walkthroughs" aria-labelledby="walkthroughs-title" className="mt-10">
      <h2 id="walkthroughs-title" className="text-2xl font-semibold mb-3">
        Walkthroughs
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Short, practical videos. Start with the Quickstart.</p>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
        {list.map((item, index) => (
          <figure key={`${item.videoId}-${index}`} className="rounded-lg border bg-background p-4">
            <YouTube videoId={item.videoId} title={item.title} />
            <figcaption className="mt-3 space-y-1">
              <h3 className="text-lg font-medium">{item.title}</h3>
              {item.summary ? <p className="text-sm text-muted-foreground">{item.summary}</p> : null}
              {item.duration ? <p className="text-xs opacity-70">Duration: {item.duration}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

