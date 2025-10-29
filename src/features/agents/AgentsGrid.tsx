import React from 'react';
import { AGENTS, type AgentProfile } from './agents.data';
import AgentCard from './AgentCard';
import { getAgentColorForContext } from '@/components/ui/agentThemes';
import { useAgentEnabled } from './AgentEnabledProvider';

export type AgentsGridProps = {
  onSelect?: (agent: AgentProfile) => void;
};

function toDisplayNameFromKey(key: string): string {
  if (!key) return '';
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function AgentsGrid({ onSelect }: AgentsGridProps) {
  const agents = React.useMemo(
    () => [...AGENTS].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const { isEnabled } = useAgentEnabled();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {agents.map((agent) => {
        const themeName = toDisplayNameFromKey(agent.key);
        const color = getAgentColorForContext(themeName, 'dashboard');
        const enabled = isEnabled(agent.key);
        return (
          <AgentCard key={agent.key} agent={agent} color={color} enabled={enabled} onSelect={onSelect} />
        );
      })}
    </div>
  );
}

export default AgentsGrid;
