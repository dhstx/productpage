import React, { Suspense } from 'react';

import IntroCopyWalkthroughs from '../components/help/walkthroughs/IntroCopyWalkthroughs';

function dynamicImport<T>(factory: () => Promise<{ default: React.ComponentType<T> }>, _options: { ssr: false }) {
  return React.lazy(factory);
}

const ArrowSlider = dynamicImport(() => import('../components/help/walkthroughs/ArrowSlider'), { ssr: false });

export default function WalkthroughsView() {
  return (
    <div className="space-y-8">
      <IntroCopyWalkthroughs />
      <Suspense fallback={<div className="mx-auto h-[320px] w-full max-w-[1200px] rounded-2xl border border-neutral-800 bg-neutral-950" />}>
        <ArrowSlider />
      </Suspense>
    </div>
  );
}
