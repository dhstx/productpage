import { useMemo } from 'react';
import { agents as agentData } from '../lib/agents-enhanced';
import { getAgentColor } from './ui/agentThemes';

export default function AgentRail({ selectedName, onSelect }) {
  const agents = useMemo(() => agentData.slice(0, 12), []);

  return (
    <aside className="sticky top-20 h-[calc(100vh-120px)] overflow-y-auto pr-2">
      <div className="space-y-2">
        {agents.map((agent) => {
          const isActive = selectedName === agent.name;
          return (
            <button
              key={agent.id}
              onClick={() => onSelect?.(agent.name)}
              className={`w-full text-left card-surface p-3 transition-colors hover:bg-[color:var(--panel-bg)] ${
                isActive ? 'outline outline-1 outline-[color:var(--accent-gold)]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${getAgentColor(agent.name, agent.color)}22` }}
                  >
                    <span className="text-base" aria-hidden style={{ color: getAgentColor(agent.name, agent.color) }}>{agent.icon}</span>
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
