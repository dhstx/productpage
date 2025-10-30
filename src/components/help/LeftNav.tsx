import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { buildManualIndex } from '@/user-manual/searchIndex';

export default function LeftNav() {
  const index = useMemo(() => buildManualIndex(), []);
  const location = useLocation();
  const activePath = location.pathname;

  const items = index.docs.map((d) => ({ path: d.path, title: d.title }));

  return (
    <nav className="space-y-1 text-sm">
      {items.map((item) => {
        const active = activePath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded px-3 py-1.5 ${active ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50' : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
