import React, { Suspense } from 'react';

import IntroCopyWalkthroughs from '../components/help/walkthroughs/IntroCopyWalkthroughs';

const ArrowSlider = React.lazy(() => import('../components/help/walkthroughs/ArrowSlider'));

export default function WalkthroughsView() {
  return (
    <div className="space-y-6">
      <IntroCopyWalkthroughs />
      <Suspense fallback={<div className="h-64 rounded-lg border border-neutral-800 bg-neutral-950" />}>
        <ArrowSlider />
      </Suspense>
    </div>
  );
}
