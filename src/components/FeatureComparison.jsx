import React from 'react';
import { Check, X } from 'lucide-react';

export default function FeatureComparison() {
  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Strategic Planning & Tracking", starter: true, professional: true, enterprise: true },
        { name: "Member Database", starter: true, professional: true, enterprise: true },
        { name: "Event Management & Calendar", starter: true, professional: true, enterprise: true },
        { name: "Document Storage", starter: "5 GB", professional: "50 GB", enterprise: "Unlimited" },
        { name: "User Seats", starter: "25", professional: "50", enterprise: "Unlimited" },
      ]
    },
    {
      category: "Advanced Features",
      items: [
        { name: "AI-Powered Insights", starter: false, professional: true, enterprise: true },
        { name: "Custom Branding", starter: false, professional: true, enterprise: true },
        { name: "Advanced Analytics & Reports", starter: false, professional: true, enterprise: true },
        { name: "API Access", starter: false, professional: false, enterprise: true },
        { name: "White-Label Solution", starter: false, professional: false, enterprise: true },
        { name: "Custom Integrations", starter: false, professional: false, enterprise: true },
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        { name: "256-bit Encryption", starter: true, professional: true, enterprise: true },
        { name: "SSO/SAML Integration", starter: false, professional: true, enterprise: true },
        { name: "Role-Based Access Control", starter: "Basic", professional: "Advanced", enterprise: "Enterprise" },
        { name: "Audit Logs", starter: false, professional: true, enterprise: true },
        { name: "Custom Security Policies", starter: false, professional: false, enterprise: true },
      ]
    },
    {
      category: "Support",
      items: [
        { name: "Email Support", starter: true, professional: true, enterprise: true },
        { name: "Priority Support", starter: false, professional: true, enterprise: true },
        { name: "Phone Support", starter: false, professional: false, enterprise: true },
        { name: "Dedicated Account Manager", starter: false, professional: false, enterprise: true },
        { name: "Custom Training", starter: false, professional: false, enterprise: true },
      ]
    }
  ];

  const renderValue = (value) => {
    if (value === true) {
      return (
        <Check
          className="w-5 h-5 mx-auto"
          style={{ color: 'var(--accent-gold)' }}
          aria-label="Included"
        />
      );
    } else if (value === false) {
      return (
        <X
          className="w-5 h-5 mx-auto"
          style={{ color: 'var(--muted)' }}
          aria-label="Not included"
        />
      );
    } else {
      return (
        <span className="text-xs sm:text-sm text-center block" style={{ color: 'var(--text)' }}>
          {value}
        </span>
      );
    }
  };

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 border-t border-token"
      style={{
        background: 'var(--pricing-bg-dark, var(--pricing-bg-light))',
        color: 'var(--text)'
      }}
    >
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="h2 leading-tight text-balance mb-3">FEATURE COMPARISON</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-fg">
            Choose the plan that fits your organization's needs
          </p>
        </div>

        {/* Plan cards: equal widths/heights, system buttons, Pro badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 items-stretch">
          <PlanCard name="STARTER" price="$999" highlight={false} />
          <PlanCard name="PROFESSIONAL" price="$2,499" highlight>
            <div
              className="inline-block px-2 py-1 rounded mb-2 text-[10px] font-bold"
              style={{ background: 'var(--accent-gold)', color: 'var(--bg)' }}
            >
              MOST POPULAR
            </div>
          </PlanCard>
          <PlanCard name="ENTERPRISE" price="$5,999" highlight={false} />
        </div>

        {/* Mobile layout: stacked feature items with sublabels */}
        <div className="md:hidden space-y-6">
          {features.map((category, idx) => (
            <div key={idx} className="space-y-4">
              <h3
                className="font-bold uppercase tracking-tight text-xs sm:text-sm px-2"
                style={{ color: 'var(--accent-gold)' }}
              >
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, jdx) => (
                  <div key={jdx} className="panel-system p-4 sm:p-5 min-w-0">
                    <div className="flex flex-col gap-3">
                      <div className="text-sm sm:text-base font-medium break-words" style={{ color: 'var(--text)' }}>
                        {item.name}
                      </div>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center">
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center">
                          <div className="text-[10px] sm:text-xs text-muted-fg uppercase tracking-wide">Starter</div>
                          <div className="flex items-center justify-center min-h-[24px]">{renderValue(item.starter)}</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center rounded px-2 py-1">
                          <div
                            className="text-[10px] sm:text-xs uppercase tracking-wide font-medium"
                            style={{ color: 'var(--accent-gold)' }}
                          >
                            Pro
                          </div>
                          <div className="flex items-center justify-center min-h-[24px]">{renderValue(item.professional)}</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center">
                          <div className="text-[10px] sm:text-xs text-muted-fg uppercase tracking-wide">Enterprise</div>
                          <div className="flex items-center justify-center min-h-[24px]">{renderValue(item.enterprise)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop+ layout: 3 equal plan columns with sticky headers */}
        <div className="hidden md:block">
          <div className="panel-system overflow-hidden">
            <div
              className="grid items-stretch"
              style={{ gridTemplateColumns: 'minmax(220px,1.2fr) repeat(3, minmax(0, 1fr))' }}
            >
              {/* Sticky header row */}
              <div className="px-4 py-3 font-bold uppercase tracking-wide text-sm" style={{ background: 'transparent', color: 'var(--muted)' }}>
                Feature
              </div>
              {['Starter', 'Pro', 'Enterprise'].map((label) => (
                <div
                  key={label}
                  className="px-4 py-3 text-center font-semibold uppercase tracking-wide text-sm sticky top-0 z-10 border-l border-token"
                  style={{ background: 'var(--pricing-bg-dark, var(--pricing-bg-light))', color: label === 'Pro' ? 'var(--accent-gold)' : 'var(--muted)' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {features.map((category, idx) => (
              <div key={idx} className="border-t border-token">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--accent-gold)' }}>
                  {category.category}
                </div>
                {category.items.map((item, jdx) => (
                  <div
                    key={jdx}
                    className="grid items-center border-t border-token"
                    style={{ gridTemplateColumns: 'minmax(220px,1.2fr) repeat(3, minmax(0, 1fr))' }}
                  >
                    <div className="px-4 py-4 text-sm" style={{ color: 'var(--text)' }}>
                      {item.name}
                    </div>
                    <div className="px-4 py-4 text-center">{renderValue(item.starter)}</div>
                    <div className="px-4 py-4 text-center">{renderValue(item.professional)}</div>
                    <div className="px-4 py-4 text-center">{renderValue(item.enterprise)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CTA - single Get Started button */}
        <div className="mt-8 md:mt-12 text-center">
          <a href="/login" className="btn-system w-full sm:w-auto min-h-[44px]">Get Started</a>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ name, price, highlight, children }) {
  return (
    <div
      className="panel-system p-5 sm:p-6 flex flex-col items-center text-center justify-between min-h-[220px] h-full"
      style={highlight ? { boxShadow: '0 0 0 1px var(--accent-gold)' } : undefined}
    >
      {children}
      <div className="font-bold text-sm sm:text-base mb-1" style={{ color: 'var(--text)' }}>{name}</div>
      <div className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>{price}</div>
      <div className="text-xs sm:text-sm mb-4" style={{ color: 'var(--muted)' }}>/month</div>
      <a href="/login" className="btn-system w-full min-h-[44px]">Select</a>
    </div>
  );
}

