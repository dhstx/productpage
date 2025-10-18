import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURES, type Tier } from "@/data/featureMatrix";
import { TierToggle } from "./TierToggle";
import { FeatureCard } from "./FeatureCard";

export default function FeatureMatrix(){
  const [active, setActive] = useState<Tier>("Pro");
  const prefersReduced = useReducedMotion();
  const bySection = useMemo(() => {
    const g: Record<string, typeof FEATURES> = { Core:[], Advanced:[], Security:[], Support:[] };
    FEATURES.forEach(f => g[f.section].push(f));
    return g;
  }, []);

  return (
    <section id="pricing" className="feature-matrix">
      <TierToggle active={active} onChange={setActive}/>

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
