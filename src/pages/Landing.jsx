import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Target, Users, Calendar, Sparkles, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import ProductDemo from '../components/ProductDemo';
import AIAgents from '../components/AIAgents';
import ContactForm from '../components/ContactForm';
import AIChatInterface from '../components/AIChatInterface';
import AnimatedButton from '../components/AnimatedButton';
import FadeInSection from '../components/FadeInSection';
import PageTransition from '../components/PageTransition';

export default function Landing() {
  // Reusable hero reveal observer applied across devices and viewports
  useEffect(() => {
    const scope = document.querySelector('.hero');
    if (!scope) return;

    const els = scope.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!els.length) return;

    const reveal = (node) => node.classList.add('reveal-show');

    if (!('IntersectionObserver' in window)) {
      els.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (e.target.hasAttribute('data-no-scroll-reveal')) return;
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // One-time fade-in for SYNTEK AUTOMATIONS hero image (50% slower, trigger ~25% visible)
  useEffect(() => {
    const el = document.querySelector('#syntek-automations-hero .fade-once');
    if (!el) return;

    const key = el.getAttribute('data-key') || 'syntekFadeV1';
    const already = sessionStorage.getItem(key) === '1';

    const makeVisible = () => {
      el.classList.add('is-visible');
      if (!already) sessionStorage.setItem(key, '1');
    };

    if (already) {
      // Show instantly; no animation replay
      el.classList.add('is-visible');
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            makeVisible();
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
      io.observe(el);
      return () => io.disconnect();
    } else {
      makeVisible();
    }
  }, []);

  return (
    <PageTransition>
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      <div className="relative flex flex-col">
        {/* Header */}
        <header className="relative z-50 border-b border-[#202020] bg-[#0C0C0C]">
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

        {/* AI Chat Interface */}
        {/* Ensure chat stays usable on mobile */}
        <div style={{ marginTop: '-2in' }} className="hero">
          <AIChatInterface />
        </div>

        {/* Hero Section */}
        {/* clamp heading via .h1, keep hero centered within ~4xl */}
        <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-6 px-4 pb-16 pt-16 sm:pb-20 sm:pt-20 md:px-8 md:pb-48 md:pt-32">
          <FadeInSection>
            <div className="max-w-4xl mx-auto" style={{ marginTop: '-0.5in' }}>
              <h1 className="h1 leading-tight text-balance font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight" style={{ fontSize: 'clamp(1.6rem, 6.5vw, 3rem)', marginTop: '1in' }}>
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

        {/* SYNTEK AUTOMATIONS Hero Image */}
        <div className="syntek-image-container" id="syntek-automations-hero">
          <img
            src="/assets/SYNTEK AUTOMATIONS.svg"
            alt="SYNTEK AUTOMATIONS"
            className="syntek-hero fade-once"
            width="1024"
            height="1024"
            decoding="async"
            loading="lazy"
            data-key="syntekFadeV1"
          />
        </div>

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
