import { TIERS, type Tier } from "@/data/featureMatrix";

export function TierToggle({ active, onChange }:{ active:Tier; onChange:(t:Tier)=>void }) {
  return (
    <div className="tier-toggle win98" role="tablist" aria-label="Plan selector">
      {TIERS.map((t, idx) => {
        const pressed = active === t;
        return (
          <button
            key={t}
            role="tab"
            aria-selected={pressed}
            aria-controls={`matrix-${t.toLowerCase()}`}
            className={`w98-btn ${pressed ? "is-active" : ""} ${idx===0?"is-first":""} ${idx===TIERS.length-1?"is-last":""}`}
            onClick={() => onChange(t)}
          >
            <span className="w98-label">{t}</span>
          </button>
        );
      })}
    </div>
  );
}
export default TierToggle;
