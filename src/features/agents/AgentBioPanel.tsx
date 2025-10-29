import React from 'react';
import type { AgentProfile } from './agents.data';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAgentFocus } from './agentFocusStore';

export type AgentBioPanelProps = {
  agent: AgentProfile | null;
  onClose: () => void;
};

export function AgentBioPanel({ agent, onClose }: AgentBioPanelProps) {
  const open = !!agent;
  const { state, toggle } = useAgentFocus(agent?.key ?? '', agent?.focuses ?? []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Dim overlay with slight blur, scoped to this dialog only */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />

        {/* Root overlay + container (Content used as container for focus trap) */}
        <DialogPrimitive.Content className="fixed inset-0 z-[70] m-0 p-0 border-0 outline-none">
          {/* Centering container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            {/* Panel */}
            <div
              className="agent-bio-panel relative rounded-2xl border border-[color:var(--border)] shadow-2xl bg-[color:var(--panel)] grid md:grid-cols-[1fr_300px] w-full max-w-[960px]"
              style={{ width: 'min(92vw, 960px)', background: 'var(--bg-elev)', color: 'var(--text)', borderColor: 'var(--border)' }}
              role="dialog" aria-modal="true"
            >
              {/* Close “X” button in the top-right of the panel */}
              <button
                className="absolute right-3 top-3 h-9 w-9 grid place-items-center rounded-full hover:bg-[color:var(--panel)]/70 border border-[color:var(--border)]"
                aria-label="Close agent details"
                onClick={onClose}
              >
                ×
              </button>

              {agent && (
                <>
                  {/* Left: scrollable bio */}
                  <div className="bio-pane whitespace-pre-wrap overflow-y-auto p-5 md:p-6 custom-scrollbar" style={{ maxHeight: '60vh' }}>
                    {/* Optional: keep name and title above bio for context */}
                    <div className="mb-3">
                      <h2 className="text-xl font-semibold tracking-wide" style={{ color: 'var(--text)' }}>{agent.name}</h2>
                      {agent.title && <p className="text-sm" style={{ color: 'var(--muted)' }}>{agent.title}</p>}
                    </div>
                    {agent.bio}
                  </div>

                  {/* Right: toggles */}
                  <aside className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-[color:var(--border)]">
                    <div className="flex flex-col gap-4">
                      {agent.focuses.map((f) => (
                        <div key={f.id} className="flex items-center justify-between gap-4 rounded-md border p-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                          <div>
                            <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{f.label}</div>
                            {f.description && (
                              <div className="text-xs" style={{ color: 'var(--muted)' }}>{f.description}</div>
                            )}
                          </div>
                          <Toggle checked={!!state[f.id]} onChange={() => toggle(f.id)} />
                        </div>
                      ))}
                    </div>
                  </aside>
                </>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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
