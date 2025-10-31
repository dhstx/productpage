import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { buildManualIndex } from '../../user-manual/searchIndex';
import { WALKTHROUGHS } from '../../../content/manual/walkthroughs.data';

const linkBase = 'block rounded px-3 py-2 text-sm transition-colors';
const linkIdle = 'text-neutral-700 hover:bg-neutral-100 hover:text-amber-700 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-amber-300';
const linkActive = 'bg-amber-100 text-amber-800 shadow-sm dark:bg-neutral-900 dark:text-[color:var(--um-title-color)] dark:border dark:border-neutral-700';

export default function LeftNav() {
  const index = useMemo(() => buildManualIndex(), []);
  const location = useLocation();
  const activePath = location.pathname.replace(/\/$/, '') || '/user-manual';
  const isWalkthroughs = activePath === '/user-manual/walkthroughs';

  if (isWalkthroughs) {
    return (
      <nav className="space-y-2">
        {WALKTHROUGHS.map((w, idx) => (
          <a key={w.title} href={`#video-${idx}`} className={`${linkBase} ${linkIdle}`}>
            {w.title}
          </a>
        ))}
      </nav>
    );
  }

  const items = index.docs
    .filter((doc) => doc.path !== '/user-manual/walkthroughs')
    .map((d) => ({ path: d.path, title: d.title }));

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const active = activePath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`${linkBase} ${active ? linkActive : linkIdle}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
