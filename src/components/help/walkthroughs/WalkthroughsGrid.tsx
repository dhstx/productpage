'use client';

import React from 'react';
// @ts-expect-error: JSON modules are provided by the bundler.
import data from '@/content/manual/walkthroughs.json';
// import data from '../../../content/manual/walkthroughs.json';
import { YouTube } from '@/components/YouTube';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';

type Walkthrough = {
  title: string;
  summary?: string;
  videoId: string;
  duration?: string;
};

const JSON_ALIAS_PATH = '@/content/manual/walkthroughs.json';
const JSON_RELATIVE_PATH = '../../../content/manual/walkthroughs.json';

function resolveWalkthroughs(): Walkthrough[] {
  const source = (data as any)?.default ?? data;
  return Array.isArray(source) ? (source as Walkthrough[]) : [];
}

function isWalkthroughsForced(): boolean {
  try {
    const candidates = [
      (import.meta as any)?.env?.NEXT_PUBLIC_WALKTHROUGHS_FORCE,
      (import.meta as any)?.env?.VITE_WALKTHROUGHS_FORCE,
      typeof process !== 'undefined' ? (process as any)?.env?.NEXT_PUBLIC_WALKTHROUGHS_FORCE : undefined,
      typeof process !== 'undefined' ? (process as any)?.env?.VITE_WALKTHROUGHS_FORCE : undefined,
      typeof window !== 'undefined' ? window.localStorage?.getItem('NEXT_PUBLIC_WALKTHROUGHS_FORCE') : undefined,
    ];
    const raw = candidates.find((val) => typeof val === 'string' && val.length > 0);
    return raw ? /^(1|true|yes|on)$/i.test(raw.toString()) : false;
  } catch {
    return false;
  }
}

export default function WalkthroughsGrid() {
  const list = React.useMemo(() => resolveWalkthroughs(), []);
  const safeMode = React.useMemo(() => isHelpSafeMode(), []);
  const force = React.useMemo(() => isWalkthroughsForced(), []);
  const devMode = React.useMemo(() => isDevEnvironment(), []);
  const allow = !safeMode || force || devMode;

  React.useEffect(() => {
    if (!devMode) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log('[walkthroughs:grid] mount', {
      allow,
      safeMode,
      force,
      devBypass: devMode && safeMode,
      len: list.length,
    });
    // eslint-disable-next-line no-console
    console.log(`[walkthroughs] len=${list.length}`, {
      path: JSON_ALIAS_PATH,
      fallbackPath: JSON_RELATIVE_PATH,
    });
    // eslint-disable-next-line no-console
    console.log('[walkthroughs] safe-mode', {
      safeMode,
      force,
      devMode,
      bypassed: safeMode && (force || devMode),
      effective: allow,
      bypassSource: force ? 'force-env' : devMode && safeMode ? 'dev-mode' : 'none',
    });
  }, [allow, safeMode, force, list.length, devMode]);

  if (!allow) {
    return null;
  }

  if (!list.length) {
    return (
      <section id="walkthroughs" aria-labelledby="walkthroughs-title" className="mt-10">
        <h2 id="walkthroughs-title" className="text-2xl font-semibold mb-3">
          Walkthroughs
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          No walkthroughs yet. Check back soon for fresh videos.
        </p>
      </section>
    );
  }

  return (
    <section id="walkthroughs" aria-labelledby="walkthroughs-title" className="mt-10">
      <h2 id="walkthroughs-title" className="text-2xl font-semibold mb-3">
        Walkthroughs
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Short, practical videos. Start with the Quickstart, then dive into workflows and security.
      </p>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
        {list.map((v, i) => (
          <figure key={`${v.videoId}-${i}`} className="rounded-lg border bg-background p-4">
            <YouTube videoId={v.videoId} title={v.title} />
            <figcaption className="mt-3 space-y-1">
              <h3 className="text-lg font-medium">{v.title}</h3>
              {v.summary && <p className="text-sm text-muted-foreground">{v.summary}</p>}
              {v.duration && <p className="text-xs opacity-70">Duration: {v.duration}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
