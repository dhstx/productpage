/* AgentsHoverPanel.jsx
   Centered translucent overlay listing all agents symmetrically.
   - Re-uses agent.icon and agent.color from the canonical agent objects
   - Icons are colored via inline color, use currentColor inside icons
   - Hover scale applies only to pointer-fine devices
*/
import React, { useEffect, useRef } from 'react';

export default function AgentsHoverPanel({ open, agents = [], onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const N = Math.max(0, agents.length);
  // near-square grid for symmetry
  const cols = Math.max(2, Math.ceil(Math.sqrt(N)));
  const rows = Math.ceil(N / cols);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '1rem',
    alignItems: 'stretch',
  };

  // Panel sizing: attempt to fit all agents without internal scrolling for typical counts (e.g., 13)
  const panelStyleLight = {
    width: 'min(1100px, 92vw)',
    maxHeight: 'min(75vh, 820px)',
    background: 'rgba(255,255,255,0.93)',
    color: '#0C0C0C',
    borderRadius: 12,
    padding: 20,
    overflow: 'hidden', // prefer layout fit; if impossible we still won't show internal scroll
    backdropFilter: 'blur(6px)',
  };

  const panelStyleDark = {
    width: 'min(1100px, 92vw)',
    maxHeight: 'min(75vh, 820px)',
    background: 'rgba(8,8,8,0.86)',
    color: '#F2F2F2',
    borderRadius: 12,
    padding: 20,
    overflow: 'hidden',
    backdropFilter: 'blur(6px)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-hidden={!open}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="All Agents"
        className="relative z-10 mx-4 shadow-xl"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Light mode */}
        <div className="dark:hidden" style={panelStyleLight}>
          <h3 className="text-lg font-semibold mb-4">All Agents</h3>
          <div style={{ ...gridStyle, height: 'calc(100% - 36px)' }} className="w-full">
            {agents.map((agent, idx) => {
              const Icon = agent.icon || null;
              const color = agent.color || '#FFC96C';
              return (
                <div
                  key={agent.key || agent.id || idx}
                  className="agent-item flex flex-col items-center justify-start text-center"
                  style={{ padding: 8, userSelect: 'none' }}
                >
                  <div
                    className="agent-icon inline-flex items-center justify-center rounded-full transition-transform duration-200"
                    style={{
                      width: 64,
                      height: 64,
                      color,
                    }}
                    aria-hidden="true"
                  >
                    {Icon ? <Icon className="w-8 h-8" /> : <span style={{ color }} className="text-2xl">●</span>}
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold" style={{ color: '#0C0C0C' }}>{agent.name}</div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{agent.title || ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dark mode */}
        <div className="hidden dark:block" style={panelStyleDark}>
          <h3 className="text-lg font-semibold mb-4 text-[#F2F2F2]">All Agents</h3>
          <div style={{ ...gridStyle, height: 'calc(100% - 36px)' }} className="w-full">
            {agents.map((agent, idx) => {
              const Icon = agent.icon || null;
              const color = agent.color || '#FFC96C';
              return (
                <div
                  key={agent.key || agent.id || idx}
                  className="agent-item flex flex-col items-center justify-start text-center"
                  style={{ padding: 8, userSelect: 'none' }}
                >
                  <div
                    className="agent-icon inline-flex items-center justify-center rounded-full transition-transform duration-200"
                    style={{
                      width: 64,
                      height: 64,
                      color,
                    }}
                    aria-hidden="true"
                  >
                    {Icon ? <Icon className="w-8 h-8" /> : <span style={{ color }} className="text-2xl">●</span>}
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-[#F2F2F2]">{agent.name}</div>
                    <div className="text-xs mt-1 text-[#9CA3AF]">{agent.title || ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover-only scale styles (media query ensures touch devices unaffected) */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .agent-item .agent-icon {
            transition: transform 180ms ease;
          }
          .agent-item:hover .agent-icon {
            transform: scale(1.16);
          }
        }
        /* Make agent tiles non-interactive to ensure no clicking on icons/labels */
        .agent-item { pointer-events: none; }
        .agent-item * { pointer-events: none; }
      `}</style>
    </div>
  );
}
