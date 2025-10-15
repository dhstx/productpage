import { usePageMeta } from '../../lib/seo';

export default function AIPoweredInsights() {
  usePageMeta(
    'AI-Powered Insights – DHStx',
    'Unlock data-driven insights with specialized AI agents in DHStx.'
  );

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
      <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">AI-POWERED INSIGHTS</h1>
      <p className="mt-4 max-w-3xl text-[#e0e0e0]">
        Three specialized AI agents surface recommendations and automate routine work so your team can focus on impact.
      </p>
    </section>
  );
}
