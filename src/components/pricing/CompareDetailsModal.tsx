import React from "react";
import { Check, X } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FEATURES, TIERS, type FeatureRow, type Tier } from "../../data/featureMatrix";

function renderValue(value: FeatureRow["available"][Tier], note?: string) {
  if (value === true) {
    return <Check className="w-4 h-4 text-[color:var(--accent-gold)]" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-[color:var(--muted)]" />;
  }
  return <span className="text-xs text-[color:var(--text)]">{note || ""}</span>;
}

export default function CompareDetailsModal(): JSX.Element {
  const hasMatrix = Array.isArray(FEATURES) && FEATURES.length > 0 && Array.isArray(TIERS) && TIERS.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="min-h-[44px] px-4 py-2 rounded-md font-medium bg-[color:var(--accent-gold)] text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-gold)]/60">
          Compare Details
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[color:var(--bg)] border-[color:var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--text)]">Full feature comparison</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          {hasMatrix ? (
            <table className="w-full text-sm" role="table" aria-label="Feature comparison matrix">
              <thead>
                <tr className="text-left text-[color:var(--muted)]">
                  <th className="py-2 px-2">Feature</th>
                  {TIERS.map((tier) => (
                    <th key={tier} className="py-2 px-2">{tier}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f) => (
                  <tr key={f.id} className="border-t border-[color:var(--border)]">
                    <td className="py-2 px-2 text-[color:var(--text)]">{f.name}</td>
                    {TIERS.map((tier) => (
                      <td key={tier} className="py-2 px-2">
                        {renderValue(f.available[tier as Tier], f.notes?.[tier as Tier])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-[color:var(--text)] text-sm">Full comparison is currently unavailable. Please see plan details above.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
