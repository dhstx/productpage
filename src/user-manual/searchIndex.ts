/*
  Build a small search index from raw MDX files in /content/manual.
  No external dependencies; parses frontmatter and headings (##–####).
*/

export type ManualDoc = {
  path: string; // e.g., /user-manual or /user-manual/getting-started
  slug: string; // e.g., index or getting-started
  title: string;
  description?: string;
  tags: string[];
  updated?: string;
  headings: { level: 2 | 3 | 4; text: string; id: string }[];
  content: string; // raw MDX without frontmatter
};

export type ManualIndex = {
  docs: ManualDoc[];
  byPath: Record<string, ManualDoc>;
};

export const SYNONYMS: Record<string, string[]> = {
  onboarding: ["setup", "getting started"],
  agents: ["sub-agents", "reasoners", "roles"],
  "Manus hub": ["orchestrator", "router", "commander"],
  integrations: ["connectors", "apps", "APIs"],
};

const mdxModules = import.meta.glob('../../content/manual/**/*.mdx', {
  as: 'raw',
  eager: true,
});

function stripFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { meta: {}, body: raw };
  const yaml = fmMatch[1];
  const meta: Record<string, any> = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      // very naive array parser
      value = value.slice(1, -1);
      meta[key] = value
        .split(',')
        .map((s) => s.trim().replace(/^\"|\"$/g, '').replace(/^'|'$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = value.replace(/^\"|\"$/g, '').replace(/^'|'$/g, '');
    }
  }
  const body = raw.slice(fmMatch[0].length);
  return { meta, body };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractHeadings(body: string): { level: 2 | 3 | 4; text: string; id: string }[] {
  const lines = body.split('\n');
  const result: { level: 2 | 3 | 4; text: string; id: string }[] = [];
  for (const line of lines) {
    if (line.startsWith('#### ')) {
      const text = line.slice(5).trim();
      result.push({ level: 4, text, id: slugify(text) });
    } else if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      result.push({ level: 3, text, id: slugify(text) });
    } else if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      result.push({ level: 2, text, id: slugify(text) });
    }
  }
  return result;
}

export function buildManualIndex(): ManualIndex {
  const docs: ManualDoc[] = [];

  for (const [path, raw] of Object.entries(mdxModules)) {
    const { meta, body } = stripFrontmatter(raw as string);
    const fileName = path.split('/').pop() || 'index.mdx';
    const slug = fileName.replace(/\.mdx$/, '');
    const route = slug === 'index' ? '/user-manual' : `/user-manual/${slug}`;
    const headings = extractHeadings(body);
    const title: string = meta.title || (headings.find((h) => h.level === 2)?.text ?? 'Untitled');
    const description: string | undefined = meta.description;
    const tags: string[] = Array.isArray(meta.tags)
      ? meta.tags
      : typeof meta.tags === 'string'
      ? meta.tags.split(',').map((t: string) => t.trim())
      : [];
    const updated = typeof meta.updated === 'string' ? meta.updated : undefined;

    docs.push({
      path: route,
      slug,
      title,
      description,
      tags,
      updated,
      headings,
      content: body,
    });
  }

  // Sort index page first, then alpha by title
  docs.sort((a, b) => {
    if (a.slug === 'index') return -1;
    if (b.slug === 'index') return 1;
    return a.title.localeCompare(b.title);
  });

  const byPath: Record<string, ManualDoc> = {};
  for (const d of docs) byPath[d.path] = d;

  return { docs, byPath };
}

export type SearchResult = {
  path: string;
  title: string;
  snippet?: string;
  score: number; // lower is better
};

// Simple local search that prefers title > headings > description > tags.
export function searchManual(index: ManualIndex, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const doc of index.docs) {
    let score = Infinity;
    const inTitle = doc.title.toLowerCase().includes(q);
    const inHeadings = doc.headings.some((h) => h.text.toLowerCase().includes(q));
    const inDesc = (doc.description || '').toLowerCase().includes(q);
    const inTags = doc.tags.some((t) => t.toLowerCase().includes(q));
    if (inTitle) score = Math.min(score, 0);
    if (inHeadings) score = Math.min(score, 1);
    if (inDesc) score = Math.min(score, 2);
    if (inTags) score = Math.min(score, 3);
    if (score !== Infinity) {
      // crude snippet: first matching heading or start of content
      const heading = doc.headings.find((h) => h.text.toLowerCase().includes(q));
      const snippet = heading?.text || doc.description || doc.content.slice(0, 140);
      results.push({ path: doc.path, title: doc.title, snippet, score });
    }
  }
  results.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title));
  return results.slice(0, 8);
}
