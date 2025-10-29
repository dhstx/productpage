import { useMemo } from 'react';
import '@/styles/agent-tile.css';
import '@/styles/agent-tiles-align.css';
import { agents as agentData } from '../lib/agents-enhanced';
import { getAgentColorForContext } from './ui/agentThemes';
import getIcon from './ui/agentIcons';
import { useAgentSelection } from '@/context/AgentSelectionContext';

export default function AgentRail({ selectedName, onSelect }) {
  const { selected, setSelected } = (() => {
    try {
      return useAgentSelection();
    } catch {
      // Fallback if provider not present (public pages)
      return { selected: selectedName, setSelected: onSelect };
    }
  })();

  const agents = useMemo(() => agentData.slice(0, 12), []);

  return (
    <aside
      className="pl-[2px] pr-2 lg:sticky lg:top-20 lg:h-[calc(100vh-120px)] lg:overflow-y-auto"
      style={{ overflowX: 'visible' }}
    >
      <div className="agent-tile-grid lg:block lg:space-y-2">
        {agents.map((agent) => {
          const isActive = selected === agent.name;
          const color = getAgentColorForContext(agent.name, 'dashboard');
          const Icon = getIcon(agent.name);
          return (
            <button
              key={agent.id}
              onClick={() => setSelected?.(agent.name)}
              className={`agent-tile w-full text-left transition hover:bg-[color:var(--panel-bg)] ${isActive ? 'agent-tile--active' : ''}`}
              style={{
                '--agent-ring': color,
                backgroundColor: isActive ? `${color}10` : undefined,
              }}
            >
              <span className="agent-tile__icon" style={{ backgroundColor: `${color}22` }}>
                <Icon size={16} color={color} />
              </span>
              <span className="agent-tile__name" style={{ color: 'var(--text)' }}>{agent.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
