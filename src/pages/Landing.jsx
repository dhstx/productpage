import { Link } from 'react-router-dom';
import { Target, Users, Calendar, Sparkles, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { usePageMeta } from '../lib/seo';
import ProductDemo from '../components/ProductDemo';
import AIAgents from '../components/AIAgents';
import ContactForm from '../components/ContactForm';
import AIChatInterface from '../components/AIChatInterface';
import AnimatedButton from '../components/AnimatedButton';
import FadeInSection from '../components/FadeInSection';
import PageTransition from '../components/PageTransition';

export default function Landing() {
  usePageMeta(
    'DHStx – Enterprise Board Management & Strategic Planning',
    'All-in-one platform for management, strategic planning, and organizational excellence.'
  );
  // Determine if this is the live (production) deployment
  // Priority: production domain check; fallback to env flag if provided
  const isLiveDeployment = (() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      if (host.endsWith('dhstx.co')) return true;
    }
    return import.meta.env?.VITE_ENV === 'production';
  })();

  const heroSection = (
    <>
      {/* Hero Section (placed above header) */}
      {/* clamp heading via .h1, keep hero centered within ~4xl */}
      <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-6 px-4 pb-8 pt-8 sm:pb-10 sm:pt-10 md:px-8 md:pb-16 md:pt-16">
        <FadeInSection>
          <div className="max-w-4xl mx-auto">
            <img
              src="/syntek-hero.png"
              alt="Syntek Automations logo centered in hero"
              className="mx-auto mb-6 h-auto w-[140px] sm:w-[180px] md:w-[220px]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/og-image.svg';
              }}
            />
            <h1 className="h1 leading-tight text-balance font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight" style={{ fontSize: 'clamp(1.6rem, 6.5vw, 3rem)' }}>
              TRANSFORM YOUR COMPANY INTO A POWERHOUSE
            </h1>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 max-w-2xl text-pretty">
              The all-in-one platform for management, strategic planning, and organizational excellence
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <AnimatedButton asChild>
                <Link to="/product" className="btn-system">
                  Explore Platform
                </Link>
              </AnimatedButton>
              <AnimatedButton asChild variant="secondary">
                <Link to="/login" className="btn-system">
                  Account Login
                </Link>
              </AnimatedButton>
            </div>
          </div>
        </FadeInSection>
      </section>
    </>
  );
  return (
    <PageTransition>
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      <div className="relative flex flex-col">
        {isLiveDeployment ? (
          <>
            {/* AI Chat Interface */}
            {/* Ensure chat stays usable on mobile */}
            <div className="mb-8 sm:mb-10 md:mb-16">
              <AIChatInterface />
            </div>
            {heroSection}
          </>
        ) : (
          <>
            {/* AI Chat Interface */}
            {/* Ensure chat stays usable on mobile */}
            <div className="mb-8 sm:mb-10 md:mb-16">
              <AIChatInterface />
            </div>
            {heroSection}
          </>
        )}

        {/* Header removed: replaced by GlobalNav */}

        {/* Core Modules */}
        <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:px-8">
          <FadeInSection>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
              CORE MODULES
            </h2>
          </FadeInSection>
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FadeInSection delay={0.1}>
              <Link to="/features/strategic-planning" className="block">
                <ModuleCard
                  icon={<Target className="w-6 h-6" />}
                  title="Strategic Planning"
                  description="Visualize initiatives with effort-impact matrices and track progress in real-time"
                />
              </Link>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <Link to="/features/member-engagement" className="block">
                <ModuleCard
                  icon={<Users className="w-6 h-6" />}
                  title="Member Engagement"
                  description="Manage comprehensive member records with engagement tracking, participation history, and professional networking capabilities"
                />
              </Link>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <Link to="/features/event-management" className="block">
                <ModuleCard
                  icon={<Calendar className="w-6 h-6" />}
                  title="Event Management"
                  description="Plan meetings, coordinate events, and manage RSVPs all in one place"
                />
              </Link>
            </FadeInSection>
            <FadeInSection delay={0.4}>
              <Link to="/features/ai-powered-insights" className="block">
                <ModuleCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="AI-Powered Insights"
                  description="Three specialized AI agents provide intelligent assistance and recommendations"
                />
              </Link>
            </FadeInSection>
          </div>
        </section>

        {/* AI Agents Section */}
        <FadeInSection>
          <AIAgents />
        </FadeInSection>

        {/* Mission */}
        <section className="mx-auto max-w-screen-xl px-4 md:px-8 py-16">
          <FadeInSection>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight text-center">
              MISSION
            </h2>
            <div className="panel-system mx-auto max-w-4xl p-6 sm:p-8">
              <p className="text-center text-[clamp(1rem,3.5vw,1.25rem)] leading-relaxed text-[#e0e0e0] text-pretty">
                We empower organizations to operate more effectively through intelligent technology, streamlined workflows, and data-driven insights. Learn more about our
                {' '}<Link to="/features/strategic-planning" className="text-[#FFC96C] hover:underline">Strategic Planning</Link>,
                {' '}<Link to="/features/member-engagement" className="text-[#FFC96C] hover:underline">Member Engagement</Link>,
                {' '}<Link to="/features/event-management" className="text-[#FFC96C] hover:underline">Event Management</Link>, and
                {' '}<Link to="/features/ai-powered-insights" className="text-[#FFC96C] hover:underline">AI‑Powered Insights</Link>.
              </p>
            </div>
          </FadeInSection>
        </section>

        {/* Product Demo */}
        <FadeInSection>
          <ProductDemo />
        </FadeInSection>

        {/* Contact Form */}
        <FadeInSection>
          <ContactForm />
        </FadeInSection>

        {/* Footer */}
        <footer className="border-t border-[#202020] mt-24 bg-[#0C0C0C]/95 backdrop-blur-sm">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-8 pb-safe">
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center text-[#B3B3B3] text-sm">
              <p>© 2025 Syntek Automations. All rights reserved.</p>
              <p>Empowering organizations worldwide</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </PageTransition>
  );
}

function ModuleCard({ icon, title, description }) {
  return (
    <div className="panel-system flex h-full min-w-0 flex-col gap-4 p-6 transition-colors duration-200 hover:bg-[#202020]">
      <div className="text-[#FFC96C] text-balance">{icon}</div>
      <h3 className="h3 text-[#F2F2F2] uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-[#B3B3B3] text-pretty">{description}</p>
    </div>
  );
}
