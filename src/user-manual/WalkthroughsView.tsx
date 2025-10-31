import React, { Suspense } from 'react';

const ArrowSlider = React.lazy(() => import('../components/help/walkthroughs/ArrowSlider'));

export default function WalkthroughsView() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/40 bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-950/50">
        <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          <svg aria-hidden="true" width="44" height="12" viewBox="0 0 44 12" fill="none">
            <path d="M1 6h42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 4" />
            <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.35" />
          </svg>
          Walkthrough series
        </div>
        <p className="text-base text-neutral-700 dark:text-neutral-300">
          Dive into concise walkthroughs that pair each manual section with a live demo, guiding intent from Manus Hub to the apps that finish the work.
        </p>
      </div>
      <div className="um-grid-accent rounded-3xl border border-neutral-200/40 bg-neutral-900/80 p-4 shadow-sm backdrop-blur-sm dark:border-neutral-800/60">
        <Suspense fallback={<div className="h-64 rounded-2xl border border-neutral-800 bg-neutral-950" />}>
          <ArrowSlider />
        </Suspense>
      </div>
    </div>
  );
}
