import React from 'react';
import PricingPlans from '@/components/pricing/PricingPlans';
import CapabilityGrid from '@/components/pricing/CapabilityGrid';

export default function FeatureComparison() {
  return (
    <section id="pricing" className="py-16 md:py-24 border-t" role="region" aria-label="Pricing">
      <div className="container mx-auto px-4 md:px-8">
        <PricingPlans />
        <CapabilityGrid />
      </div>
    </section>
  );
}

