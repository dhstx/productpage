import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WALKTHROUGHS } from '../../content/manual/walkthroughs.data';

type NavItem = {
  path: string;
  title: string;
  anchor?: string;
};

const OVERVIEW_ITEMS: NavItem[] = [
  { path: '/user-manual', title: 'User Manual' },
  { path: '/user-manual/getting-started', title: 'Getting started' },
  { path: '/user-manual/how-it-works', title: 'How Syntek works' },
];

export default function LeftNav() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, '') || '/user-manual';
  const hash = location.hash;
  const isWalkthroughs = pathname === '/user-manual/walkthroughs';

  const walkthroughItems = useMemo<NavItem[]>(
    () =>
      WALKTHROUGHS.map((item, index) => ({
        path: `/user-manual/walkthroughs#video-${index}`,
        title: item.title,
        anchor: `#video-${index}`,
      })),
    []
  );

  const items = isWalkthroughs ? walkthroughItems : OVERVIEW_ITEMS;

  return (
    <nav className="space-y-1 text-sm">
      {items.map((item, idx) => {
        const active = isWalkthroughs ? hash === item.anchor || (!hash && idx === 0) : pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-current={active ? 'page' : undefined}
            className={`block rounded px-3 py-1.5 transition ${active ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
