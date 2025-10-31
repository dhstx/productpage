import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftNav from '@/components/help/LeftNav';
import RightTOC from '@/components/help/RightTOC';
import Feedback from '@/components/help/Feedback';
import LastUpdated from '@/components/help/LastUpdated';
import RelatedArticles from '@/components/help/RelatedArticles';
import { buildManualIndex } from '@/user-manual/searchIndex';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { isHelpSafeMode, isDevEnvironment } from '@/lib/helpSafeMode';
import { getArticle, type Article } from '@/user-manual/_article';


const SearchBox = React.lazy(() => import('@/components/help/SearchBox'));
const WalkthroughsCarousel = React.lazy(() => import('@/user-manual/walkthroughs/WalkthroughsCarousel'));
const WalkthroughsGrid = React.lazy(() => import('@/user-manual/walkthroughs/WalkthroughsGrid'));

function ManualErrorUI({ error, onReset }: { error: Error; onReset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const stackLines = typeof error?.stack === 'string'
        ? error.stack.split('\n').map((line) => line.trim()).filter(Boolean)
        : [];
      const originLine = (() => {
        for (const line of stackLines) {
          const cleaned = line.replace(/^at\s+/, '').replace(/^\(/, '').replace(/\)$/, '');
          if (/(\/src\/|\.\.[/\\])/.test(cleaned) && /:\d+:\d+/.test(cleaned)) {
            return cleaned;
          }
          if (/(?:\.tsx|\.ts|\.jsx|\.js):\d+:\d+/.test(cleaned)) {
            return cleaned;
          }
        }
        return stackLines[0] ?? 'unknown';
      })();

      // eslint-disable-next-line no-console
      console.error('[user-manual:error]', {
        name: (error && (error as any).name) || 'Error',
        message: (error && (error as any).message) || '',
        stack: (error && (error as any).stack) || '',
        origin: originLine,
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

function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-5 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-5 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-5 w-4/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}

export default function UserManual() {
  const index = useMemo(() => buildManualIndex(), []);
  const location = useLocation();
  const fallbackArticle = useMemo<Article>(
    () => ({
      title: 'User Manual',
      body: (
        <div>
          <h1 className="text-2xl font-semibold">User Manual</h1>
          <p className="mt-2 text-sm opacity-80">
            Baseline guide loaded in fallback mode. Navigate sections in the left nav, or scroll to Walkthroughs below.
          </p>
        </div>
      ),
    }),
    []
  );
  const path = location.pathname.replace(/\/$/, '') || '/user-manual';
  // Resolve article with a never-throw fallback
  const doc = (() => {
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
  const [article, setArticle] = useState<Article | null>(null);
  const [articleLoadError, setArticleLoadError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setArticle(null);
    (async () => {
      try {
        const result = await getArticle(doc.slug);
        if (!active) return;
        setArticle(result);
        setArticleLoadError(null);
      } catch (err) {
        if (!active) return;
        const normalizedError = err instanceof Error ? err : new Error(String(err));
        setArticleLoadError(normalizedError);
        let fallback = fallbackArticle;
        try {
          fallback = await getArticle();
        } catch {
          fallback = fallbackArticle;
        }
        if (!active) return;
        setArticle(fallback);
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[user-manual:article-load]', normalizedError);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [doc.slug, fallbackArticle]);

  if (isDevEnvironment()) {
    // eslint-disable-next-line no-console
    console.warn('[help] render', {
      path,
      docFound: !!doc,
      safeMode,
      articleReady: !!article,
      articleError: articleLoadError ? articleLoadError.name : null,
    });
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
                <section id="content">{article?.body ?? <ArticleSkeleton />}</section>
                <div className="mt-6">
                  <LastUpdated updated={doc.updated} />
                </div>
                <div className="mt-12 space-y-12">
                  <Suspense fallback={<div className="h-32 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />}>
                    <WalkthroughsCarousel />
                  </Suspense>
                  <Suspense fallback={null}>
                    <WalkthroughsGrid />
                  </Suspense>
                </div>
              </article>
              <aside aria-label="On this page" className="h-fit lg:sticky lg:top-6">
                <RightTOC headings={doc.headings} />
                <RelatedArticles current={doc} index={index} />
              </aside>
            </div>

            <footer className="mt-12">
              <Feedback articlePath={doc.path} />
            </footer>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
