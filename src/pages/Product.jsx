import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, Calendar, Sparkles, Shield, Zap, Database, CheckCircle, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import FeatureComparison from '../components/FeatureComparison';
import ROICalculator from '../components/ROICalculator';
import ScrollGears from '../components/graphics/ScrollGears';
import BackArrow from '../components/BackArrow';
import FadeInSection from '../components/FadeInSection';
import { usePageMeta } from '../lib/seo';

export default function Product() {
  usePageMeta(
    'Product – DHStx Platform Overview',
    'Explore DHStx core modules, enterprise features, and ROI calculator.'
  );
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      {/* BackArrow retained; header removed due to GlobalNav */}
      <BackArrow />

      <main>
        {/* Platform Overview */}
        <FadeInSection>
          <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 pb-12 pt-16 sm:pt-20 md:px-8 md:pt-32">
            <div className="mb-2 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFC96C] sm:text-sm">PLATFORM OVERVIEW</span>
            </div>
            <h1 className="h1 leading-tight text-balance font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-center">
              COMPLETE BOARD MANAGEMENT SYSTEM
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-center text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
              The all-in-one platform for management, strategic planning, and organizational excellence. Built for efficiency, powered by intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link to="/login" className="btn-system">
                Request Demo
              </Link>
            </div>
          </section>
        </FadeInSection>

        {/* Core Features */}
        <FadeInSection>
          <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:px-8">
            <div className="mb-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFC96C] sm:text-sm">CORE FEATURES</span>
            </div>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
              EVERYTHING YOU NEED
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
              <FadeInSection delay={100}>
                <Link to="/features/strategic-planning" className="block">
                  <FeatureCard
                  icon={<Target className="w-6 h-6" />}
                  title="Strategic Initiatives Tracker"
                  description="Visualize and prioritize initiatives using effort-impact matrices. Track progress, assign owners, and ensure alignment with organizational goals."
                  />
                </Link>
              </FadeInSection>
              <FadeInSection delay={200}>
                <Link to="/features/member-engagement" className="block">
                  <FeatureCard
                  icon={<Users className="w-6 h-6" />}
                  title="Member Engagement Database"
                  description="Manage comprehensive member records with engagement tracking, participation history, and professional networking capabilities."
                  />
                </Link>
              </FadeInSection>
              <FadeInSection delay={300}>
                <Link to="/features/event-management" className="block">
                  <FeatureCard
                  icon={<Calendar className="w-6 h-6" />}
                  title="Events & Calendar Management"
                  description="Plan meetings, gatherings, and events with RSVP tracking, attendance management, and automated reminders."
                  />
                </Link>
              </FadeInSection>
              <FadeInSection delay={400}>
                <Link to="/features/ai-powered-insights" className="block">
                  <FeatureCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="AI-Powered Intelligence"
                  description="Three specialized AI agents provide organizational assistance, team coordination, and analytics insights to enhance decision-making."
                  />
                </Link>
              </FadeInSection>
            </div>
          </section>
        </FadeInSection>

        {/* Enterprise Grade */}
        <FadeInSection>
          <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:px-8">
            <div className="mb-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFC96C] sm:text-sm">ENTERPRISE GRADE</span>
            </div>
            <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
              BUILT FOR SCALE
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FadeInSection delay={100}>
                <CapabilityCard
                  icon={<Shield className="w-8 h-8" />}
                  title="Enterprise Security"
                  description="SSO/SAML integration, role-based access control, and audit logs ensure your data stays secure and compliant."
                  features={['Single Sign-On', 'RBAC Permissions', 'Audit Trails', 'SOC 2 Ready']}
                />
              </FadeInSection>
              <FadeInSection delay={200}>
                <CapabilityCard
                  icon={<Zap className="w-8 h-8" />}
                  title="Automation & Workflows"
                  description="Automated email notifications, task assignments, and progress tracking keep your team aligned and informed."
                  features={['Email Alerts', 'Task Automation', 'Progress Tracking', 'Smart Reminders']}
                />
              </FadeInSection>
              <FadeInSection delay={300}>
                <CapabilityCard
                  icon={<Database className="w-8 h-8" />}
                  title="Data Management"
                  description="Import/export capabilities, bulk operations, and seamless migration from existing systems."
                  features={['Bulk Import', 'CSV Export', 'Data Migration', 'API Access']}
                />
              </FadeInSection>
            </div>
          </section>
        </FadeInSection>

        {/* CTA */}
        <FadeInSection>
          <section className="mx-auto w-full max-w-screen-xl px-4 py-16 md:px-8">
            <div className="panel-system mx-auto flex max-w-4xl flex-col gap-6 p-8 text-center sm:p-12">
              <h2 className="h2 leading-tight text-balance font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                READY TO TRANSFORM YOUR ORGANIZATION?
              </h2>
              <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
                Join organizations that have modernized their operations. Schedule a demo today.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Link to="/login" className="btn-system">
                  Get Started
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ROI Calculator */}
        <FadeInSection>
          <ROICalculator />
        </FadeInSection>

        {/* Scroll Gears Animation */}
        <FadeInSection>
          <section className="w-full max-w-screen overflow-x-hidden border-b border-[#202020] py-24">
            <ScrollGears color="#FFC96C" />
          </section>
        </FadeInSection>

        {/* Feature Comparison */}
        <FadeInSection>
          <FeatureComparison />
        </FadeInSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-8 pb-safe">
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 Syntek Automations. All rights reserved.</p>
            <p>Empowering organizations worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="panel-system flex min-w-0 flex-col gap-4 p-6">
      <div className="text-[#FFC96C]">{icon}</div>
      <h3 className="h3 text-[#F2F2F2] uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-[#B3B3B3] leading-relaxed text-pretty">{description}</p>
    </div>
  );
}

function CapabilityCard({ icon, title, description, features }) {
  return (
    <div className="panel-system flex min-w-0 flex-col gap-4 p-6">
      <div className="text-[#FFC96C]">{icon}</div>
      <h3 className="h3 text-[#F2F2F2] uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-[#B3B3B3] text-pretty">{description}</p>
      <ul className="space-y-2 text-pretty">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-[#B3B3B3]">
            <CheckCircle className="h-4 w-4 text-[#FFC96C]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

