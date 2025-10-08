import { Link } from 'react-router-dom';
import { Target, Users, Calendar, Sparkles } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import EmailCapture from '../components/EmailCapture';
import TrustBadges from '../components/TrustBadges';
import FAQ from '../components/FAQ';
import ProductDemo from '../components/ProductDemo';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C]">
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
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
            TRANSFORM YOUR COMPANY INTO A POWERHOUSE
          </h1>
          <p className="text-xl text-[#B3B3B3] mb-8 max-w-2xl">
            The all-in-one platform for management, strategic planning, and organizational excellence
          </p>
          <div className="flex gap-4">
            <Link to="/product" className="btn-system">
              Explore Platform
            </Link>
            <Link to="/login" className="btn-system">
              Account Login
            </Link>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight">
          CORE MODULES
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            icon={<Target className="w-6 h-6" />}
            title="Strategic Planning"
            description="Visualize initiatives with effort-impact matrices and track progress in real-time"
          />
          <ModuleCard
            icon={<Users className="w-6 h-6" />}
            title="Member Engagement"
            description="Manage comprehensive member records with engagement tracking, participation history, and professional networking capabilities"
          />
          <ModuleCard
            icon={<Calendar className="w-6 h-6" />}
            title="Event Management"
            description="Plan meetings, coordinate events, and manage RSVPs all in one place"
          />
          <ModuleCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI-Powered Insights"
            description="Three specialized AI agents provide intelligent assistance and recommendations"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight">
          MISSION
        </h2>
        <div className="panel-system p-8 max-w-4xl">
          <p className="text-[#F2F2F2] text-lg leading-relaxed">
            We empower boards and organizations to operate more effectively through intelligent technology, streamlined workflows, and data-driven insights. Transform your board from reactive to proactive, from scattered to strategic, from overwhelmed to empowered.
          </p>
        </div>
      </section>

      {/* Product Demo */}
      <ProductDemo />

      {/* Testimonials */}
      <Testimonials />

      {/* Email Capture */}
      <EmailCapture />

      {/* Trust Badges */}
      <TrustBadges />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 Management Platform. All rights reserved.</p>
            <p>Empowering boards, committees, and organizations worldwide</p>
          </div>
        </div>
      </footer>
    </div>
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
