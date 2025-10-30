import React, { useMemo } from 'react';
import dynamic from '../../lib/dynamic.jsx';
import ErrorBoundary from '../../components/ErrorBoundary';

// Lazy client-only modules (hydrate-only)
const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });
const Feedback = dynamic(() => import('./Feedback'), { ssr: false });
const VideoBlock = dynamic(() => import('./VideoBlock'), { ssr: false });

// Import MDX stubs as raw strings for local search/indexing
// Vite supports ?raw to import as string at build-time
import gettingStartedRaw from '../../../content/manual/getting-started.mdx?raw';
import workflowsRaw from '../../../content/manual/workflows.mdx?raw';
import integrationsRaw from '../../../content/manual/integrations.mdx?raw';
import securityRaw from '../../../content/manual/security.mdx?raw';
import billingRaw from '../../../content/manual/billing.mdx?raw';
import faqRaw from '../../../content/manual/faq.mdx?raw';
import glossaryRaw from '../../../content/manual/appendix/glossary.mdx?raw';

function parseFrontMatter(raw) {
  // Minimal front matter parser (expects --- on first lines)
  try {
    const trimmed = raw.trimStart();
    if (!trimmed.startsWith('---')) {
      return { attributes: {}, body: raw };
    }
    const end = trimmed.indexOf('\n---');
    const fmBlock = trimmed.slice(3, end).trim();
    const body = trimmed.slice(end + 4).trimStart();
    const attributes = {};
    fmBlock.split(/\n+/).forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
        attributes[key] = value;
      }
    });
    return { attributes, body };
  } catch {
    return { attributes: {}, body: raw };
  }
}

const docsList = [
  { slug: 'getting-started', category: 'Getting Started', raw: gettingStartedRaw },
  { slug: 'workflows', category: 'Workflows', raw: workflowsRaw },
  { slug: 'integrations', category: 'Integrations', raw: integrationsRaw },
  { slug: 'security', category: 'Security', raw: securityRaw },
  { slug: 'billing', category: 'Billing', raw: billingRaw },
  { slug: 'faq', category: 'FAQ', raw: faqRaw },
  { slug: 'appendix/glossary', category: 'Appendix', raw: glossaryRaw },
].map((d) => {
  const { attributes, body } = parseFrontMatter(d.raw);
  return {
    id: d.slug,
    slug: d.slug,
    category: d.category,
    title: attributes.title || d.slug,
    description: attributes.description || '',
    body,
  };
});

export default function UserManual() {
  const categories = useMemo(() => {
    const byCat = new Map();
    for (const doc of docsList) {
      if (!byCat.has(doc.category)) byCat.set(doc.category, []);
      byCat.get(doc.category).push(doc);
    }
    return Array.from(byCat.entries());
  }, []);

  return (
    <ErrorBoundary name="UserManual" title="User Manual error" message="Unable to render the User Manual.">
      <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight">User Manual</h1>
          <p className="mt-2 text-lg text-muted-foreground" style={{ color: 'var(--muted)' }}>
            Learn how Syntek Automations saves time and scales your business.
          </p>

          <section id="search" className="mt-8">
            <SearchBox documents={docsList} />
          </section>

          <section id="content" className="mt-8">
            {categories.map(([cat, items]) => (
              <div key={cat} className="mb-10">
                <h2 className="text-xl font-semibold tracking-tight">{cat}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {items.map((doc) => (
                    <article key={doc.slug} className="rounded-md border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
                      <h3 className="font-semibold">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{doc.description}</p>
                      )}
                      <div className="mt-3">
                        <VideoBlock videoId="dQw4w9WgXcQ" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section id="feedback" className="mt-12">
            <Feedback context="user-manual" />
          </section>

          {/* Inline comments: Future tutorials/videos will be embedded per topic above. */}
        </div>
      </main>
    </ErrorBoundary>
  );
}
