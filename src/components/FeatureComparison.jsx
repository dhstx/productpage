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
      return <Check className="w-5 h-5 text-[#FFC96C] mx-auto" />;
    } else if (value === false) {
      return <X className="w-5 h-5 text-[#666666] mx-auto" />;
    } else {
      return <span className="text-[#F2F2F2] text-xs sm:text-sm text-center block">{value}</span>;
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#0C0C0C] border-t border-[#202020]">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="h2 leading-tight text-balance text-[#F2F2F2] mb-3 uppercase tracking-tight">
            FEATURE COMPARISON
          </h2>
          <p className="text-[#B3B3B3] text-sm sm:text-base md:text-lg">
            Choose the plan that fits your organization's needs
          </p>
        </div>

        {/* Mobile-first stacked pricing cards with consistent spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <PlanCard name="STARTER" price="$999" highlight={false} />
          <PlanCard name="PROFESSIONAL" price="$2,499" highlight>
            <div className="inline-block px-2 py-1 bg-[#FFC96C] text-[#0C0C0C] text-[10px] font-bold rounded mb-2">
              MOST POPULAR
            </div>
          </PlanCard>
          <PlanCard name="ENTERPRISE" price="$5,999" highlight={false} />
        </div>

        {/* Improved feature comparison table for mobile */}
        <div className="space-y-6 md:space-y-8">
          {features.map((category, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-[#FFC96C] font-bold uppercase tracking-tight text-xs sm:text-sm px-2">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, jdx) => (
                  <div key={jdx} className="panel-system p-4 sm:p-5 min-w-0">
                    <div className="flex flex-col gap-3">
                      {/* Feature name */}
                      <div className="text-[#F2F2F2] text-sm sm:text-base font-medium break-words">
                        {item.name}
                      </div>
                      {/* Plan values in aligned grid */}
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center">
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center">
                          <div className="text-[10px] sm:text-xs text-[#B3B3B3] uppercase tracking-wide">Starter</div>
                          <div className="flex items-center justify-center min-h-[24px]">
                            {renderValue(item.starter)}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center bg-[#0C0C0C] rounded px-2 py-1">
                          <div className="text-[10px] sm:text-xs text-[#FFC96C] uppercase tracking-wide font-medium">Pro</div>
                          <div className="flex items-center justify-center min-h-[24px]">
                            {renderValue(item.professional)}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center">
                          <div className="text-[10px] sm:text-xs text-[#B3B3B3] uppercase tracking-wide">Enterprise</div>
                          <div className="flex items-center justify-center min-h-[24px]">
                            {renderValue(item.enterprise)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA - Only Get Started button with proper spacing */}
        <div className="mt-8 md:mt-12 text-center">
          <a href="/login" className="btn-system w-full sm:w-auto min-h-[44px]">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ name, price, highlight, children }) {
  return (
    <div className={`panel-system p-5 sm:p-6 flex flex-col items-center text-center min-h-[180px] justify-center ${highlight ? 'ring-1 ring-[#FFC96C]/40' : ''}`}>
      {children}
      <div className="text-[#F2F2F2] font-bold text-sm sm:text-base mb-1">{name}</div>
      <div className="text-[#FFC96C] text-xl sm:text-2xl font-bold">{price}</div>
      <div className="text-[#B3B3B3] text-xs sm:text-sm mb-4">/month</div>
      <a href="/login" className="btn-system w-full min-h-[44px]">Select</a>
    </div>
  );
}

