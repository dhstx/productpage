import React, { useEffect, useState } from 'react';
import type { AgentProfile } from './agents.data';
import * as Icons from '@/components/ui/agentIcons';
import { isEnabled, subscribeEnabled } from './utils/agentEnabled';

export type AgentCardProps = {
  agent: AgentProfile;
  color: string; // e.g., "#f59e0b" from theme map
  onSelect?: (agent: AgentProfile) => void;
};

export function AgentCard({ agent, color, onSelect }: AgentCardProps) {
  const IconComponent = (Icons as any)[agent.icon] || (Icons as any).CommanderIcon;
  const [enabled, setEnabled] = useState<boolean>(true);
  useEffect(() => {
    setEnabled(isEnabled(agent.key));
    return subscribeEnabled(() => setEnabled(isEnabled(agent.key)));
  }, [agent.key]);

  return (
    <button
      type="button"
      onClick={enabled ? () => onSelect?.(agent) : undefined}
      aria-disabled={!enabled}
      className={
        'group flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors focus:outline-none focus-visible:ring-2 ' +
        (enabled ? 'hover:opacity-95 cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed')
      }
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
