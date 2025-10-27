/**
 * Agent Access Control
 * 
 * Determines which agents are available based on subscription tier
 */

// Subscription tier configurations
export const TIER_CONFIG = {
  anonymous: {
    name: 'Anonymous',
    tokensAllocated: 0,
    questionsLimit: 1,
    allowedAgents: ['commander', 'connector', 'conductor'],
    features: {
      history: false,
      integrations: false,
      analytics: false,
      export: false
    }
  },
  free: {
    name: 'Free Account',
    tokensAllocated: 100,
    questionsLimit: null,
    allowedAgents: ['commander', 'connector', 'conductor'],
    features: {
      history: true,
      integrations: true,
      analytics: false,
      export: false
    }
  },
  starter: {
    name: 'Starter',
    price: 15,
    tokensAllocated: 500,
    questionsLimit: null,
    allowedAgents: 'all',
    features: {
      history: true,
      integrations: true,
      analytics: true,
      export: true,
      prioritySupport: true
    }
  },
  professional: {
    name: 'Professional',
    price: 39,
    tokensAllocated: 1500,
    questionsLimit: null,
    allowedAgents: 'all',
    features: {
      history: true,
      integrations: true,
      analytics: true,
      export: true,
      prioritySupport: true,
      priorityQueue: true,
      apiAccess: true
    }
  },
  business: {
    name: 'Business',
    price: 99,
    tokensAllocated: 5000,
    questionsLimit: null,
    allowedAgents: 'all',
    features: {
      history: true,
      integrations: true,
      analytics: true,
      export: true,
      prioritySupport: true,
      priorityQueue: true,
      apiAccess: true,
      teamCollaboration: true,
      customConfigs: true,
      sla: true
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    tokensAllocated: 10000,
    questionsLimit: null,
    allowedAgents: 'all',
    features: {
      history: true,
      integrations: true,
      analytics: true,
      export: true,
      prioritySupport: true,
      priorityQueue: true,
      apiAccess: true,
      teamCollaboration: true,
      customConfigs: true,
      sla: true,
      unlimitedTeam: true,
      customDevelopment: true,
      whiteLabel: true,
      dedicatedInfra: true
    }
  }
};

// Simple name-based availability with auth gating
const CORE_THREE = ['Commander', 'Conductor', 'Connector'];

/**
 * Return list of agent names available for the given tier and auth state
 */
export function getAvailableAgents(userTier = 'freemium', isAuthenticated = false) {
  // Public/unauthenticated: limit to the core three
  if (!isAuthenticated) return CORE_THREE;

  // Tier mapping by product tier (names must match display names)
  const tierMap = {
    public: CORE_THREE,
    freemium: CORE_THREE,
    entry: CORE_THREE.concat(['Scout', 'Echo']),
    pro: CORE_THREE.concat(['Scout', 'Echo', 'Builder', 'Muse']),
    proplus: CORE_THREE.concat(['Scout', 'Echo', 'Builder', 'Muse', 'Archivist', 'Ledger']),
    business: [
      ...CORE_THREE,
      'Scout','Echo','Builder','Muse','Archivist','Ledger','Counselor','Sentinel','Optimizer','Orchestrator'
    ],
  };

  return tierMap[userTier] || CORE_THREE;
}

/**
 * Check if user has access to a specific agent
 */
export function hasAgentAccess(agentId, tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.allowedAgents === 'all') {
    return true;
  }
  
  return config.allowedAgents.includes(agentId);
}

/**
 * Filter agents based on user's subscription tier
 */
export function filterAgentsByTier(agents, tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.allowedAgents === 'all') {
    return agents;
  }
  
  return agents.filter(agent => config.allowedAgents.includes(agent.id));
}

/**
 * Get locked agents for a tier
 */
export function getLockedAgents(agents, tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.allowedAgents === 'all') {
    return [];
  }
  
  return agents.filter(agent => !config.allowedAgents.includes(agent.id));
}

/**
 * Get tier configuration
 */
export function getTierConfig(tier = 'free') {
  return TIER_CONFIG[tier] || TIER_CONFIG.free;
}

/**
 * Get upgrade message for locked agent
 */
export function getUpgradeMessage(agentId, currentTier = 'free') {
  const agentName = agentId.charAt(0).toUpperCase() + agentId.slice(1);
  
  if (currentTier === 'anonymous') {
    return `Create a free account to access ${agentName} and 2 other specialized agents with 100 tokens/month.`;
  }
  
  if (currentTier === 'free') {
    return `Upgrade to Starter ($15/mo) to unlock ${agentName} and 10 other specialized agents with 500 tokens/month.`;
  }
  
  return `This agent requires a higher subscription tier.`;
}

/**
 * Get next tier recommendation
 */
export function getNextTierRecommendation(currentTier = 'free') {
  const tierOrder = ['anonymous', 'free', 'starter', 'professional', 'business', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) {
    return null;
  }
  
  const nextTier = tierOrder[currentIndex + 1];
  return {
    tier: nextTier,
    config: TIER_CONFIG[nextTier]
  };
}

/**
 * Check if user can ask more questions (for anonymous users)
 */
export function canAskQuestion(questionsAsked, tier = 'anonymous') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.questionsLimit === null) {
    return true;
  }
  
  return questionsAsked < config.questionsLimit;
}

/**
 * Get tier display info
 */
export function getTierDisplayInfo(tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  return {
    name: config.name,
    tokens: config.tokensAllocated,
    price: config.price || 0,
    features: Object.keys(config.features).filter(key => config.features[key]),
    agentCount: config.allowedAgents === 'all' ? 13 : config.allowedAgents.length
  };
}

export default {
  TIER_CONFIG,
  hasAgentAccess,
  filterAgentsByTier,
  getLockedAgents,
  getTierConfig,
  getUpgradeMessage,
  getNextTierRecommendation,
  canAskQuestion,
  getTierDisplayInfo
};

