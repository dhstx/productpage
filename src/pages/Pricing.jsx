import { useMemo } from 'react';
import { usePageMeta } from '../lib/seo';
import { getAllPricingTiers } from '../lib/pricing';

export default function Pricing() {
  usePageMeta(
    'Pricing – DHStx',
    'Transparent pricing for DHStx platform plans: Free, Starter, Professional, and Enterprise.'
  );

  const tiers = useMemo(() => getAllPricingTiers(), []);

  return (
    <main className="min-h-screen w-full max-w-screen overflow-x-hidden bg-[#0C0C0C] px-4 py-12 md:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="h1 font-bold uppercase tracking-tight text-[#F2F2F2]">PRICING</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3]">
            Choose the plan that fits your organization. Upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div key={tier.id} className={`panel-system p-6 ${tier.highlighted ? 'border-2 border-[#FFC96C]' : ''}`}>
              {tier.highlighted && (
                <div className="mb-4 -mt-2 -mx-2">
                  <span className="inline-block rounded-[2px] bg-[#FFC96C] px-3 py-1 text-xs font-bold uppercase text-[#0C0C0C]">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#F2F2F2]">{tier.name}</h2>
              <p className="mb-4 text-sm text-[#B3B3B3]">{tier.description}</p>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#F2F2F2]">${tier.price}</span>
                  <span className="text-[#B3B3B3]">/{tier.billingPeriod}</span>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                {tier.featureList.slice(0, 6).map((f, idx) => (
                  <li key={idx} className="text-sm text-[#B3B3B3]">• {f}</li>
                ))}
              </ul>
              <a href="/contact" className="btn-system w-full text-center">Talk to Sales</a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
