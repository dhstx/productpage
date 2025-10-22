/**
 * Adaptive Model Routing Service
 * Routes requests to appropriate models based on tier, usage, and margin protection
 */

import { createClient } from '@supabase/supabase-js';

// Tier model access configuration
export const TIER_MODEL_ACCESS = {
  freemium: {
    allowed: ['core'],
    default: 'core',
    advancedBlocked: true
  },
  entry: {
    allowed: ['core'],
    default: 'core',
    advancedBlocked: false, // Can purchase as add-on
    advancedRequiresPurchase: true
  },
  pro: {
    allowed: ['core', 'advanced'],
    default: 'core',
    advancedMetered: true,
    advancedSoftCap: 0.20,
    advancedHardCap: 0.25
  },
  pro_plus: {
    allowed: ['core', 'advanced'],
    default: 'core',
    advancedMetered: true,
    advancedSoftCap: 0.20,
    advancedHardCap: 0.25
  },
  business: {
    allowed: ['core', 'advanced'],
    default: 'core',
    advancedMetered: true,
    advancedSoftCap: 0.20,
    advancedHardCap: 0.25,
    adaptiveRouting: true
  },
  enterprise: {
    allowed: ['core', 'advanced', 'custom'],
    default: 'core',
    advancedMetered: true,
    advancedSoftCap: 0.30,
    advancedHardCap: 0.35,
    adaptiveRouting: true
  }
};

// Model mappings
export const MODEL_MAPPINGS = {
  core: {
    primary: 'claude-3-haiku-20240307',
    fallback: 'gpt-4o-mini'
  },
  advanced: {
    primary: 'gpt-4o',
    fallback: 'claude-3-5-sonnet-20241022'
  }
};

/**
 * Get user's current usage context
 */
