import React from 'react';
import SwipeCarousel from '@/components/help/walkthroughs/SwipeCarousel';

export default function WalkthroughsView() {
  return (
    <div className="space-y-6">
      <p className="text-base text-neutral-700 dark:text-neutral-300">
        Watch concise videos that pair with the manual sections: see how Manus Hub routes intent to agents
        (Conductor, Builder, Connector) and apps to get results—fast.
      </p>
      <SwipeCarousel />
    </div>
  );
}
