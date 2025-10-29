import React from 'react';
import type { AgentProfile } from './agents.data';
import * as Icons from '@/components/ui/agentIcons';

export type AgentCardProps = {
  agent: AgentProfile;
  color: string; // e.g., "#f59e0b" from theme map
  enabled?: boolean;
  onSelect?: (agent: AgentProfile) => void;
};

export function AgentCard({ agent, color, enabled = true, onSelect }: AgentCardProps) {
  const IconComponent = (Icons as any)[agent.icon] || (Icons as any).CommanderIcon;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(agent)}
      aria-disabled={!enabled}
      className={`group flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors hover:opacity-95 focus:outline-none focus-visible:ring-2 ${!enabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
      style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text)' }}
      aria-label={`${agent.name} – ${agent.title}`}
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
  );
}

export default AgentCard;
