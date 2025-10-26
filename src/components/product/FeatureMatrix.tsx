import { useState, useMemo } from "react";
import { FEATURES, PLANS, type Tier } from "@/data/featureMatrix";
import { TierToggle } from "./TierToggle";
import { FeatureCard } from "./FeatureCard";

export default function FeatureMatrix() {
  const [active, setActive] = useState<Tier>("Pro");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const bySection = useMemo(() => {
    const g: Record<string, typeof FEATURES> = { Core: [], Advanced: [], Security: [], Support: [] };
    FEATURES.forEach((f) => g[f.section].push(f));
    return g;
  }, []);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="pricing" className="feature-matrix" role="region" aria-label="Pricing plans">
      {/* Price Plans */}
      <section className="price-plans" aria-label="Price Plans">
        <div className="centered">
          <h2 className="h2 section-title center" style={{ marginBottom: "0.5rem" }}>
            Price Plans
          </h2>
        </div>

        <div className="plans-quick-buttons center" aria-label="Quick plan selector">
          <TierToggle active={active} onChange={setActive} />
        </div>

        {/* Centered grid layout for desktop; stacked on mobile */}
        <div className="pricing-container">
          <div className="plan-grid" role="list" aria-label="Pricing plans list">
            {PLANS.map((plan) => (
              <article key={plan.id} className="plan-card" role="listitem" aria-labelledby={`plan-${plan.id}`}> 
                <h3 id={`plan-${plan.id}`} className="plan-title"> 
                  {plan.name} 
                </h3> 

                <div className="plan-price"> 
                  {plan.priceLabel} {plan.interval} 
                </div> 

                <ul className="plan-features"> 
                  {plan.features.slice(0, 5).map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))} 
                </ul> 

                <div className="cta-row"> 
                  <button 
                    className="plan-cta" 
                    onClick={async () => { 
                      try { 
                        const mod = await import("@/lib/stripe.js"); 
                        await mod.initializeStripeCheckout(plan.id); 
                      } catch { 
                        window.location.href = "/login"; 
                      } 
                    }} 
                  > 
                    Choose {plan.name} 
                  </button> 

                  <button className="more" aria-expanded={!!expanded[plan.id]} onClick={() => toggleExpanded(plan.id)}> 
                    Learn more 
                  </button> 
                </div> 

                {expanded[plan.id] && ( 
                  <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}> 
                    <ul className="list-disc pl-5 space-y-1">{plan.features.map((f, idx) => <li key={idx}>{f}</li>)}</ul> 
                  </div> 
                )} 
              </article> 
            ))} 
          </div> 
        </div> 
      </section> 

      {/* Feature sections (preserve previous feature matrix content) */}
      {Object.entries(bySection).map(([section, items]) => (
        <section key={section} className="feature-section" aria-labelledby={`section-${section}`}> 
          <h3 id={`section-${section}`} className="section-subtitle"> 
            {section} 
          </h3> 
          <div className="feature-list"> 
            {items.map((f) => ( 
              <FeatureCard key={f.id} feature={f} expanded={!!expanded[f.id]} onToggle={() => toggleExpanded(f.id)} />  
            ))} 
          </div> 
        </section> 
      ))} 
    </section> 
  );
}