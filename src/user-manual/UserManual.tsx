import React, { Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import LeftNav from '@/components/help/LeftNav';
import RightTOC from '@/components/help/RightTOC';
import Feedback from '@/components/help/Feedback';
import LastUpdated from '@/components/help/LastUpdated';
import RelatedArticles from '@/components/help/RelatedArticles';
import MarkdownRenderer from '@/components/help/MarkdownRenderer';
import { buildManualIndex } from '@/user-manual/searchIndex';

const SearchBox = React.lazy(() => import('@/components/help/SearchBox'));

export default function UserManual() {
  const index = useMemo(() => buildManualIndex(), []);
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, '') || '/user-manual';
  const doc = index.byPath[path] ?? index.byPath['/user-manual'];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">User Manual</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            Learn Syntek Automations—how it works, why it matters, and how to win with it.
          </p>
        </header>

        {/* Inline Search (hydrated client-side only) */}
        <div id="help-search" className="mb-8">
          <Suspense fallback={<div className="h-9 w-full rounded border border-neutral-300 dark:border-neutral-700" />}>
            <SearchBox />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
          <aside aria-label="Sections" className="h-fit lg:sticky lg:top-6">
            <LeftNav />
          </aside>
          <article id="help-article">
            <MarkdownRenderer content={doc.content} />
            <div className="mt-6">
              <LastUpdated updated={doc.updated} />
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
      </div>
    </div>
  );
}
