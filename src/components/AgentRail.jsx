import { useMemo, useEffect, useState } from 'react';
import '@/styles/agent-tile.css';
import '@/styles/agent-tiles-align.css';
import { agents as agentData } from '../lib/agents-enhanced';
import { getAgentColorForContext } from './ui/agentThemes';
import getIcon from './ui/agentIcons';
import { useAgentSelection } from '@/context/AgentSelectionContext';
import { isEnabled, subscribeEnabled, toggleAndNotify } from '../features/agents/utils/agentEnabled';

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
            <div key={agent.id} className="relative">
              <button
                onClick={() => setSelected?.(agent.name)}
                aria-disabled={!enabled}
                title={enabled ? agent.name : 'Agent is OFF — click to re-enable in bio'}
                className={`agent-tile w-full text-left transition ${
                  enabled ? 'hover:bg-[color:var(--panel-bg)] cursor-pointer' : 'opacity-50 grayscale hover:opacity-70 cursor-pointer'
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

              {/* Inline toggle button on right side */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleAndNotify(agent.id); }}
                className="absolute top-2 right-2 rounded-md border p-[6px] bg-transparent"
                style={{
                  borderColor: enabled ? color : 'var(--border)',
                  color: enabled ? color : 'var(--muted)',
                  transition: 'all 0.2s ease-in-out',
                }}
                title={enabled ? 'Disable Agent' : 'Enable Agent'}
                aria-label={enabled ? 'Disable Agent' : 'Enable Agent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v10" />
                  <path d="M5.5 7a8 8 0 1 0 13 0" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
