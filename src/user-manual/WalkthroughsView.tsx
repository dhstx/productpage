import React, { Suspense } from 'react';

const ArrowSlider = React.lazy(() => import('../components/help/walkthroughs/ArrowSlider'));

export default function WalkthroughsView() {
  return (
    <div className="space-y-6">
      <p className="text-base text-neutral-700 dark:text-neutral-300">
        Dive into concise walkthroughs that pair each manual section with a live demo—from routing intent in Manus Hub to
        handing work off to your connected apps.
      </p>
      <Suspense fallback={<div className="h-64 rounded-lg border border-neutral-800 bg-neutral-950" />}>
        <ArrowSlider />
      </Suspense>
    </div>
  );
}
