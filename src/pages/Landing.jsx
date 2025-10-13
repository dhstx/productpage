import { Link } from 'react-router-dom';
import { Target, Users, Calendar, Sparkles } from 'lucide-react';
import ProductDemo from '../components/ProductDemo';
import AIAgents from '../components/AIAgents';
import ContactForm from '../components/ContactForm';
import AIChatInterface from '../components/AIChatInterface';
import AnimatedButton from '../components/AnimatedButton';
import FadeInSection from '../components/FadeInSection';
import PageTransition from '../components/PageTransition';

export default function Landing() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-[#0C0C0C]">
      <div>
        {/* Header */}
        <header className="border-b border-[#202020] bg-[#0C0C0C]/95 backdrop-blur-sm">
          {/* mobile-first container; wrap CTAs on small screens to avoid overflow */}
          <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="text-[#F2F2F2] text-xl font-bold tracking-tight">DHStx</div>
            <div className="flex flex-wrap gap-3">
              <Link to="/product" className="btn-system">
                Explore Platform
              </Link>
              <Link to="/login" className="btn-system">
                Account Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        {/* clamp heading via .h1, keep hero centered within ~4xl */}
        <section className="mx-auto max-w-screen-xl px-4 md:px-8 pt-24 md:pt-32 pb-24 md:pb-48 min-h-[60vh] md:min-h-screen flex items-center">
          <FadeInSection>
            <div className="max-w-4xl mx-auto">
              <h1 className="h1 leading-tight text-balance font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
                TRANSFORM YOUR COMPANY INTO A POWERHOUSE
              </h1>
              <p className="text-xl text-[#B3B3B3] mb-8 max-w-2xl text-pretty">
                The all-in-one platform for management, strategic planning, and organizational excellence
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
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

        {/* AI Chat Interface */}
        <AIChatInterface />

        {/* Core Modules */}
        <section className="mx-auto max-w-screen-xl px-4 md:px-8 py-16">
          <FadeInSection>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
              CORE MODULES
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="panel-system p-8 max-w-4xl mx-auto">
              <p className="text-[#F2F2F2] text-lg leading-relaxed text-center">
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
              <p>© 2025 Management Platform. All rights reserved.</p>
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
    <div className="panel-system p-6 hover:bg-[#202020] transition-colors duration-200 h-full flex flex-col">
      <div className="text-[#FFC96C] mb-4">{icon}</div>
      <h3 className="text-[#F2F2F2] font-bold mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-[#B3B3B3] flex-grow">{description}</p>
    </div>
  );
}
