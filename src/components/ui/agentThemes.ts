export const agentThemes: Record<string, { hex: string }> = {
  // UI-only remap per spec:
  // Commander → gold, Connector → green, Conductor → purple
  Commander: { hex: "#e5aa5d" }, // gold
  Connector: { hex: "#34D399" }, // green
  Conductor: { hex: "#A88CFF" }, // purple
};

export function getAgentColor(name?: string, fallback = "#FFC96C"): string {
  if (!name) return fallback;
  return agentThemes[name]?.hex ?? fallback;
}
