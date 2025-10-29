import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { FEATURES } from '@/data/featureMatrix';
import CompareDialog from './CompareDialog';

function ValueCell({ label, value, note, highlight }) {
  return (
    <div className={`flex flex-col items-center gap-1 min-h-[44px] justify-center ${highlight ? 'ring-1 ring-[color:var(--accent-gold)]/30 rounded px-2 py-1' : ''}`}>
      <div className={`text-[10px] uppercase tracking-wide ${highlight ? 'text-[color:var(--accent-gold)] font-medium' : 'text-[color:var(--muted)]'}`}>{label}</div>
      <div className="flex items-center justify-center min-h-[24px]">
        {value === true ? (
          <Check className="w-4 h-4 text-[color:var(--accent-gold)]" />
        ) : value === false ? (
          <X className="w-4 h-4 text-[color:var(--muted)]" />
        ) : (
          <span className="text-[color:var(--text)] text-xs">{note}</span>
        )}
      </div>
    </div>
  );
}

export default function CapabilityGrid() {
  const grouped = useMemo(() => {
    const g = { Core: [], Advanced: [], Security: [], Support: [] };
    FEATURES.forEach((f) => g[f.section].push(f));
    return g;
  }, []);

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {(['Core', 'Advanced', 'Security', 'Support']).map((section) => (
          <div key={section} className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[color:var(--muted)]">
              {section === 'Security' ? 'Security & Compliance' : section}
            </h3>
            {grouped[section].map((f) => (
              <div key={f.id} className="panel-system bg-[color:var(--panel)] border border-[color:var(--border)] p-4">
                <div className="text-[color:var(--text)] text-sm font-medium mb-3">{f.name}</div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <ValueCell label="Starter" value={f.available.Starter} note={f.notes?.Starter} />
                  <ValueCell label="Pro" value={f.available.Pro} note={f.notes?.Pro} highlight />
                  <ValueCell label="Enterprise" value={f.available.Enterprise} note={f.notes?.Enterprise} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <CompareDialog />
      </div>
    </div>
  );
}
