import React from "react";
import PricingPlans from "@/components/pricing/PricingPlans";
import CompareDetailsModal from "../pricing/CompareDetailsModal";

export default function FeatureMatrix(): JSX.Element {
  return (
    <section id="pricing" className="py-16 md:py-24 border-t" role="region" aria-label="Pricing">
      <div className="container mx-auto px-4 md:px-8">
        <PricingPlans />
        <div className="mt-8 text-center">
          <CompareDetailsModal />
        </div>
      </div>
    </section>
  );
}
