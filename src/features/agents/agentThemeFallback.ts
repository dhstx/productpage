import React from 'react';

export const agentColor: Record<string, string> = {
  Orchestrator: '#34C3FF', Commander: '#FFC96C', Conductor: '#00D4B3', Connector: '#19D39D',
  Builder: '#E779C1', Archivist: '#9EC2FF', Echo: '#A78BFA', Ledger: '#F5B042',
  Muse: '#F9A8D4', Optimizer: '#FF6B6B', Scout: '#6EE7B7', Counselor: '#86EFAC',
  Sentinel: '#60A5FA'
};

export const AgentIconFallback = ({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
  </svg>
);
