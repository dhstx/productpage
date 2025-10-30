import React from 'react';

type Props = {
  type?: 'info' | 'warning' | 'tip';
  children: React.ReactNode;
  title?: string;
};

export default function Callout({ type = 'info', children, title }: Props) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    info: { bg: 'var(--card-bg)', border: 'var(--card-border)', text: 'var(--text)' },
    warning: { bg: 'rgba(255, 193, 7, 0.1)', border: '#FFC107', text: 'var(--text)' },
    tip: { bg: 'rgba(0, 200, 83, 0.1)', border: '#00C853', text: 'var(--text)' },
  };
  const c = colors[type] || colors.info;
  return (
    <div className="p-3 rounded-[4px]" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {title ? <div className="font-semibold mb-1 text-sm">{title}</div> : null}
      <div className="text-sm">{children}</div>
    </div>
  );
}
