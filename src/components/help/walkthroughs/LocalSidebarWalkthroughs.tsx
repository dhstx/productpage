'use client';

import { WALKTHROUGHS } from '../../../../content/manual/walkthroughs.data';

export default function LocalSidebarWalkthroughs() {
  return (
    <nav className="mb-6 space-y-2">
      {WALKTHROUGHS.map((w, idx) => (
        <a
          key={idx}
          href={`#video-${idx}`}
          className="block text-sm text-neutral-300 hover:text-[color:var(--brand-accent)]"
        >
          {w.title}
        </a>
      ))}
    </nav>
  );
}
