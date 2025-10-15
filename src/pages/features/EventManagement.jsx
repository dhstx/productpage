import { usePageMeta } from '../../lib/seo';

export default function EventManagement() {
  usePageMeta(
    'Event Management – DHStx',
    'Plan meetings and events with RSVP tracking and reminders.'
  );

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
      <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">EVENT MANAGEMENT</h1>
      <p className="mt-4 max-w-3xl text-[#e0e0e0]">
        Coordinate meetings and events end-to-end with RSVPs, attendance, and automated reminders.
      </p>
    </section>
  );
}
