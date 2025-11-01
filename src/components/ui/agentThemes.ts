// Canonical palette for ALL agents (used everywhere consistently)
export const baseThemes: Record<string, { hex: string }> = {
  'Chief of Staff':    { hex: "#FFC96C" }, // ORANGE - from deployment Pj8E7V3Td9GBFXYLY6t2ZSmp1LGN
  Conductor:    { hex: "#A88CFF" }, // PURPLE
  Connector:    { hex: "#34D399" }, // GREEN
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
  Orchestrator: { hex: "#06B6D4" }, // cyan — not used elsewhere
};

// Back-compat: preserve existing export name
export const agentThemes = baseThemes;

// Public overrides = ORIGINAL colors for the three only (icons unchanged)
const publicOverrides: Partial<Record<string, { hex: string }>> = {
  'Chief of Staff': { hex: "#FFC96C" },
  Conductor: { hex: "#A88CFF" },
  Connector: { hex: "#34D399" },
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