async function getUserUsageContext(userId, supabase) {
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      subscription_tiers (
        tier,
        features
      )
    `)
    .eq('id', userId)
    .single();
  
  if (error || !user) {
    throw new Error('User not found');
  }
  
  // Calculate usage metrics
  const totalPTAllocated = user.core_pt_allocated + user.core_pt_rollover;
  const totalPTUsed = user.core_pt_used + user.advanced_pt_used;
  const usageRate = totalPTUsed / totalPTAllocated;
  
  // Calculate days in cycle
  const cycleStart = new Date(user.billing_cycle_start);
  const cycleEnd = new Date(user.billing_cycle_end);
  const now = new Date();
  const daysInCycle = Math.floor((now - cycleStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.floor((cycleEnd - now) / (1000 * 60 * 60 * 24));
  
  // Project usage
  const dailyUsage = daysInCycle > 0 ? totalPTUsed / daysInCycle : 0;
  const projectedUsage = totalPTUsed + (dailyUsage * daysRemaining);
  
  // Get Advanced PT cap status
  const { data: capData } = await supabase
    .from('advanced_pt_caps')
    .select('*')
    .eq('user_id', userId)
    .eq('billing_cycle_start', user.billing_cycle_start)
    .single();
  
  return {
    user,
    tier: user.subscription_tier,
    tierFeatures: user.subscription_tiers?.features || {},
    totalPTAllocated,
    totalPTUsed,
    usageRate,
    daysInCycle,
    daysRemaining,
    projectedUsage,
    advancedPTUsed: user.advanced_pt_used,
    advancedPTAllocated: user.advanced_pt_allocated + user.advanced_pt_purchased,
    capStatus: capData || null
  };
}

/**
 * Calculate adaptive Advanced budget for Business/Enterprise tiers
 */
function calculateAdaptiveAdvancedBudget(context) {
  const { usageRate, daysInCycle, projectedUsage, totalPTAllocated, tier } = context;
  
  // Get base budget from tier
  const tierConfig = TIER_MODEL_ACCESS[tier];
  let advancedBudget = tierConfig.advancedSoftCap || 0.20;
  
  // Only apply adaptive logic for Business/Enterprise
  if (!tierConfig.adaptiveRouting) {
    return advancedBudget;
  }
  
  // If user is burning through PT fast, reduce Advanced access
  if (projectedUsage > totalPTAllocated * 0.9) {
    advancedBudget = 0.15; // Reduce to 15%
  }
  // If user is light, allow more Advanced
  else if (usageRate < 0.5 && daysInCycle > 15) {
    advancedBudget = 0.30; // Increase to 30%
  }
  
  return advancedBudget;
}

/**
 * Check if Advanced model can be used
 */
async function canUseAdvanced(context, supabase) {
  const { tier, user, capStatus, advancedPTUsed, advancedPTAllocated } = context;
  
  const tierConfig = TIER_MODEL_ACCESS[tier];
  
  // Check if tier allows Advanced
  if (!tierConfig.allowed.includes('advanced')) {
    return {
      allowed: false,
      reason: 'tier_not_allowed',
      message: 'Your tier does not include Advanced model access'
    };
  }
  
  // Check if Advanced is blocked
  if (tierConfig.advancedBlocked) {
    return {
      allowed: false,
      reason: 'advanced_blocked',
      message: 'Advanced models are not available in your tier'
    };
  }
  
  // Check if requires purchase
  if (tierConfig.advancedRequiresPurchase && advancedPTAllocated === 0) {
    return {
      allowed: false,
      reason: 'purchase_required',
      message: 'Please purchase Advanced PT credits to use Advanced models'
    };
  }
  
  // Check if user has Advanced PT available
  if (advancedPTUsed >= advancedPTAllocated) {
    return {
      allowed: false,
      reason: 'insufficient_advanced_pt',
      message: 'You have used all your Advanced PT. Please purchase more or upgrade your tier.'
    };
  }
  
  // Check hard cap
  if (capStatus && capStatus.hard_cap_breached) {
    return {
      allowed: false,
      reason: 'hard_cap_breached',
      message: `You have exceeded the Advanced model usage limit (${tierConfig.advancedHardCap * 100}%). Overflow fees apply.`,
      overflowFee: true
    };
  }
  
  // Check soft cap (warning only)
  if (capStatus && capStatus.soft_cap_breached) {
    return {
      allowed: true,
      warning: true,
      reason: 'soft_cap_breached',
      message: `You are approaching the Advanced model usage limit (${tierConfig.advancedSoftCap * 100}%). Consider upgrading.`
    };
  }
  
  // Check adaptive budget (Business/Enterprise)
  if (tierConfig.adaptiveRouting) {
    const adaptiveBudget = calculateAdaptiveAdvancedBudget(context);
    const totalPT = context.totalPTUsed;
    const advancedPct = totalPT > 0 ? advancedPTUsed / totalPT : 0;
    
    if (advancedPct >= adaptiveBudget) {
      return {
        allowed: false,
        reason: 'adaptive_budget_exceeded',
        message: `Advanced model usage has reached adaptive limit (${Math.round(adaptiveBudget * 100)}%). Downgrading to Core model.`
      };
    }
  }
  
  return {
    allowed: true
  };
}

/**
 * Select appropriate model based on request and context
 */
export async function routeModel(params) {
  const {
    userId,
    requestedModel = 'auto',
    requestedModelClass = 'core',
    responseLength = 'medium',
    supabase
  } = params;
  
  // Get user context
  const context = await getUserUsageContext(userId, supabase);
  const tierConfig = TIER_MODEL_ACCESS[context.tier];
  
  // If user explicitly requested Advanced
  if (requestedModelClass === 'advanced' || requestedModel === 'advanced') {
    const advancedCheck = await canUseAdvanced(context, supabase);
    
    if (!advancedCheck.allowed) {
      // Downgrade to Core
      return {
        model: MODEL_MAPPINGS.core.primary,
        modelClass: 'core',
        routingDecision: 'downgraded',
        routingReason: advancedCheck.reason,
        message: advancedCheck.message,
        originalRequest: requestedModelClass
      };
    }
    
    // Allow Advanced (with warning if soft cap breached)
    return {
      model: MODEL_MAPPINGS.advanced.primary,
      modelClass: 'advanced',
      routingDecision: advancedCheck.warning ? 'allowed_with_warning' : 'allowed',
      routingReason: advancedCheck.reason,
      message: advancedCheck.message,
      warning: advancedCheck.warning
    };
  }
  
  // Default to Core
  return {
    model: MODEL_MAPPINGS.core.primary,
    modelClass: 'core',
    routingDecision: 'default',
    routingReason: 'user_preference_or_tier_default'
  };
}

/**
 * Get model fallback if primary fails
 */
export function getModelFallback(modelClass) {
  const mapping = MODEL_MAPPINGS[modelClass];
  if (!mapping) {
    return MODEL_MAPPINGS.core.fallback;
  }
  return mapping.fallback;
}

/**
 * Check if user should be prompted to upgrade
 */
export function shouldPromptUpgrade(context) {
  const { usageRate, tier, advancedPTUsed, advancedPTAllocated } = context;
  
  // Prompt if using >80% of PT
  if (usageRate > 0.80) {
    return {
      shouldPrompt: true,
      reason: 'high_usage',
      message: `You've used ${Math.round(usageRate * 100)}% of your PT. Consider upgrading for more capacity.`,
      suggestedTier: tier === 'entry' ? 'pro' : tier === 'pro' ? 'pro_plus' : 'business'
    };
  }
  
  // Prompt if Advanced PT exhausted
  if (advancedPTAllocated > 0 && advancedPTUsed >= advancedPTAllocated * 0.9) {
    return {
      shouldPrompt: true,
      reason: 'advanced_pt_low',
      message: 'You are running low on Advanced PT. Upgrade for more Advanced model access.',
      suggestedTier: tier === 'pro' ? 'pro_plus' : 'business'
    };
  }
  
  return {
    shouldPrompt: false
  };
}

