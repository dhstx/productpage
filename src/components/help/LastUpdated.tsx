import React from 'react';

export default function LastUpdated({ updated }: { updated?: string }) {
  if (!updated) return null;
  const dt = new Date(updated);
  const human = dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  return (
    <div className="text-xs" style={{ color: 'var(--muted)' }}>
      Last updated {human}
    </div>
  );
}
