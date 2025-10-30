import matter from 'gray-matter';

export type ManualArticle = {
  slug: string;
  path: string;
  title: string;
  description?: string;
  tags?: string[];
  updated?: string; // yyyy-mm-dd
  related?: string[];
  body: string;
  headings: { depth: number; text: string; id: string }[];
};

// Utility: slugify heading text for ids
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Extract h2–h4 from markdown body
function extractHeadings(markdown: string): ManualArticle['headings'] {
  const lines = markdown.split(/\r?\n/);
  const headings: ManualArticle['headings'] = [];
  for (const line of lines) {
    const m = /^(#{2,4})\s+(.*)$/.exec(line.trim());
    if (m) {
      const depth = m[1].length; // 2..4
      const text = m[2].trim();
      const id = slugify(text);
      headings.push({ depth, text, id });
    }
  }
  return headings;
}

// Build index from content files (raw import)
const files = import.meta.glob('/content/manual/**/*.md', { as: 'raw', eager: true });

function toSlug(path: string): string {
  // /content/manual/foo/bar.md -> foo/bar
  return path
    .replace(/^\/content\/manual\//, '')
    .replace(/\.md$/i, '')
    .replace(/index$/i, '');
}

export const allArticles: ManualArticle[] = Object.entries(files).map(([path, raw]) => {
  const { data, content } = matter(raw as string);
  const headings = extractHeadings(content);
  const slug = toSlug(path).replace(/\/$/, '');
  return {
    slug: slug || '',
    path,
    title: data.title || 'Untitled',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    updated: data.updated || undefined,
    related: Array.isArray(data.related) ? data.related : [],
    body: content,
    headings,
  };
});

// Sort landing (empty slug) first, then alphabetically by slug
allArticles.sort((a, b) => (a.slug === '' ? -1 : b.slug === '' ? 1 : a.slug.localeCompare(b.slug)));

export function getArticleBySlug(slug: string | null | undefined): ManualArticle | null {
  if (!slug) {
    return allArticles.find((a) => a.slug === '') || null;
  }
  const cleaned = slug.replace(/^\/+|\/+$/g, '');
  return allArticles.find((a) => a.slug === cleaned) || null;
}

export type ManualCategory = {
  id: string;
  label: string;
  items: { title: string; slug: string }[];
};

export function getCategories(): ManualCategory[] {
  const categories: ManualCategory[] = [
    { id: 'getting-started', label: 'Getting started', items: [] },
    { id: 'workflows', label: 'Workflows', items: [] },
    { id: 'integrations', label: 'Integrations', items: [] },
    { id: 'security', label: 'Security & Privacy', items: [] },
    { id: 'billing', label: 'Billing', items: [] },
    { id: 'faq', label: 'FAQ', items: [] },
    { id: 'appendix', label: 'Appendix', items: [] },
  ];

  for (const a of allArticles) {
    if (a.slug === '') continue; // landing
    const top = a.slug.split('/')[0];
    const entry =
      top === 'appendix'
        ? categories.find((c) => c.id === 'appendix')
        : categories.find((c) => c.id === top || a.tags?.includes(c.id));
    if (entry) {
      entry.items.push({ title: a.title, slug: a.slug });
    }
  }

  // Sort items by slug
  for (const c of categories) {
    c.items.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return categories;
}
