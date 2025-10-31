import { ReactNode } from 'react';
import MarkdownRenderer from '@/components/help/MarkdownRenderer';
import { buildManualIndex } from '@/user-manual/searchIndex';
import { isHelpSafeMode } from '@/lib/helpSafeMode';

export type Article = { title: string; body: ReactNode };

async function importArticleSafe(slug: string): Promise<Article | null> {
  try {
    const index = buildManualIndex();
    const doc = index.docs.find((d) => d.slug === slug) ?? index.docs.find((d) => d.slug === 'index');
    if (!doc) return null;

    const videoEnabled = !isHelpSafeMode();
    const ArticleBody = () => <MarkdownRenderer content={doc.content} videoEnabled={videoEnabled} />;

    return {
      title: doc.title || 'User Manual',
      body: <ArticleBody />,
    };
  } catch {
    return null;
  }
}

export async function getArticle(slug?: string): Promise<Article> {
  const normalized = !slug || slug === '/' ? 'index' : slug.replace(/^\/+/, '');
  const mod = await importArticleSafe(normalized);
  if (mod) return mod;

  const Fallback = () => (
    <article>
      <h1 className="text-2xl font-semibold">User Manual</h1>
      <p className="mt-2 text-sm opacity-80">
        Baseline guide loaded in fallback mode. Navigate sections in the left nav, or scroll to Walkthroughs below.
      </p>
    </article>
  );

  return { title: 'User Manual', body: <Fallback /> };
}

