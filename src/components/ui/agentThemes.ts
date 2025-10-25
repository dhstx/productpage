export const agentThemes: Record<string, { hex: string }> = {
  // Canonicalized to match Select Agent dropdown colors (purple, green/teal, gold)
  Commander: { hex: "#A88CFF" }, // purple
  Conductor: { hex: "#34D399" }, // green/teal
  Connector: { hex: "#F5B63F" }, // gold
};

export function getAgentColor(name?: string, fallback = "#FFC96C"): string {
  if (!name) return fallback;
  return agentThemes[name]?.hex ?? fallback;
}
