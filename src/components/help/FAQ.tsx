import React from 'react';

type FAQItem = { q: string; a: React.ReactNode };

export default function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((it, idx) => (
        <details key={idx} className="rounded-[4px] p-3" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <summary className="cursor-pointer select-none font-medium">{it.q}</summary>
          <div className="mt-2 text-sm" style={{ color: 'var(--text)' }}>{it.a}</div>
        </details>
      ))}
    </div>
  );
}
