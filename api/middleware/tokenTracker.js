/**
 * Token Tracking Middleware
 * 
 * Tracks token usage, enforces limits, and logs consumption
 * for the token-based pricing system.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

// Token cost calculation (based on Claude Haiku pricing)
const TOKEN_COSTS = {
  input: 0.25 / 1_000_000,  // $0.25 per million tokens
  output: 1.25 / 1_000_000  // $1.25 per million tokens
};

// Subscription tier configurations
const TIER_CONFIG = {
  anonymous: {
    tokensAllocated: 0,
    questionsLimit: 1,
    allowedAgents: ['commander', 'connector', 'conductor']
  },
  free: {
    tokensAllocated: 100,
    questionsLimit: null,
    allowedAgents: ['commander', 'connector', 'conductor']
  },
  starter: {
    tokensAllocated: 500,
    questionsLimit: null,
    allowedAgents: 'all'
  },
  professional: {
    tokensAllocated: 1500,
    questionsLimit: null,
    allowedAgents: 'all'
  },
  business: {
    tokensAllocated: 5000,
    questionsLimit: null,
    allowedAgents: 'all'
  },
  enterprise: {
    tokensAllocated: 10000,
    questionsLimit: null,
    allowedAgents: 'all'
  }
};

/**
 * Check if user has access to the requested agent
 */
export async function checkAgentAccess(userId, agentId, tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.allowedAgents === 'all') {
    return { allowed: true };
  }
  
  if (!config.allowedAgents.includes(agentId)) {
    return {
      allowed: false,
      error: `Agent '${agentId}' is not available in your ${tier} plan. Upgrade to access all agents.`,
      upgradeRequired: true,
      allowedAgents: config.allowedAgents
    };
  }
  
  return { allowed: true };
}

/**
 * Check if anonymous user has exceeded question limit
 */
export async function checkAnonymousLimit(sessionId) {
  try {
    const { data: session, error } = await supabase
      .from('anonymous_sessions')
      .select('questions_asked, expires_at')
      .eq('session_id', sessionId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found is OK
      console.error('Error checking anonymous limit:', error);
      return { allowed: true }; // Fail open
    }
    
    if (!session) {
      // Create new session
      await supabase.from('anonymous_sessions').insert({
        session_id: sessionId,
        questions_asked: 0
      });
      return { allowed: true };
    }
    
    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      // Reset session
      await supabase
        .from('anonymous_sessions')
        .update({ questions_asked: 0, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) })
        .eq('session_id', sessionId);
      return { allowed: true };
    }
    
    // Check question limit
    if (session.questions_asked >= 1) {
      return {
        allowed: false,
        error: 'Anonymous users are limited to 1 question. Please create a free account to continue.',
        upgradeRequired: true
      };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Error in checkAnonymousLimit:', error);
    return { allowed: true }; // Fail open
  }
}

/**
 * Increment anonymous question count
 */
export async function incrementAnonymousCount(sessionId) {
  try {
    await supabase
      .from('anonymous_sessions')
      .update({ 
        questions_asked: supabase.raw('questions_asked + 1'),
        last_question_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
  } catch (error) {
    console.error('Error incrementing anonymous count:', error);
  }
}

/**
 * Check if user has enough tokens
 */
export async function checkTokenAvailability(userId, tokensRequired = 10) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier, tokens_allocated, tokens_used, tokens_reset_date')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking token availability:', error);
      return { allowed: true, warning: 'Unable to verify token balance' };
    }
    
    // Check if tokens need to be reset
    if (new Date(user.tokens_reset_date) < new Date()) {
      await resetUserTokens(userId);
      user.tokens_used = 0;
    }
    
    const tokensAvailable = user.tokens_allocated - user.tokens_used;
    
    if (tokensAvailable < tokensRequired) {
      return {
        allowed: false,
        error: `Insufficient tokens. You need ${tokensRequired} tokens but only have ${tokensAvailable} remaining.`,
        tokensAvailable,
        tokensRequired,
        upgradeRequired: true
      };
    }
    
    return {
      allowed: true,
      tokensAvailable,
      tokensAllocated: user.tokens_allocated,
      tokensUsed: user.tokens_used
    };
  } catch (error) {
    console.error('Error in checkTokenAvailability:', error);
    return { allowed: true, warning: 'Unable to verify token balance' };
  }
}

/**
 * Reset user tokens (called when billing cycle renews)
 */
