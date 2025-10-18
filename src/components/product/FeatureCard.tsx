import { motion, useReducedMotion } from "framer-motion";
import { Tier, FeatureRow, TIERS } from "@/data/featureMatrix";

export function FeatureCard({ feature, active }:{ feature:FeatureRow; active:Tier }) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0.175 : 0.35;

  return (
    <motion.div
      className={`feature-card ${feature.section.toLowerCase()}`}
      initial={{opacity:0, y:12}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true}}
      transition={{duration}}
    >
      <div className="feature-head">
        <div className="feature-dot" />
        <h3>{feature.name}</h3>
      </div>
      <div className="tier-strip">
        {TIERS.map(t => {
          const state = feature.available[t];
          const isActive = t===active;
          return (
            <div key={t} className={`tier-cell ${isActive?"active":""}`} aria-label={`${t}`}>
              {state === true && <span className="check" aria-hidden="true">✓</span>}
              {state === false && <span className="x" aria-hidden="true">✕</span>}
              {state === "value" && <span className="value">{feature.notes?.[t]}</span>}
              <span className="tier-label">{t}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
