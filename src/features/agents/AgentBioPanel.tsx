import React from 'react';
import type { AgentProfile } from './agents.data';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAgentFocus } from './agentFocusStore';

export type AgentBioPanelProps = {
  agent: AgentProfile | null;
  onClose: () => void;
};

export function AgentBioPanel({ agent, onClose }: AgentBioPanelProps) {
  const open = !!agent;
  const { state, set, toggle } = useAgentFocus(agent?.key ?? '', agent?.focuses ?? []);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="w-full max-w-4xl"
        style={{ background: 'var(--panel)', color: 'var(--text)', borderColor: 'var(--border)' }}
      >
        {agent && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-wide" style={{ color: 'var(--text)' }}>{agent.name}</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{agent.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: VERBATIM BIO */}
              <div className="whitespace-pre-wrap overflow-y-auto pr-3" style={{ maxHeight: '60vh' }}>
                {agent.bio}
              </div>

              {/* Right: Focus toggles */}
              <div className="flex flex-col gap-4">
                {agent.focuses.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-4 rounded-md border p-3"
                       style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{f.label}</div>
                      {f.description && (
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>{f.description}</div>
                      )}
                    </div>
                    {/* Toggle: ON = gold track & border */}
                    <Toggle
                      checked={!!state[f.id]}
                      onChange={() => toggle(f.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex h-5 w-9 items-center rounded-full border transition-colors"
      style={{
        background: checked ? 'var(--accent-gold)' : 'transparent',
        borderColor: checked ? 'var(--accent-gold)' : 'var(--border)',
      }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full transition-transform"
        style={{
          background: 'var(--text)',
          translate: checked ? 'calc(100% - 2px)' : '0px',
        }}
      />
    </button>
  );
}

export default AgentBioPanel;
