export const agentThemes: Record<string, { hex: string }> = {
  Commander: { hex: "#e5aa5d" },  // gold per spec
  Connector: { hex: "#A88CFF" },  // purple reassigned to Connector
  Conductor: { hex: "#5CC9F5" },  // unchanged per spec (fallback if not used)
};

export function getAgentColor(name?: string, fallback = "#FFC96C"): string {
  if (!name) return fallback;
  return agentThemes[name]?.hex ?? fallback;
}