async function resetUserTokens(userId) {
  try {
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
    
    await supabase
      .from('users')
      .update({
        tokens_used: 0,
        tokens_reset_date: nextResetDate.toISOString(),
        billing_cycle_start: new Date().toISOString()
      })
      .eq('id', userId);
    
    console.log(`Reset tokens for user ${userId}`);
  } catch (error) {
    console.error('Error resetting user tokens:', error);
  }
}

/**
 * Estimate tokens required for a message
 */
export function estimateTokens(message) {
  // Rough estimation: ~4 characters per token
  // Input: user message + system prompt (~500 tokens)
  // Output: average response (~1000 tokens)
  const inputTokens = Math.ceil(message.length / 4) + 500;
  const outputTokens = 1000; // Average
  const totalTokens = inputTokens + outputTokens;
  
  // Convert to user tokens (1 user token = 1000 AI tokens)
  return Math.ceil(totalTokens / 1000);
}

/**
 * Log token usage to database
 */
export async function logTokenUsage({
  userId,
  sessionId,
  agentId,
  message,
  inputTokens,
  outputTokens,
  model = 'claude-3-haiku-20240307',
  responseTimeMs
}) {
  try {
    const tokensConsumed = Math.ceil((inputTokens + outputTokens) / 1000);
    const costUsd = (inputTokens * TOKEN_COSTS.input) + (outputTokens * TOKEN_COSTS.output);
    
    // Log to token_usage table
    const { error: logError } = await supabase
      .from('token_usage')
      .insert({
        user_id: userId,
        session_id: sessionId,
        agent_id: agentId,
        message: message?.substring(0, 500), // Store first 500 chars
        tokens_consumed: tokensConsumed,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: costUsd,
        model,
        response_time_ms: responseTimeMs
      });
    
    if (logError) {
      console.error('Error logging token usage:', logError);
    }
    
    // Update user's token count
    if (userId) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          tokens_used: supabase.raw(`tokens_used + ${tokensConsumed}`)
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating user token count:', updateError);
      }
    }
    
    return {
      tokensConsumed,
      costUsd,
      inputTokens,
      outputTokens
    };
  } catch (error) {
    console.error('Error in logTokenUsage:', error);
    return null;
  }
}

/**
 * Get user token stats
 */
export async function getUserTokenStats(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier, tokens_allocated, tokens_used, tokens_reset_date')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user token stats:', error);
      return null;
    }
    
    return {
      tier: data.subscription_tier,
      allocated: data.tokens_allocated,
      used: data.tokens_used,
      remaining: data.tokens_allocated - data.tokens_used,
      resetDate: data.tokens_reset_date,
      usagePercentage: Math.round((data.tokens_used / data.tokens_allocated) * 100)
    };
  } catch (error) {
    console.error('Error in getUserTokenStats:', error);
    return null;
  }
}

/**
 * Middleware to enforce token limits
 */
export async function enforceTokenLimits(req, res, next) {
  try {
    const { agentId, message, sessionId } = req.body;
    const userId = req.user?.id;
    const tier = req.user?.subscription_tier || 'anonymous';
    
    // Check agent access
    const agentAccess = await checkAgentAccess(userId, agentId, tier);
    if (!agentAccess.allowed) {
      return res.status(403).json({
        success: false,
        error: agentAccess.error,
        upgradeRequired: true,
        allowedAgents: agentAccess.allowedAgents
      });
    }
    
    // Check anonymous limits
    if (tier === 'anonymous' && sessionId) {
      const anonymousCheck = await checkAnonymousLimit(sessionId);
      if (!anonymousCheck.allowed) {
        return res.status(403).json({
          success: false,
          error: anonymousCheck.error,
          upgradeRequired: true
        });
      }
      await incrementAnonymousCount(sessionId);
    }
    
    // Check token availability for logged-in users
    if (userId && tier !== 'anonymous') {
      const tokensRequired = estimateTokens(message);
      const tokenCheck = await checkTokenAvailability(userId, tokensRequired);
      
      if (!tokenCheck.allowed) {
        return res.status(403).json({
          success: false,
          error: tokenCheck.error,
          tokensAvailable: tokenCheck.tokensAvailable,
          tokensRequired: tokenCheck.tokensRequired,
          upgradeRequired: true
        });
      }
      
      // Attach token info to request for later use
      req.tokenInfo = tokenCheck;
    }
    
    next();
  } catch (error) {
    console.error('Error in enforceTokenLimits middleware:', error);
    // Fail open - don't block requests on middleware errors
    next();
  }
}

export default {
  checkAgentAccess,
  checkAnonymousLimit,
  incrementAnonymousCount,
  checkTokenAvailability,
  estimateTokens,
  logTokenUsage,
  getUserTokenStats,
  enforceTokenLimits
};

