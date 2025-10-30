import Fuse, { IFuseOptions } from 'fuse.js';
import type { ManualArticle } from './contentIndex';

export type SearchRecord = {
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  headings?: string[];
  body: string;
  updated?: string;
};

export function buildSearchData(articles: ManualArticle[]): SearchRecord[] {
  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    tags: a.tags,
    headings: a.headings?.map((h) => h.text) || [],
    body: a.body,
    updated: a.updated,
  }));
}

const options: IFuseOptions<SearchRecord> = {
  includeScore: true,
  shouldSort: true,
  minMatchCharLength: 2,
  threshold: 0.35,
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'description', weight: 0.25 },
    { name: 'tags', weight: 0.15 },
    { name: 'headings', weight: 0.1 },
    { name: 'body', weight: 0.05 },
  ],
};

export function buildFuseIndex(records: SearchRecord[]): Fuse<SearchRecord> {
  return new Fuse(records, options);
}
