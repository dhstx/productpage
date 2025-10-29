import { useMemo, useEffect, useState } from 'react';
import '@/styles/agent-tile.css';
import '@/styles/agent-tiles-align.css';
import { agents as agentData } from '../lib/agents-enhanced';
import { getAgentColorForContext } from './ui/agentThemes';
import getIcon from './ui/agentIcons';
import { useAgentSelection } from '@/context/AgentSelectionContext';
import { isEnabled, subscribeEnabled } from '../features/agents/utils/agentEnabled';

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
  const [, setEnabledTick] = useState(0);
  useEffect(() => {
    return subscribeEnabled(() => setEnabledTick((v) => v + 1));
  }, []);

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
          const enabled = isEnabled(agent.id);
          return (
            <button
              key={agent.id}
              onClick={enabled ? () => setSelected?.(agent.name) : undefined}
              aria-disabled={!enabled}
              title={enabled ? agent.name : 'Agent is disabled. Open its bio to re-enable.'}
              className={`agent-tile w-full text-left transition ${
                enabled ? 'hover:bg-[color:var(--panel-bg)] cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'
              } ${isActive ? 'agent-tile--active' : ''}`}
              style={{
                '--agent-ring': color,
                backgroundColor: isActive ? `${color}10` : undefined,
              }}
            >
              <span className="agent-tile__icon" style={{ backgroundColor: enabled ? `${color}22` : 'transparent' }}>
                <Icon size={16} color={enabled ? color : 'var(--muted)'} />
              </span>
              <span className="agent-tile__name" style={{ color: 'var(--text)' }}>{agent.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
