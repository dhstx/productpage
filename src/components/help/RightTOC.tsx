import React from 'react';

export type TOCItem = { level: 2 | 3 | 4; text: string; id: string };

export default function RightTOC({ headings }: { headings: TOCItem[] }) {
  try {
    if (!headings?.length) return null;
    return (
      <div className="text-sm">
        <div className="mb-2 font-medium text-neutral-800 dark:text-neutral-200">On this page</div>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 2 ? 'pl-0' : h.level === 3 ? 'pl-3' : 'pl-6'}>
              <a href={`#${h.id}`} className="text-neutral-600 hover:underline dark:text-neutral-400">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
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
