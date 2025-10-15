import { usePageMeta } from '../../lib/seo';

export default function MemberEngagement() {
  usePageMeta(
    'Member Engagement – DHStx',
    'Track participation and strengthen member engagement with DHStx.'
  );

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
      <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">MEMBER ENGAGEMENT</h1>
      <p className="mt-4 max-w-3xl text-[#e0e0e0]">
        Centralize member records, participation history, and communications to deepen engagement across your community.
      </p>
    </section>
  );
}
