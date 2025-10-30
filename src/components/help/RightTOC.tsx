import React, { useEffect, useState } from 'react';

type Heading = { id: string; text: string; depth: number };

export default function RightTOC({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll('h2, h3, h4')) as HTMLHeadingElement[];
    const hs: Heading[] = nodes.map((n) => ({
      id: n.id,
      text: n.textContent || '',
      depth: n.tagName === 'H2' ? 2 : n.tagName === 'H3' ? 3 : 4,
    }));
    setHeadings(hs);
  }, [containerRef]);

  if (!headings.length) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="text-xs mb-2 uppercase tracking-tight" style={{ color: 'var(--muted)' }}>On this page</div>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: (h.depth - 2) * 12 }}>
            <a href={`#${h.id}`} className="hover:underline" style={{ color: 'var(--text)' }}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
