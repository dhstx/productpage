// If you already have this, keep yours and ignore this fallback.
export function getAgentColorForContext(key: string, _ctx?: string) {
  const map: Record<string, string> = {
    orchestrator: '#00B3FF', commander: '#FFB000', conductor: '#A78BFA',
    connector: '#25D0A4', counselor: '#22C55E', builder: '#F87171',
    muse: '#60A5FA', echo: '#E879F9', ledger: '#F59E0B', sentinel: '#3B82F6',
    optimizer: '#F472B6', archivist: '#34D399', scout: '#10B981'
  };
  // Use CSS var token if available; else color string above (only for color value; UI uses tokens).
  return `var(--agent-${key}-color, ${map[key] ?? 'var(--accent-gold)'})`;
}

// Fallback AgentIcon if none exists in project
export function AgentIcon({ className }: { className?: string }) {
  return <div className={className} style={{ borderRadius: '50%', border: '2px solid currentColor' }} />;
}
