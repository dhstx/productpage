/**
 * Agent theme configuration
 * Centralized color mapping for agent selection and UI theming
 */

export const AGENT_COLORS = {
  strategic: {
    hex: '#FFC96C',
    tw: 'text-[#FFC96C]',
    name: 'Strategic Advisor'
  },
  engagement: {
    hex: '#8B5CF6',
    tw: 'text-[#8B5CF6]',
    name: 'Engagement Analyst'
  },
  operations: {
    hex: '#10B981',
    tw: 'text-[#10B981]',
    name: 'Operations Assistant'
  }
};

/**
 * Get agent key from display name
 */
export function getAgentKey(displayName) {
  const entry = Object.entries(AGENT_COLORS).find(
    ([_, config]) => config.name === displayName
  );
  return entry ? entry[0] : 'strategic';
}

/**
 * Get agent config from display name
 */
export function getAgentConfig(displayName) {
  const key = getAgentKey(displayName);
  return AGENT_COLORS[key];
}

