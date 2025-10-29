import React from 'react';
import { Check, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FEATURES, TIERS } from '@/data/featureMatrix';

function renderValue(value, note) {
  if (value === true) {
    return <Check className="w-4 h-4 text-[color:var(--accent-gold)]" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-[color:var(--muted)]" />;
  }
  return <span className="text-xs text-[color:var(--text)]">{note || ''}</span>;
}

export default function CompareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-system min-h-[44px]">Compare details</button>
      </DialogTrigger>
      <DialogContent className="bg-[color:var(--bg)] border-[color:var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--text)]">Full feature comparison</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                      {renderValue(f.available[tier], f.notes?.[tier])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
