import { Link } from 'react-router-dom';
import { Target, Users, Calendar, Sparkles } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import TrustBadges from '../components/TrustBadges';
import FAQ from '../components/FAQ';
import ProductDemo from '../components/ProductDemo';
import AIAgents from '../components/AIAgents';
import ContactForm from '../components/ContactForm';
import BackgroundGears from '../components/graphics/BackgroundGears';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCounter from '../components/AnimatedCounter';
import FadeInSection from '../components/FadeInSection';
import PageTransition from '../components/PageTransition';

export default function Landing() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-[#0C0C0C] relative">
      {/* Background Gears - Fixed and animated */}
      <BackgroundGears color="#FFC96C" opacity={0.18} />

      {/* Content layer with higher z-index */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#202020] bg-[#0C0C0C]/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-[#F2F2F2] text-xl font-bold tracking-tight">DHStx</div>
            <div className="flex gap-4">
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
        <section className="container mx-auto px-6 py-24">
          <FadeInSection>
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
                TRANSFORM YOUR COMPANY INTO A POWERHOUSE
              </h1>
              <p className="text-xl text-[#B3B3B3] mb-8 max-w-2xl">
                The all-in-one platform for management, strategic planning, and organizational excellence
              </p>
              <div className="flex gap-4">
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
        <section className="container mx-auto px-6 py-16">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight">
              CORE MODULES
            </h2>
          </FadeInSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Stats Section with Animated Counters */}
        <section className="container mx-auto px-6 py-16">
          <FadeInSection>
            <div className="panel-system p-12">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-5xl font-bold text-[#FFC96C] mb-2">
                    <AnimatedCounter end={500} duration={2000} suffix="+" />
                  </div>
                  <div className="text-[#B3B3B3] uppercase tracking-wide text-sm">
                    Organizations
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-[#FFC96C] mb-2">
                    <AnimatedCounter end={10000} duration={2000} suffix="+" />
                  </div>
                  <div className="text-[#B3B3B3] uppercase tracking-wide text-sm">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-[#FFC96C] mb-2">
                    <AnimatedCounter end={99} duration={2000} suffix="%" />
                  </div>
                  <div className="text-[#B3B3B3] uppercase tracking-wide text-sm">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* AI Agents Section */}
        <FadeInSection>
          <AIAgents />
        </FadeInSection>

        {/* Mission */}
        <section className="container mx-auto px-6 py-16">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight">
              MISSION
            </h2>
            <div className="panel-system p-8 max-w-4xl">
              <p className="text-[#F2F2F2] text-lg leading-relaxed">
                We empower boards and organizations to operate more effectively through intelligent technology, streamlined workflows, and data-driven insights. Transform your board from reactive to proactive, from scattered to strategic, from overwhelmed to empowered.
              </p>
            </div>
          </FadeInSection>
        </section>

        {/* Product Demo */}
        <FadeInSection>
          <ProductDemo />
        </FadeInSection>

        {/* Testimonials */}
        <FadeInSection>
          <Testimonials />
        </FadeInSection>

        {/* Contact Form */}
        <FadeInSection>
          <ContactForm />
        </FadeInSection>

        {/* Trust Badges */}
        <FadeInSection>
          <TrustBadges />
        </FadeInSection>

        {/* FAQ */}
        <FadeInSection>
          <FAQ />
        </FadeInSection>

        {/* Footer */}
        <footer className="border-t border-[#202020] mt-24 bg-[#0C0C0C]/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
              <p>© 2025 Management Platform. All rights reserved.</p>
              <p>Empowering boards, committees, and organizations worldwide</p>
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
    <div className="panel-system p-6 hover:bg-[#202020] transition-colors duration-200">
      <div className="text-[#FFC96C] mb-4">{icon}</div>
      <h3 className="text-[#F2F2F2] font-bold mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-[#B3B3B3]">{description}</p>
    </div>
  );
}
