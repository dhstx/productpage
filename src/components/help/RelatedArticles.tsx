import React from 'react';
import { Link } from 'react-router-dom';
import type { ManualArticle } from './contentIndex';

export default function RelatedArticles({ slugs, all }: { slugs?: string[]; all: ManualArticle[] }) {
  if (!slugs || slugs.length === 0) return null;
  const items = slugs
    .map((s) => all.find((a) => a.slug === s))
    .filter(Boolean) as ManualArticle[];
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-xs mb-2 uppercase tracking-tight" style={{ color: 'var(--muted)' }}>Related</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.slug}>
            <Link to={`/user-manual/${it.slug}`} className="hover:underline" style={{ color: 'var(--text)' }}>
              {it.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
