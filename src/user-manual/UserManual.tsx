import React, { Suspense, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeftNav from '@/components/help/LeftNav';
import RightTOC from '@/components/help/RightTOC';
import Feedback from '@/components/help/Feedback';
import LastUpdated from '@/components/help/LastUpdated';
import RelatedArticles from '@/components/help/RelatedArticles';
import MarkdownRenderer from '@/components/help/MarkdownRenderer';
import { buildManualIndex } from '@/user-manual/searchIndex';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';
import WalkthroughsView from '@/user-manual/WalkthroughsView';
import WalkthroughsSlider from '@/components/help/walkthroughs/SwipeCarousel';

const SearchBox = React.lazy(() => import('@/components/help/SearchBox'));

function ManualErrorUI({ error, onReset }: { error: Error; onReset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[user-manual:error]', {
        name: (error && (error as any).name) || 'Error',
        message: (error && (error as any).message) || '',
        stack: (error && (error as any).stack) || '',
      });
    }
  }, [error]);

  return (
    <div className="my-6 rounded-md border bg-background p-4">
      <h2 className="text-base font-medium">Something went wrong on this page.</h2>
      <p className="text-sm opacity-80">Try again. If it persists, the article loader will fall back automatically.</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onReset()}
          className="rounded bg-primary px-3 py-1.5 text-primary-foreground text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function UserManual() {
  const index = useMemo(() => buildManualIndex(), []);
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, '') || '/user-manual';
  const isWalkthroughs = path === '/user-manual/walkthroughs';
  const isOverview = !isWalkthroughs && path === '/user-manual';
  // Resolve article with a never-throw fallback
  const doc = (() => {
    if (isWalkthroughs) return null;
    try {
      const resolved = index.byPath[path] ?? index.byPath['/user-manual'];
      if (resolved && typeof resolved.content === 'string') return resolved;
    } catch {}
    return {
      path: '/user-manual',
      slug: 'index',
      title: 'User Manual',
      description: 'Welcome. Use the left nav to explore.',
      tags: [],
      updated: undefined,
      headings: [],
      content: 'Welcome. Use the left nav to explore.',
    };
  })();
  const safeMode = isHelpSafeMode();
  const subNavItems = [
    {
      label: 'Overview',
      href: '/user-manual',
      active: !isWalkthroughs,
    },
    {
      label: 'Walkthroughs',
      href: '/user-manual/walkthroughs',
      active: isWalkthroughs,
    },
  ];
  const tabBase =
    'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-950';
  const tabActive =
    'border border-amber-300 bg-amber-200 text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-amber-300';
  const tabIdle =
    'border border-transparent bg-transparent text-neutral-700 hover:bg-amber-50/70 hover:text-amber-500 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-amber-300';

  if (isDevEnvironment()) {
    // eslint-disable-next-line no-console
    console.warn('[help] render', { path, docFound: !!doc, safeMode });
  }

  return (
    <div className="w-full">
      {/* Explicit page colors so it's never a black screen */}
      <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto max-w-5xl">
          <ErrorBoundary
            name="UserManualRoute"
            fallback={({ error, resetError }: { error: Error; resetError: () => void }) => (
              <ManualErrorUI error={error} onReset={resetError} />
            )}
          >
            <header className="mb-6">
              <h1 className="text-3xl font-semibold">User Manual</h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300">
                Learn Syntek Automations—how it works, why it matters, and how to win with it.
              </p>
              <nav
                aria-label="User manual sub navigation"
                className="mt-4 flex flex-wrap gap-2 text-sm font-medium"
              >
                {subNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={item.active ? 'page' : undefined}
                    className={`${tabBase} ${item.active ? tabActive : tabIdle}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>

            {/* Inline Search (hydrated client-side only) */}
            <div id="help-search" className="mb-8">
              {safeMode ? (
                <input
                  aria-label="Search the user manual (disabled in Safe Mode)"
                  disabled
                  placeholder="Search disabled (Safe Mode)"
                  className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder-neutral-400"
                />
              ) : (
                <Suspense fallback={<div className="h-9 w-full rounded border border-neutral-300 dark:border-neutral-700" />}>
                  <SearchBox />
                </Suspense>
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
              <aside aria-label="Sections" className="h-fit lg:sticky lg:top-6">
                <LeftNav />
              </aside>
              <article id="help-article">
                {isWalkthroughs ? (
                  <WalkthroughsView />
                ) : (
                  <>
                    <MarkdownRenderer content={doc.content} videoEnabled={!safeMode} />
                    {isOverview ? (
                      <div className="mt-8 space-y-4">
                        <p className="text-base text-neutral-700 dark:text-neutral-300">
                          Watch Manus Hub route real user intents through the Conductor, Builder, and Connector to ship
                          production-ready work in minutes, then mirror those steps inside your workspace.
                        </p>
                        <WalkthroughsSlider />
                      </div>
                    ) : null}
                    <div className="mt-6">
                      <LastUpdated updated={doc.updated} />
                    </div>
                  </>
                )}
              </article>
              <aside aria-label="On this page" className="h-fit lg:sticky lg:top-6">
                <RightTOC headings={doc?.headings ?? []} />
                {doc ? <RelatedArticles current={doc} index={index} /> : null}
              </aside>
            </div>

            <footer className="mt-12">
              <Feedback articlePath={doc?.path ?? path} />
            </footer>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
