import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, Calendar, Sparkles, Shield, Zap, Database, CheckCircle } from 'lucide-react';
import ROICalculator from '../components/ROICalculator';
import ScrollGears from '../components/graphics/ScrollGears';

export default function Product() {
  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[#B3B3B3] hover:text-[#FFC96C] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[#F2F2F2] text-xl font-bold tracking-tight">DHStx</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="btn-system">
              Account Login
            </Link>
          </div>
        </div>
      </header>

      {/* Platform Overview */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <span className="text-[#FFC96C] text-sm uppercase tracking-wider">PLATFORM OVERVIEW</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-center">
          COMPLETE BOARD MANAGEMENT SYSTEM
        </h1>
        <p className="text-xl text-[#B3B3B3] mb-12 max-w-3xl mx-auto text-center">
          The all-in-one platform for management, strategic planning, and organizational excellence. Built for efficiency, powered by intelligence.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="btn-system">
            Request Demo
          </Link>
        </div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <span className="text-[#FFC96C] text-sm uppercase tracking-wider">CORE FEATURES</span>
        </div>
        <h2 className="text-3xl font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
          EVERYTHING YOU NEED
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="Strategic Initiatives Tracker"
            description="Visualize and prioritize initiatives using effort-impact matrices. Track progress, assign owners, and ensure alignment with organizational goals."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Member Engagement Database"
            description="Manage comprehensive member records with engagement tracking, participation history, and professional networking capabilities."
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6" />}
            title="Events & Calendar Management"
            description="Plan board meetings, member gatherings, and events with RSVP tracking, attendance management, and automated reminders."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI-Powered Intelligence"
            description="Three specialized AI agents provide board assistance, committee coordination, and analytics insights to enhance decision-making."
          />
        </div>
      </section>

      {/* Enterprise Grade */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <span className="text-[#FFC96C] text-sm uppercase tracking-wider">ENTERPRISE GRADE</span>
        </div>
        <h2 className="text-3xl font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
          BUILT FOR SCALE
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <CapabilityCard
            icon={<Shield className="w-8 h-8" />}
            title="Enterprise Security"
            description="SSO/SAML integration, role-based access control, and audit logs ensure your data stays secure and compliant."
            features={['Single Sign-On', 'RBAC Permissions', 'Audit Trails', 'SOC 2 Ready']}
          />
          <CapabilityCard
            icon={<Zap className="w-8 h-8" />}
            title="Automation & Workflows"
            description="Automated email notifications, task assignments, and progress tracking keep your board aligned and informed."
            features={['Email Alerts', 'Task Automation', 'Progress Tracking', 'Smart Reminders']}
          />
          <CapabilityCard
            icon={<Database className="w-8 h-8" />}
            title="Data Management"
            description="Import/export capabilities, bulk operations, and seamless migration from existing systems."
            features={['Bulk Import', 'CSV Export', 'Data Migration', 'API Access']}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="panel-system p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            READY TO TRANSFORM YOUR BOARD?
          </h2>
          <p className="text-[#B3B3B3] mb-8 text-lg">
            Join organizations that have modernized their board operations. Schedule a demo today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-system">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Scroll Gears Animation */}
      <section className="py-24 border-b border-[#202020]">
        <ScrollGears color="#FFC96C" />
      </section>

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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="panel-system p-6">
      <div className="text-[#FFC96C] mb-4">{icon}</div>
      <h3 className="text-[#F2F2F2] font-bold mb-3 uppercase tracking-tight text-lg">{title}</h3>
      <p className="text-[#B3B3B3] leading-relaxed">{description}</p>
    </div>
  );
}

function CapabilityCard({ icon, title, description, features }) {
  return (
    <div className="panel-system p-6">
      <div className="text-[#FFC96C] mb-4">{icon}</div>
      <h3 className="text-[#F2F2F2] font-bold mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-[#B3B3B3] mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-[#B3B3B3] text-sm">
            <CheckCircle className="w-4 h-4 text-[#FFC96C]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}


