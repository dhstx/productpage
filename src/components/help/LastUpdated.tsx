import React from 'react';

export default function LastUpdated({ updated }: { updated?: string }) {
  if (!updated) return null;
  const date = new Date(updated);
  const isValid = !isNaN(date.getTime());
  return (
    <div className="text-xs text-neutral-500 dark:text-neutral-400">Last updated: {isValid ? date.toLocaleDateString() : updated}</div>
  );
}
