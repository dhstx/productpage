import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@docsearch/css';
import type Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import type { SearchRecord } from './search';

type Props = {
  fuse: Fuse<SearchRecord> | null;
  onSelect: (slug: string) => void;
};

export default function GlobalSearch({ fuse, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<{ slug: string; title: string; description?: string }[]>([]);
  const supportsDocSearch = Boolean(import.meta.env.VITE_DOCSEARCH_APP_ID && import.meta.env.VITE_DOCSEARCH_API_KEY);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!fuse) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const out = fuse.search(query).slice(0, 8).map((r) => ({
      slug: r.item.slug,
      title: r.item.title,
      description: r.item.description,
    }));
    setResults(out);
    // telemetry (privacy: do not log raw query if not safe)
    try {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'help.search', { category: 'Help', action: 'search', label: 'help.search' });
      }
    } catch {}
  }, [query, fuse]);

  // Optional Algolia DocSearch lazy-init
  const DocSearchButton = useMemo(() => {
    if (!supportsDocSearch) return null;
    return React.lazy(async () => {
      const mod = await import('@docsearch/react');
      return { default: mod.DocSearch }; // We will render with props
    });
  }, [supportsDocSearch]);

  return (
    <div className="w-full">
      <label htmlFor="help-global-search" className="sr-only">Search help</label>
      <div className="relative">
        <input
          id="help-global-search"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="w-full rounded-[4px] px-10 py-3"
          placeholder={supportsDocSearch ? 'Search the manual (⌘/Ctrl+K, Algolia enabled)' : 'Search the manual (⌘/Ctrl+K)'}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--text)'
          }}
          aria-describedby="help-search-hint"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
        <span id="help-search-hint" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--muted)' }}>
          ⌘/Ctrl+K
        </span>
      </div>

      {/* Algolia modal (optional) */}
      {supportsDocSearch && DocSearchButton && (
        <React.Suspense fallback={null}>
          <DocSearchButton
            appId={import.meta.env.VITE_DOCSEARCH_APP_ID}
            apiKey={import.meta.env.VITE_DOCSEARCH_API_KEY}
            indexName={import.meta.env.VITE_DOCSEARCH_INDEX || 'docs'}
          />
        </React.Suspense>
      )}

      {/* Local search popover */}
      {open && results.length > 0 && (
        <div role="listbox" aria-label="Search results" aria-live="polite" className="mt-2 rounded-[4px] shadow-lg overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {results.map((r) => (
            <button
              key={r.slug}
              role="option"
              className="w-full text-left px-4 py-3 hover:brightness-110"
              style={{ color: 'var(--text)' }}
              onClick={() => {
                setOpen(false);
                setQuery('');
                onSelect(r.slug || '');
              }}
            >
              <div className="text-sm font-medium">{r.title}</div>
              {r.description ? (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{r.description}</div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