/**
 * Get available models for user's tier
 */
export function getAvailableModels(tier) {
  const tierConfig = TIER_MODEL_ACCESS[tier];
  if (!tierConfig) {
    return ['core'];
  }
  return tierConfig.allowed;
}

/**
 * Emergency margin protection: Force all to Core
 */
export async function emergencyForceCore(supabase, reason = 'margin_protection') {
  // This would be called by margin monitoring system
  // Temporarily disable Advanced routing for all tiers
  
  console.warn(`EMERGENCY: Forcing all requests to Core model. Reason: ${reason}`);
  
  // Log event
  await supabase.from('margin_monitoring').insert({
    scope_type: 'platform',
    period_start: new Date(),
    period_end: new Date(),
    status: 'red',
    status_reason: reason,
    mitigation_applied: true,
    mitigation_actions: {
      action: 'force_core_model',
      timestamp: new Date().toISOString()
    }
  });
  
  return {
    emergencyMode: true,
    reason,
    message: 'All requests temporarily routed to Core model for margin protection'
  };
}

/**
 * Check if emergency mode is active
 */
export async function isEmergencyModeActive(supabase) {
  const { data } = await supabase
    .from('margin_monitoring')
    .select('*')
    .eq('scope_type', 'platform')
    .eq('status', 'red')
    .eq('mitigation_applied', true)
    .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()) // Last 12 hours
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (data && data.mitigation_actions?.action === 'force_core_model') {
    const eventTime = new Date(data.created_at);
    const now = new Date();
    const hoursSince = (now - eventTime) / (1000 * 60 * 60);
    
    // Emergency mode lasts 12 hours
    if (hoursSince < 12) {
      return {
        active: true,
        reason: data.status_reason,
        activatedAt: eventTime,
        expiresAt: new Date(eventTime.getTime() + 12 * 60 * 60 * 1000)
      };
    }
  }
  
  return {
    active: false
  };
}

