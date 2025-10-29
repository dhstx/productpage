import React from 'react';
import type { AgentProfile } from './agents.data';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAgentFocus } from './agentFocusStore';
import { getAgentColorForContext } from '@/components/ui/agentThemes';
import * as Icons from '@/components/ui/agentIcons';
import { useAgentEnabled } from './agentEnabledStore';
import '@/styles/agents-tab.css';

export type AgentBioPanelProps = {
  agent: AgentProfile | null;
  onClose: () => void;
};

export function AgentBioPanel({ agent, onClose }: AgentBioPanelProps) {
  const open = !!agent;
  const { state, toggle } = useAgentFocus(agent?.key ?? '', agent?.focuses ?? []);
  const formattedBio = agent ? formatBio(agent.bio ?? '') : '';
  const toDisplayNameFromKey = (key?: string) => key ? key.charAt(0).toUpperCase() + key.slice(1) : '';
  const themeName = agent ? toDisplayNameFromKey(agent.key) : undefined;
  const color = themeName ? getAgentColorForContext(themeName, 'dashboard') : undefined;
  const { isEnabled, toggle: toggleEnabled } = useAgentEnabled();
  const enabled = agent ? isEnabled(agent.key) : true;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Dim overlay with slight blur, clickable to close */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Root overlay + container (Content used as container for focus trap) */}
        <DialogPrimitive.Content className="fixed inset-0 z-[70] m-0 p-0 border-0 outline-none">
          {/* Centering container */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => {
              // Close only when clicking the backdrop area, not inside the panel
              if (e.currentTarget === e.target) onClose();
            }}
          >
            {/* Panel */}
            <div
              className="agent-bio-panel relative grid w-full max-w-[960px] border border-[color:var(--border)] rounded-2xl shadow-2xl md:grid-cols-[1fr_300px] overflow-y-auto scroll-smooth custom-scrollbar"
              style={{
                width: 'min(92vw, 960px)',
                maxHeight: 'min(90vh, 900px)',
                background: 'var(--modal-surface)',
                backdropFilter: 'saturate(1.1) blur(8px)'
              }}
              role="dialog" aria-modal="true"
            >
              {/* Sticky header bar */}
              <header
                className="sticky top-0 z-10 col-span-full flex items-center gap-3 bg-[color:var(--panel)]/95 backdrop-blur-sm border-b border-[color:var(--border)] px-5 py-4 md:px-6"
                style={{ background: 'var(--modal-surface)', backdropFilter: 'saturate(1.1) blur(8px)' }}
              >
                {/* Icon toggle */}
                {agent && (
                  <button
                    onClick={() => toggleEnabled(agent.key)}
                    aria-pressed={!enabled ? true : false}
                    title={enabled ? 'Disable agent' : 'Enable agent'}
                    className={[
                      'agent-icon-toggle h-9 w-9 md:h-10 md:w-10 rounded-lg grid place-items-center border',
                      'border-[color:var(--border)] hover:bg-[color:var(--panel)]/80 transition',
                      enabled ? '' : 'opacity-60 grayscale is-disabled',
                    ].join(' ')}
                    style={{ color: color }}
                  >
                    {React.createElement((Icons as any)[agent.icon] || (Icons as any).CommanderIcon, { className: 'h-6 w-6', color: 'currentColor' })}
                  </button>
                )}
                <div className="min-w-0">
                  <h3 id="agent-title" className="text-lg md:text-xl font-semibold leading-tight" style={{ color }}>
                    {agent?.name}
                  </h3>
                  {agent?.title && (
                    <p className="text-sm md:text-base text-[color:var(--muted)]">{agent.title}</p>
                  )}
                </div>
                {/* Close X (bigger on mobile) */}
                <div className="ml-auto">
                  <button
                    aria-label="Close agent details"
                    onClick={onClose}
                    className="shrink-0 grid place-items-center rounded-full border border-[color:var(--border)] hover:bg-[color:var(--panel)]/80 transition h-11 w-11 md:h-9 md:w-9"
                    style={{ marginRight: '0.25rem', marginTop: '0.25rem' }}
                  >
                    ×
                  </button>
                </div>
              </header>

              {agent && (
                <>
                  {/* Left: scrollable bio */}
                  <div
                    className="bio-pane whitespace-pre-wrap overflow-visible md:overflow-y-auto px-5 pb-24 md:px-6 md:pb-6 custom-scrollbar md:max-h-[calc(90vh-64px)]"
                  >
                    <div dangerouslySetInnerHTML={{ __html: formattedBio }} />
                  </div>

                  {/* Right: toggles */}
                  <aside
                    className="px-5 py-3 md:px-6 md:py-6 border-t md:border-t-0 md:border-l border-[color:var(--border)] overflow-visible md:overflow-y-auto custom-scrollbar md:static sticky bottom-0 pb-safe"
                    style={{ background: 'var(--modal-surface)', backdropFilter: 'saturate(1.1) blur(8px)' }}
                  >
                    <div className="flex flex-col gap-4">
                      {agent.focuses.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between gap-4 rounded-md border p-3"
                          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                        >
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

// Simple safe formatter: remove lines beginning with "Title:" and style key section labels.
function formatBio(raw: string): string {
  if (!raw) return '';
  const withoutTitle = raw
    .split(/\r?\n/)
    .filter((line) => !/^Title:\s*/i.test(line.trim()))
    .join('\n');

  const sectionLabels = ['Identity', 'Capabilities and Functions', 'Summary'];

  let html = withoutTitle
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  for (const label of sectionLabels) {
    const re = new RegExp(`(^|\\n)(${label})(\\n)`, 'g');
    html = html.replace(re, (_m, pre, lbl) => `${pre}<div class="bio-section-h">${lbl}</div>\n`);
  }

  // Convert remaining newlines
  html = html.replace(/\n/g, '<br/>' );
  return html;
}
