import React, { useEffect, useState } from 'react';
import type { AgentProfile } from './agents.data';
import * as Icons from '@/components/ui/agentIcons';
import { isEnabled, subscribeEnabled, toggleAndNotify } from './utils/agentEnabled';

export type AgentCardProps = {
  agent: AgentProfile;
  color: string; // e.g., "#f59e0b" from theme map
  onSelect?: (agent: AgentProfile) => void;
};

export function AgentCard({ agent, color, onSelect }: AgentCardProps) {
  const IconComponent = (Icons as any)[agent.icon] || (Icons as any).ChiefOfStaffIcon;
  const [enabled, setEnabled] = useState<boolean>(true);
  useEffect(() => {
    setEnabled(isEnabled(agent.key));
    return subscribeEnabled(() => setEnabled(isEnabled(agent.key)));
  }, [agent.key]);

  return (
    <div className="relative">
      {/* Tile clickable area */}
      <button
        type="button"
        onClick={() => onSelect?.(agent)}
        aria-disabled={!enabled}
        className={
          'group flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors focus:outline-none ' +
          (enabled ? 'hover:opacity-95 cursor-pointer' : 'opacity-50 grayscale hover:opacity-70 cursor-pointer')
        }
        style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text)' }}
        aria-label={`${agent.name} – ${agent.title}`}
        title={enabled ? 'Open agent details' : 'Agent is OFF — click to open and re-enable'}
      >
        <div
          className="flex items-center justify-center rounded-md h-14 w-14 sm:h-16 sm:w-16"
          style={{ color: enabled ? color : 'var(--muted)', backgroundColor: enabled ? `${color}1a` : 'transparent' }}
        >
          <IconComponent size={56} color="currentColor" className="sm:size-16" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text)' }}>
            {agent.name}
          </div>
          <div className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>
            {agent.title}
          </div>
        </div>
      </button>

      {/* Inline ON/OFF toggle in tile (top-right) */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggleAndNotify(agent.key); }}
        className="absolute top-2 right-2 rounded-md border p-1 bg-transparent"
        style={{
          borderColor: enabled ? color : 'var(--border)',
          color: enabled ? color : 'var(--muted)',
          transition: 'all 0.2s ease-in-out',
        }}
        title={enabled ? 'Disable Agent' : 'Enable Agent'}
        aria-label={enabled ? 'Disable Agent' : 'Enable Agent'}
      >
        {/* small power glyph using a simple SVG to avoid deps */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v10" />
          <path d="M5.5 7a8 8 0 1 0 13 0" />
        </svg>
      </button>
    </div>
  );
}

export default AgentCard;
