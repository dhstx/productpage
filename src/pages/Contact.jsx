import ContactForm from '../components/ContactForm';
import { usePageMeta } from '../lib/seo';

export default function Contact() {
  usePageMeta(
    'Contact – DHStx',
    'Get in touch with DHStx. Request a demo or ask us anything.'
  );

  return (
    <main className="min-h-screen w-full max-w-screen overflow-x-hidden bg-[#0C0C0C]">
      <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
        <div className="mb-8 text-center">
          <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">CONTACT</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3]">
            Have questions? Want a personalized walkthrough? We’re here to help.
          </p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
