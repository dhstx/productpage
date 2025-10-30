import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isDevEnvironment } from '@/lib/helpSafeMode';
import { buildManualIndex, searchManual, SYNONYMS } from '@/user-manual/searchIndex';
import { Link } from 'react-router-dom';

export default function SearchBox() {
  try {
    const index = useMemo(() => buildManualIndex(), []);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(() => [] as ReturnType<typeof searchManual>);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      try {
        if (isDevEnvironment()) {
          // eslint-disable-next-line no-console
          console.warn('[help][search] hydration start');
        }
        const onKey = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            inputRef.current?.focus();
          }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[user-manual:widget]', e);
        }
        return () => {};
      }
    }, []);

    useEffect(() => {
      try {
        let q = query.trim();
        if (!q) {
          setResults([]);
          return;
        }
        // Synonym expansion (very simple): if exact key matches, append synonyms
        const lower = q.toLowerCase();
        for (const [key, values] of Object.entries(SYNONYMS)) {
          if (lower === key.toLowerCase()) {
            q = `${q} ${values.join(' ')}`;
            break;
          }
        }
        setResults(searchManual(index, q));
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[user-manual:widget]', e);
        }
        setResults([]);
      }
    }, [index, query]);

    return (
      <div>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the manual (Cmd/Ctrl+K)"
            aria-label="Search the user manual"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:ring-neutral-600"
          />
        </div>
        {results.length > 0 && (
          <div className="mt-3 rounded border border-neutral-200 bg-white p-2 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <ul>
              {results.map((r) => (
                <li key={r.path} className="px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded">
                  <Link to={r.path} className="flex flex-col">
                    <span className="font-medium">{r.title}</span>
                    {r.snippet ? (
                      <span className="text-neutral-600 dark:text-neutral-400">{r.snippet}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[user-manual:widget]', e);
    }
    return null;
  }
}
