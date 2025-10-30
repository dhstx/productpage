import React from 'react';
import { Link } from 'react-router-dom';

export default function AppendixLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link to={`/user-manual/${slug}`} className="hover:underline" style={{ color: 'var(--text)' }}>
      {children}
    </Link>
   );
}
