import React from 'react';
import WalkthroughsSlider from '@/components/help/walkthroughs/SwipeCarousel';
import data from '@/content/manual/walkthroughs.json';

type WalkthroughItem = {
  videoId: string;
  title: string;
  summary?: string;
  duration?: string;
};

const slides: WalkthroughItem[] = Array.isArray(data)
  ? data.filter((item): item is WalkthroughItem => typeof item?.videoId === 'string' && typeof item?.title === 'string')
  : [];

export default function WalkthroughsView() {
  return (
    <div className="space-y-6">
      <p className="text-base text-neutral-700 dark:text-neutral-300">
        Watch concise videos that pair with the manual sections: see how Manus Hub routes intent to agents
        (Conductor, Builder, Connector) and apps to get results—fast.
      </p>
      <WalkthroughsSlider />
      {slides.length ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Jump to a walkthrough</h3>
          <ul className="mt-3 space-y-3">
            {slides.map((item) => (
              <li key={item.videoId} className="flex flex-col gap-1">
                <span className="text-base font-medium text-neutral-900 dark:text-neutral-50">{item.title}</span>
                {item.summary ? <span className="text-sm text-neutral-600 dark:text-neutral-300">{item.summary}</span> : null}
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {item.duration ? <span>Duration: {item.duration}</span> : null}
                  <a
                    className="text-amber-600 underline hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(item.videoId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open on YouTube
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
