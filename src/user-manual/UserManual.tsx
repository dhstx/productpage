import React, { Suspense, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeftNav from '@/components/help/LeftNav';
import RightTOC from '@/components/help/RightTOC';
import Feedback from '@/components/help/Feedback';
import LastUpdated from '@/components/help/LastUpdated';
import RelatedArticles from '@/components/help/RelatedArticles';
import MarkdownRenderer from '@/components/help/MarkdownRenderer';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';
import { buildManualIndex } from './searchIndex';
import WalkthroughsView from './WalkthroughsView';
import { UMTitle } from './components/UMTitle';
import { sanitizeDashes } from './sanitizeDashes';
import './manual.css';

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
  const manualContent = doc ? sanitizeDashes(doc.content) : '';
  const tabBase = 'inline-flex items-center rounded-full px-3 py-1 text-sm transition focus:outline-none focus-visible:ring-2';
  const tabActive = 'border border-neutral-700 text-[color:var(--um-title)] bg-neutral-900';
  const tabIdle = 'text-neutral-300 hover:text-[color:var(--um-title)] hover:bg-neutral-900';

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
            <header className="mb-8">
              <UMTitle>User Manual</UMTitle>
              <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
                Learn how Syntek Automations works, why it matters, and the moves that help teams succeed with it.
              </p>
              <div className="user-manual-underline" aria-hidden="true">
                <svg viewBox="0 0 180 12" fill="none" role="presentation">
                  <path
                    d="M2 10C38 4 96 2 178 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 4c8-2 20-3 34-2"
                    stroke="url(#um-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="um-accent" x1="12" y1="2" x2="46" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FBBF24" />
                      <stop offset="1" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <nav
                aria-label="User manual sub navigation"
                className="mt-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-2 text-sm font-medium dark:border-neutral-800"
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
              <article id="help-article" className={isWalkthroughs ? '' : 'um-grid-accent rounded-3xl border border-neutral-200/40 bg-white/40 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-950/40'}>
                {isWalkthroughs ? (
                  <WalkthroughsView />
                ) : doc ? (
                  <>
                    <MarkdownRenderer content={manualContent} videoEnabled={!safeMode} />
                    <div className="mt-6">
                      <LastUpdated updated={doc.updated} />
                    </div>
                  </>
                ) : null}
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
