import { TIERS, Tier } from "@/data/featureMatrix";
import { motion, useReducedMotion } from "framer-motion";

export function TierToggle({ active, onChange }:{ active:Tier; onChange:(t:Tier)=>void }) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0.15 : 0.3;

  return (
    <div className="tier-toggle sticky top-16 z-10">
      {TIERS.map(t => (
        <button key={t}
          className={`tier-chip ${active===t ? "active" : ""}`}
          onClick={()=>onChange(t)}
          aria-pressed={active===t}>
          <span>{t}</span>
          {active===t && (
            <motion.span layoutId="tier-underline" className="tier-underline" transition={{ duration }} />
          )}
        </button>
      ))}
    </div>
  );
}
