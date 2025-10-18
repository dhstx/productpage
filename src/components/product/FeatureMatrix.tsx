import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURES, Tier } from "@/data/featureMatrix";
import { TierToggle } from "./TierToggle";
import { FeatureCard } from "./FeatureCard";

export default function FeatureMatrix(){
  const [active, setActive] = useState<Tier>("Pro");
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0.175 : 0.35;

  const bySection = useMemo(() => {
    const grouped: Record<"Core" | "Advanced" | "Security" | "Support", typeof FEATURES> = {
      Core: [], Advanced: [], Security: [], Support: []
    };
    FEATURES.forEach(f => grouped[f.section].push(f));
    return grouped;
  }, []);

  return (
    <section id="features" className="feature-matrix">
      <TierToggle active={active} onChange={setActive}/>

      {(["Core","Advanced","Security","Support"] as const).map(section => (
        <section key={section} className="matrix-section">
          <header className="section-head">
            <motion.h2 initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{ duration }}>
              {section === "Security" ? "Security & Compliance" : section + " Features"}
            </motion.h2>
            <div className="section-glow" aria-hidden="true" />
          </header>

          <motion.div layout className="cards-grid" transition={{ duration }}>
            {bySection[section].map(f => (
              <FeatureCard key={f.id} feature={f} active={active}/>
            ))}
          </motion.div>
        </section>
      ))}
    </section>
  );
}
