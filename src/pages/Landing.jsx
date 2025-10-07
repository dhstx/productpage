import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Calendar, Sparkles } from 'lucide-react';

export default function Landing() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navItems = [
    { label: 'Platform Overview', to: '/product' },
    { label: 'Account Login', to: '/login' }
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-[#F2F2F2] text-xl font-bold tracking-tight" aria-label="DHStx home">
              DHStx
            </Link>
            <button
              type="button"
              className="md:hidden text-[#F2F2F2] p-2"
              aria-expanded={isNavOpen}
              aria-controls="primary-navigation"
              onClick={() => setIsNavOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
            <nav
              id="primary-navigation"
              aria-label="Primary"
              className={`${isNavOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row md:items-center gap-3 md:gap-4 text-sm font-medium`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="btn-system md:bg-transparent md:border-0 md:text-[#B3B3B3] md:hover:text-[#F2F2F2] md:px-0"
                  onClick={() => setIsNavOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
            SCALE YOUR DIGITAL ASSET OPERATIONS
          </h1>
          <p className="text-xl text-[#B3B3B3] mb-8 max-w-2xl">
            The centralized platform for managing purchased digital products, licenses, and subscriptions across every
            team and geography.
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
            title="Asset Portfolio Planning"
            description="Visualize product ownership, renewal cadences, and lifecycle milestones in a single portfolio view."
          />
          <ModuleCard
            icon={<Users className="w-6 h-6" />}
            title="Stakeholder Management"
            description="Maintain purchaser records with entitlements, renewal history, and relationship context for every stakeholder."
          />
          <ModuleCard
            icon={<Calendar className="w-6 h-6" />}
            title="Renewal Orchestration"
            description="Coordinate renewals, procurement workflows, and notifications so no asset expires unexpectedly."
          />
          <ModuleCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI-Powered Insights"
            description="Purpose-built AI agents forecast spend, recommend consolidation opportunities, and highlight unused seats."
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
            We empower revenue, finance, and IT teams to safeguard their digital investments with real-time visibility,
            automated governance, and actionable intelligence. Move from spreadsheet chaos to a unified source of truth
            for every asset your organization owns.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 Digital Asset Management Platform. All rights reserved.</p>
            <p>Orchestrating compliant, connected digital asset operations.</p>
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
