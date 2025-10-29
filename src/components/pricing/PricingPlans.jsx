import React from 'react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    priceLabel: '$19',
    interval: '/month',
    bullets: [
      'Up to 25 users',
      '5,000 records',
      'Core platform access',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$49',
    interval: '/month',
    bullets: [
      'Up to 50 users',
      '15,000 records',
      'Custom branding',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceLabel: '$199',
    interval: '/month',
    bullets: [
      'Unlimited users',
      'Unlimited records',
      'White-label solution',
      'Custom integrations',
      '24/7 support',
    ],
  },
];

function PlanCard({ plan, highlight }) {
  return (
    <div
      className={`panel-system border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)] p-6 flex flex-col items-center text-center h-full ${
        highlight ? 'ring-1 ring-[color:var(--accent-gold)]/50' : ''
      }`}
    >
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="text-sm font-semibold tracking-wide uppercase text-[color:var(--muted)]">
          {plan.name}
        </div>
        <div className="mt-2 text-2xl font-bold">
          <span className={highlight ? 'text-[color:var(--accent-gold)]' : ''}>{plan.priceLabel}</span>
          <span className="ml-1 text-[color:var(--muted)] text-sm">{plan.interval}</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
          {plan.bullets.slice(0, 6).map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>

      <a href="/login" className="btn-system w-full mt-6 min-h-[44px]" aria-label={`Get Started with ${plan.name}`}>
        Get Started
      </a>
    </div>
  );
}

export default function PricingPlans() {
  return (
    <div className="w-full">
      {/* Mobile horizontal rail */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto [scroll-snap-type:x_mandatory] flex gap-4 pb-2">
        {PLANS.map((p) => (
          <div key={p.id} className="snap-center flex-shrink-0 min-w-[320px]">
            <PlanCard plan={p} highlight={p.id === 'pro'} />
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} highlight={p.id === 'pro'} />
        ))}
      </div>
    </div>
  );
}
