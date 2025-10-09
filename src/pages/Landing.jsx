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
        <section className="container mx-auto px-6 pt-24 pb-32 min-h-[calc(100vh-8rem)] flex items-center">
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

        {/* AI Chat Interface */}
        <AIChatInterface />

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

        {/* Contact Form */}
        <FadeInSection>
          <ContactForm />
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
