import React, { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import { useLocation, useNavigate } from 'react-router-dom';
import GlobalSearch from '@/components/help/GlobalSearch';
import LeftNav from '@/components/help/LeftNav';
import RightTOC from '@/components/help/RightTOC';
import LastUpdated from '@/components/help/LastUpdated';
import Callout from '@/components/help/Callout';
import RelatedArticles from '@/components/help/RelatedArticles';
import Feedback from '@/components/help/Feedback';
import { allArticles, getArticleBySlug, getCategories } from '@/components/help/contentIndex';
import { buildFuseIndex, buildSearchData } from '@/components/help/search';

export default function UserManual() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.replace(/^\/user-manual\/?/, '').replace(/\/$/, '');
  const article = getArticleBySlug(slug);
  const categories = useMemo(() => getCategories(), []);
  const fuse = useMemo(() => buildFuseIndex(buildSearchData(allArticles)), []);
  const contentRef = useRef(null);

  useEffect(() => {
    // Deep link hash scrolling without flicker
    if (location.hash) {
      const id = location.hash.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    try {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'help.article_view', { category: 'Help', action: 'view', label: article?.slug || 'index' });
      }
    } catch {}
  }, [article?.slug]);

  return (
    <div className="space-y-6">
      {/* Top: Global search */}
      <GlobalSearch
        fuse={fuse}
        onSelect={(s) => navigate(`/user-manual/${s}`)}
      />

      {/* Layout: left nav / main / right toc */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_260px] gap-8">
        {/* Left nav */}
        <aside className="hidden lg:block sticky self-start top-24">
          <LeftNav categories={categories} />
        </aside>

        {/* Main content */}
        <article ref={contentRef}>
          <header className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight uppercase">{article?.title || 'User Manual'}</h1>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>{article?.description}</p>
            <div className="mt-2"><LastUpdated updated={article?.updated} /></div>
          </header>

          <div className="mb-4">
            <Callout type="tip" title="Pro tip">
              Use ⌘/Ctrl + K to search the entire manual.
            </Callout>
          </div>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkSlug]}>{article?.body || ''}</ReactMarkdown>
          </div>

          <div className="mt-8"><Feedback slug={article?.slug || ''} /></div>
        </article>

        {/* Right sidebar */}
        <aside className="hidden lg:block sticky self-start top-24 space-y-8">
          <RightTOC containerRef={contentRef} />
          <RelatedArticles slugs={article?.related} all={allArticles} />
        </aside>
      </div>
    </div>
  );
}
