// Canonical palette for ALL agents (used everywhere consistently)
export const agentThemes: Record<string, { hex: string }> = {
  Commander:    { hex: "#A88CFF" }, // purple (strategic)
  Conductor:    { hex: "#34D399" }, // teal/green (ops flow)
  Connector:    { hex: "#F5B63F" }, // gold (relationships)
  Scout:        { hex: "#95E1D3" },
  Builder:      { hex: "#F38181" },
  Muse:         { hex: "#AA96DA" },
  Echo:         { hex: "#FCBAD3" },
  Archivist:    { hex: "#A8D8EA" },
  Ledger:       { hex: "#FFD93D" },
  Counselor:    { hex: "#6BCB77" },
  Sentinel:     { hex: "#4D96FF" },
  Optimizer:    { hex: "#FF6B9D" },
  Orchestrator: { hex: "#FFC96C" },
};

export function getAgentColor(name?: string, fallback = "#FFC96C"): string {
  if (!name) return fallback;
  return agentThemes[name]?.hex ?? fallback;
}
