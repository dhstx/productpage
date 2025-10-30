import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ManualCategory } from './contentIndex';

export default function LeftNav({ categories }: { categories: ManualCategory[] }) {
  const location = useLocation();
  const active = location.pathname.replace(/^\/user-manual\/?/, '').replace(/\/$/, '');

  return (
    <nav aria-label="Help categories" className="space-y-6">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="text-xs mb-2 uppercase tracking-tight" style={{ color: 'var(--muted)' }}>{cat.label}</div>
          <ul className="space-y-1">
            {cat.items.map((item) => {
              const isActive = item.slug === active || (item.slug === '' && active === '');
              return (
                <li key={item.slug}>
                  <Link
                    to={`/user-manual/${item.slug}`}
                    className="block px-2 py-1 rounded-[3px] text-sm"
                    style={isActive ? { background: 'var(--card-bg)', color: 'var(--accent-gold)' } : { color: 'var(--text)' }}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
