import { useMemo } from 'react';
import '@/styles/agent-tile.css';
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
    <aside className="pr-2 lg:sticky lg:top-20 lg:h-[calc(100vh-120px)] lg:overflow-y-auto">
      <div className="agent-tile-grid lg:block lg:space-y-2">
        {agents.map((agent) => {
          const isActive = selected === agent.name;
          const color = getAgentColorForContext(agent.name, 'dashboard');
          const Icon = getIcon(agent.name);
          return (
            <button
              key={agent.id}
              onClick={() => setSelected?.(agent.name)}
              className={`agent-tile w-full text-left card-surface p-3 transition-colors hover:bg-[color:var(--panel-bg)] ${isActive ? 'agent-tile--active' : ''}`}
              style={{
                '--agent-ring': color,
                backgroundColor: isActive ? `${color}10` : undefined,
              }}
            >
              <div className="agent-tile__row items-start gap-3">
                <div className="relative mt-0.5">
                  <div
                    className="agent-tile__icon h-8 w-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${color}22` }}
                  >
                    <Icon size={16} color={color} />
                  </div>
                  <span className="absolute -right-1 -top-1 inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {agent.name}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                      background: 'var(--accent-muted)',
                      color: 'var(--accent-gold)'
                    }}>v2</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {agent.tagline || agent.description?.slice(0, 60)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
