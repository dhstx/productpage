// Canonical palette for ALL agents (used everywhere consistently)
export const baseThemes: Record<string, { hex: string }> = {
  Commander:    { hex: "#A88CFF" }, // KEEP
  Conductor:    { hex: "#34D399" }, // KEEP
  Connector:    { hex: "#F5B63F" }, // KEEP
  // Additional agents
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

// Back-compat: preserve existing export name
export const agentThemes = baseThemes;

// Public overrides: map Connector to site gold token
const publicOverrides: Partial<Record<string, { hex: string }>> = {
  Commander: { hex: "#A88CFF" },
  Conductor: { hex: "#34D399" },
  // Use CSS variable token for gold so it stays in sync with theme
  Connector: { hex: "var(--accent-gold)" },
};

export type AgentColorContext = "public" | "dashboard";

export function getAgentColorForContext(
  name?: string,
  ctx: AgentColorContext = "dashboard",
  fallback = "#FFC96C"
): string {
  if (!name) return fallback;
  if (ctx === "public" && publicOverrides[name]) return publicOverrides[name]!.hex;
  return baseThemes[name]?.hex ?? fallback;
}

// Back-compat for existing imports:
export function getAgentColor(name?: string, fallback = "#FFC96C"): string {
  return getAgentColorForContext(name, "dashboard", fallback);
}
