import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, Calendar, Sparkles, Shield, Zap, Database, CheckCircle } from 'lucide-react';
import { PRODUCTS } from '../lib/stripe';

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
          ENTERPRISE DIGITAL ASSET MANAGEMENT
        </h1>
        <p className="text-xl text-[#B3B3B3] mb-12 max-w-3xl mx-auto text-center">
          A unified command center for tracking every purchased license, subscription, and entitlement. Govern spend, automate renewals, and empower teams with accurate asset intelligence.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#pricing" className="btn-system">
            View Pricing
          </a>
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
            title="Portfolio Intelligence"
            description="Surface spend trends, renewal risks, and redundancy opportunities across all SaaS and digital assets."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Entitlement Directory"
            description="Manage purchaser and end-user records with seat allocation, access history, and compliance notes."
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6" />}
            title="Renewal Automation"
            description="Trigger procurement workflows, reminders, and approvals so renewals and true-ups happen on time."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI Spend Guidance"
            description="Proactive agents recommend optimization scenarios and forecast budget impact in seconds."
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
            description="Automated notifications, procurement tasks, and lifecycle policies keep your asset estate current."
            features={['Renewal Alerts', 'Workflow Automation', 'Lifecycle Policies', 'Smart Reminders']}
          />
          <CapabilityCard
            icon={<Database className="w-8 h-8" />}
            title="Data Management"
            description="Import/export capabilities, bulk operations, and seamless migration from existing systems."
            features={['Bulk Import', 'CSV Export', 'Data Migration', 'API Access']}
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <span className="text-[#FFC96C] text-sm uppercase tracking-wider">PRICING</span>
        </div>
        <h2 className="text-3xl font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center">
          SIMPLE, TRANSPARENT
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PRODUCTS.map((product) => (
            <PricingCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="panel-system p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            READY TO GOVERN EVERY DIGITAL ASSET?
          </h2>
          <p className="text-[#B3B3B3] mb-8 text-lg">
            Join teams eliminating shadow IT and wasted spend with a unified asset command center.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-system">
              Schedule Demo
            </Link>
            <Link to="/login" className="btn-system">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 Digital Asset Management Platform. All rights reserved.</p>
            <p>Trusted by finance, IT, and procurement teams worldwide.</p>
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

function PricingCard({ product }) {
  return (
    <div className={`panel-system p-6 relative ${product.popular ? 'border-[#FFC96C]' : ''}`}>
      {product.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC96C] text-black px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-[2px]">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-[#F2F2F2] font-bold text-xl uppercase tracking-tight mb-2">{product.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-[#F2F2F2]">{product.priceLabel}</span>
          <span className="text-[#B3B3B3]">{product.interval}</span>
        </div>
        <p className="text-[#B3B3B3] text-sm">{product.description}</p>
      </div>
      <ul className="space-y-3 mb-6">
        {product.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-[#B3B3B3]">
            <CheckCircle className="w-4 h-4 text-[#FFC96C] flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link to="/login" className="btn-system w-full text-center block">
        Get Started
      </Link>
    </div>
  );
}
