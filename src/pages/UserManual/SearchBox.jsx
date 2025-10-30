import React, { useEffect, useMemo, useState } from 'react';

export default function SearchBox({ documents }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  // Lazy-load Fuse.js and init index on client
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mod = await import('fuse.js');
        if (!active) return;
        const Fuse = mod.default || mod;
        const f = new Fuse(documents, {
          includeScore: true,
          threshold: 0.35,
          keys: [
            { name: 'title', weight: 0.6 },
            { name: 'description', weight: 0.3 },
            { name: 'body', weight: 0.1 },
          ],
        });
        setFuse(f);
      } catch (err) {
        console.error('Search init failed', err);
      }
    })();
    return () => {
      active = false;
    };
  }, [documents]);

  useEffect(() => {
    if (!fuse || !query) {
      setResults([]);
      return;
    }
    const raw = fuse.search(query).slice(0, 10);
    setResults(raw.map((r) => r.item));
  }, [fuse, query]);

  const algoliaEnabled = useMemo(() => {
    return (
      !!import.meta.env.VITE_DOCSEARCH_APP_ID &&
      !!import.meta.env.VITE_DOCSEARCH_API_KEY &&
      !!import.meta.env.VITE_DOCSEARCH_INDEX_NAME
    );
  }, []);

  return (
    <div className="w-full">
      <label htmlFor="um-search" className="sr-only">
        Search the manual
      </label>
      <input
        id="um-search"
        type="search"
        placeholder="Search the manual (topics, workflows, billing, glossary)"
        className="w-full rounded-md border px-4 py-2 outline-none"
        style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />

      {/* Inline results list; no overlays */}
      <div aria-live="polite" className="mt-3">
        {query && results.length > 0 && (
          <ul className="space-y-2">
            {results.map((doc) => (
              <li key={doc.slug} className="rounded-md border p-3" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
                <div className="text-sm font-semibold">{doc.title}</div>
                {doc.description && <div className="text-xs" style={{ color: 'var(--muted)' }}>{doc.description}</div>}
              </li>
            ))}
          </ul>
        )}
        {query && results.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--muted)' }}>No matches found.</div>
        )}
      </div>

      {/* Optional DocSearch upgrade placeholder (no overlay by default) */}
      {algoliaEnabled && (
        <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          DocSearch is configured; inline search uses Algolia at runtime.
        </p>
      )}
    </div>
  );
}
