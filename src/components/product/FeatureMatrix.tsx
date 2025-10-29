import React from "react";
import PricingPlans from "@/components/pricing/PricingPlans";

export default function FeatureMatrix(): JSX.Element {
  return (
    <section id="pricing" className="py-16 md:py-24 border-t" role="region" aria-label="Pricing">
      <div className="container mx-auto px-4 md:px-8">
        <PricingPlans />
        {/* Comparison grid removed intentionally to streamline product page */}
      </div>
    </section>
  );
}
