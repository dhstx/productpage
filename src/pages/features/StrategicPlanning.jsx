import { usePageMeta } from '../../lib/seo';

export default function StrategicPlanning() {
  usePageMeta(
    'Strategic Planning – DHStx',
    'Plan, prioritize, and track strategic initiatives with DHStx.'
  );

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
      <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">STRATEGIC PLANNING</h1>
      <p className="mt-4 max-w-3xl text-[#e0e0e0]">
        Visualize initiatives with effort-impact matrices, assign owners, and monitor progress in real time.
      </p>
    </section>
  );
}
