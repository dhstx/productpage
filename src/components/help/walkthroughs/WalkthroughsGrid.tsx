'use client';

// @ts-expect-error - JSON imports handled by bundler configuration
import data from '../../../../content/manual/walkthroughs.json';
import { WalkthroughCard } from './WalkthroughCard';

type Walkthrough = {
  title: string;
  summary?: string;
  videoId: string;
  duration?: string;
  poster?: string;
};

const walkthroughs: Walkthrough[] = Array.isArray(data) ? (data as Walkthrough[]) : [];

export default function WalkthroughsGrid() {
  if (!walkthroughs.length) return null;

  return (
    <section aria-labelledby="walkthroughs" className="mt-6">
      <p className="mb-6 text-sm text-muted-foreground">
        Short, practical videos. Start with the Quickstart, then dive into workflows and security.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {walkthroughs.map((entry, index) => (
          <WalkthroughCard key={`${entry.videoId}-${index}`} {...entry} />
        ))}
      </div>
    </section>
  );
}
