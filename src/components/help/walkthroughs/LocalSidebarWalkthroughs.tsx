'use client';

import { WALKTHROUGHS } from '../../../../content/manual/walkthroughs.data';

export default function LocalSidebarWalkthroughs() {
  return (
    <nav aria-label="Walkthrough topics" className="space-y-1 text-sm">
      {WALKTHROUGHS.map((w, idx) => (
        <a
          key={idx}
          href={`#video-${idx}`}
          className="block rounded px-3 py-1.5 text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {w.title}
        </a>
      ))}
    </nav>
  );
}
