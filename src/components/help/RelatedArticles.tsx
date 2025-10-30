import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ManualDoc, ManualIndex } from '@/src/user-manual/searchIndex';

export default function RelatedArticles({ current, index }: { current: ManualDoc; index: ManualIndex }) {
  const items = useMemo(() => {
    const pool = index.docs.filter((d) => d.path !== current.path);
    const scored = pool.map((d) => {
      const overlap = d.tags.filter((t) => current.tags.includes(t)).length;
      return { d, score: overlap };
    });
    scored.sort((a, b) => b.score - a.score || a.d.title.localeCompare(b.d.title));
    return scored.filter((s) => s.score > 0).slice(0, 5).map((s) => s.d);
  }, [current, index]);

  if (!items.length) return null;

  return (
    <div className="mt-6 text-sm">
      <div className="mb-2 font-medium text-neutral-800 dark:text-neutral-200">Related</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.path}>
            <Link to={it.path} className="text-neutral-600 hover:underline dark:text-neutral-400">
              {it.title}
            </Link>
          </li>)
        )}
      </ul>
    </div>
  );
}
