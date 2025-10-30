import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Target, Users, Calendar, Sparkles, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import ProductDemo from '../components/ProductDemo';
import AIAgents from '../components/AIAgents';
import ContactForm from '../components/ContactForm';
import AIChatInterface from '../components/AIChatInterface';
import "@/styles/public-chatbox.css";
import AnimatedButton from '../components/AnimatedButton';
import FadeInSection from '../components/FadeInSection';
import PageTransition from '../components/PageTransition';

export default function Landing() {
  // Start at the very top on mount to avoid mid-page starts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);
  // Reveal logic centralized in global script; remove page-level observers

  // Measure header height and expose as CSS variable for safe spacing
  useEffect(() => {
    const setHeaderHeight = () => {
      const el = document.getElementById('site-header');
      if (el) {
        document.documentElement.style.setProperty('--site-header-height', `${el.offsetHeight}px`);
      }
    };

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('orientationchange', setHeaderHeight);
    const target = document.getElementById('site-header');
    const mo = new MutationObserver(setHeaderHeight);
    if (target) mo.observe(target, { childList: true, subtree: true, attributes: true });
    return () => {
      window.removeEventListener('resize', setHeaderHeight);
      window.removeEventListener('orientationchange', setHeaderHeight);
      mo.disconnect();
    };
  }, []);

  return (
    <PageTransition>
    <div className="min-h-screen w-full max-w-screen min-w-0 bg-[#0C0C0C]">
      <div className="relative flex flex-col">
        {/* Header */}
        <header id="site-header" className="fixed top-0 left-0 right-0 z-50 border-b border-[#202020] bg-[#0C0C0C]">
          {/* mobile-first container; removed duplicate CTAs per mobile optimization */}
          <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-4 md:px-8">
            <div className="min-w-0 text-[clamp(1.125rem,4vw,1.5rem)] font-bold tracking-tight text-[#F2F2F2]">DHStx</div>
            <div className="flex items-center gap-3">
              <ThemeToggle inline />
              <Link
                to="/login"
                role="button"
                aria-label="Account Login"
                className="z-40 w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#202020] hover:bg-[#202020] transition-colors flex items-center justify-center shadow text-[#B3B3B3] hover:text-[#FFC96C]"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* AI Chat Interface reserved slot to avoid layout jump */}
        <section className="public-chatbox-slot pb-[2in]">
          <AIChatInterface />
        </section>

        {/* SYNTEK AUTOMATIONS mark above Hero */}
        <section id="syntek-svg-section" className="syntek-image-container">
          <img
            id="syntek-svg"
            className="syntek-hero fade-once"
            src="/assets/SYNTEK AUTOMATIONS.svg"
            alt="Syntek Automations mark"
            width="1024"
            height="1024"
            loading="lazy"
            decoding="async"
          />
        </section>

        {/* Hero Section */}
        {/* clamp heading via .h1, keep hero centered within ~4xl */}
        <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-6 px-4 pb-16 pt-16 sm:pb-20 sm:pt-20 md:px-8 md:pb-48 md:pt-32">
          <FadeInSection>
            <div className="max-w-4xl mx-auto" style={{ marginTop: '-0.5in' }}>
              <h1 className="h1 leading-tight text-balance font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-center" style={{ fontSize: 'clamp(1.6rem, 6.5vw, 3rem)', marginTop: '1in' }}>
                TRANSFORM YOUR COMPANY INTO A POWERHOUSE
              </h1>
              <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 max-w-2xl text-pretty text-center mx-auto">
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

        {/* Core Modules */}
        <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:px-8">
          <FadeInSection>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
              CORE MODULES
            </h2>
          </FadeInSection>
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FadeInSection delay={0.1}>
              <ModuleCard
                icon={<Target className="w-6 h-6" />}
                title="Strategic Planning"
                description="Visualize initiatives with effort-impact matrices and track progress in real-time"
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <ModuleCard
                icon={<Users className="w-6 h-6" />}
                title="Member Engagement"
                description="Manage comprehensive member records with engagement tracking, participation history, and professional networking capabilities"
              />
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <ModuleCard
                icon={<Calendar className="w-6 h-6" />}
                title="Event Management"
                description="Plan meetings, coordinate events, and manage RSVPs all in one place"
              />
            </FadeInSection>
            <FadeInSection delay={0.4}>
              <ModuleCard
                icon={<Sparkles className="w-6 h-6" />}
                title="AI-Powered Insights"
                description="Three specialized AI agents provide intelligent assistance and recommendations"
              />
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
              <p className="text-center text-[clamp(1rem,3.5vw,1.25rem)] leading-relaxed text-[#F2F2F2] text-pretty">
                We empower organizations to operate more effectively through intelligent technology, streamlined workflows, and data-driven insights. Transform your organization from reactive to proactive, from scattered to strategic, from overwhelmed to empowered.
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
