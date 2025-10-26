import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURES, type Tier } from "@/data/featureMatrix";
import { TierToggle } from "./TierToggle";
import { FeatureCard } from "./FeatureCard";

export default function FeatureMatrix(){
  const [active, setActive] = useState<Tier>("Pro");
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const bySection = useMemo(() => {
    const g: Record<string, typeof FEATURES> = { Core:[], Advanced:[], Security:[], Support:[] };
    FEATURES.forEach(f => g[f.section].push(f));
    return g;
  }, []);

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="pricing" className="feature-matrix" role="region" aria-label="Pricing plans">
      {/* Price Plans */}
      <section className="price-plans" aria-label="Price Plans">
        <div className="centered">
          <h2 className="h2 section-title center" style={{ marginBottom: '0.5rem' }}>Price Plans</h2>
        </div>
        <div className="plans-quick-buttons center" aria-label="Quick plan selector">
          <TierToggle active={active} onChange={setActive} />
        </div>

        {/* Centered grid layout for desktop; stacked on mobile */}
        <div className="pricing-container">
          <div className="plan-grid" role="list" aria-label="Pricing plans list">
            {PLANS.map(plan => (
              <article key={plan.id} className="plan-card" role="listitem" aria-labelledby={`plan-${plan.id}`}>
                <h3 id={`plan-${plan.id}`} className="plan-title">{plan.name}</h3>
                <div className="plan-price">{plan.priceLabel} {plan.interval}</div>
                <ul className="plan-features">
                  {plan.features.slice(0,5).map((f, idx) => (<li key={idx}>{f}</li>))}
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
                  <button
                    className="more"
                    aria-expanded={!!expanded[plan.id]}
                    onClick={() => toggleExpanded(plan.id)}
                  >
                    Learn more
                  </button>
                </div>
                {expanded[plan.id] && (
                  <div className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                    <ul className="list-disc pl-5 space-y-1">
                      {plan.features.map((f, idx) => (<li key={idx}>{f}</li>))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {(["Core","Advanced","Security","Support"] as const).map(section => (
        <section key={section} className="matrix-section">
          <header className="section-head">
            <motion.h2
              initial={{opacity:0,y:8}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{ duration: prefersReduced ? 0.15 : 0.3 }}
            >
              {section === "Security" ? "Security & Compliance" : section + " Features"}
            </motion.h2>
            <div className="section-glow" aria-hidden />
          </header>

          <motion.div layout className="cards-grid" transition={{ duration: prefersReduced ? 0.15 : 0.3 }}>
            {bySection[section].map(f => (
              <FeatureCard key={f.id} feature={f} active={active}/>
            ))}
          </motion.div>
        </section>
      ))}
    </section>
  );
}

// Source of truth for plans; reuse existing pricing values and wiring
// Import lazily in handlers to avoid TS/JS interop issues; use data here for UI only
const PLANS: Array<{ id:string; name:string; priceLabel:string; interval:string; features:string[] }>= [
  { id:"starter", name:"Starter", priceLabel:"$19", interval:"/month", features:[
    "Up to 25 users","5,000 records","Core platform access","Basic analytics","Email support"
  ]},
  { id:"professional", name:"Pro", priceLabel:"$49", interval:"/month", features:[
    "Up to 50 users","15,000 records","Custom branding","Advanced analytics","Priority support"
  ]},
  { id:"enterprise", name:"Enterprise", priceLabel:"$199", interval:"/month", features:[
    "Unlimited users","Unlimited records","White-label solution","Custom integrations","24/7 support"
  ]},
];
