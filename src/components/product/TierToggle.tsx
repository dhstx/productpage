import { TIERS, type Tier } from "@/data/featureMatrix";
import { motion, useReducedMotion } from "framer-motion";

export function TierToggle({ active, onChange }:{ active:Tier; onChange:(t:Tier)=>void }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="tier-toggle sticky top-16 z-10">
      {TIERS.map(t => (
        <button key={t}
          className={`tier-chip ${active===t ? "active" : ""}`}
          onClick={()=>onChange(t)}
          aria-pressed={active===t}
          aria-label={`Select ${t} tier`}>
          <span>{t}</span>
          {active===t && (
            <motion.span
              layoutId="tier-underline"
              className="tier-underline"
              transition={{ duration: prefersReduced ? 0.15 : 0.3 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
export default TierToggle;
