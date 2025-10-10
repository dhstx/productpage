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
      return <span className="text-[#F2F2F2] text-sm">{value}</span>;
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#0C0C0C] border-t border-[#202020]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            FEATURE COMPARISON
          </h2>
          <p className="text-[#B3B3B3] text-lg">
            Choose the plan that fits your organization's needs
          </p>
        </div>

        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-[#202020]">
                <th className="text-left p-4 text-[#F2F2F2] font-medium uppercase tracking-tight">
                  Features
                </th>
                <th className="text-center p-4 min-w-[150px]">
                  <div className="text-[#F2F2F2] font-bold mb-1">STARTER</div>
                  <div className="text-[#FFC96C] text-2xl font-bold">$999</div>
                  <div className="text-[#B3B3B3] text-sm">/month</div>
                </th>
                <th className="text-center p-4 min-w-[150px] bg-[#0C0C0C]">
                  <div className="inline-block px-3 py-1 bg-[#FFC96C] text-[#0C0C0C] text-xs font-bold rounded mb-2">
                    MOST POPULAR
                  </div>
                  <div className="text-[#F2F2F2] font-bold mb-1">PROFESSIONAL</div>
                  <div className="text-[#FFC96C] text-2xl font-bold">$2,499</div>
                  <div className="text-[#B3B3B3] text-sm">/month</div>
                </th>
                <th className="text-center p-4 min-w-[150px]">
                  <div className="text-[#F2F2F2] font-bold mb-1">ENTERPRISE</div>
                  <div className="text-[#FFC96C] text-2xl font-bold">$5,999</div>
                  <div className="text-[#B3B3B3] text-sm">/month</div>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr className="border-t border-[#202020]">
                    <td colSpan="4" className="p-4 bg-[#0C0C0C]">
                      <h3 className="text-[#FFC96C] font-bold uppercase tracking-tight text-sm">
                        {category.category}
                      </h3>
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr
                      key={itemIndex}
                      className="border-t border-[#202020] hover:bg-[#0C0C0C] transition-colors"
                    >
                      <td className="p-4 text-[#F2F2F2]">{item.name}</td>
                      <td className="p-4 text-center">{renderValue(item.starter)}</td>
                      <td className="p-4 text-center bg-[#0C0C0C]">{renderValue(item.professional)}</td>
                      <td className="p-4 text-center">{renderValue(item.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA - Only Get Started button */}
        <div className="mt-10 text-center">
          <a href="/login" className="btn-system">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

