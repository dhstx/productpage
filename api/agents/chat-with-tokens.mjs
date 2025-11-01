/**
 * Vercel Serverless Function for AI Agent Chat
 * With Token Tracking and Usage Limits
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

// Agent system prompts (inlined to avoid import issues)
const AGENT_PROMPTS = {
  orchestrator: `You are the Orchestrator, a central intelligence hub that analyzes user requests and provides helpful, actionable responses.

You coordinate with 12 specialist agents when needed:
- Chief of Staff: Strategic leadership and executive decisions
- Conductor: Operations management and task coordination
- Scout: Research and competitive intelligence
- Builder: Technical development and coding
- Muse: Creative design and multimedia
- Echo: Marketing and communications
- Connector: Customer relations and engagement
- Archivist: Knowledge management and documentation
- Ledger: Financial operations and analysis
- Counselor: Legal and compliance guidance
- Sentinel: Security and data protection
- Optimizer: Performance analytics and efficiency

Analyze the user's request and provide a comprehensive, helpful response. Be professional, clear, and actionable.`,

  commander: `You are Chief of Staff, a strategic leadership agent focused on executive decisions and high-level planning. You excel at:
- Strategic planning and vision setting
- Executive decision-making
- Business strategy development
- Leadership guidance
- Goal setting and OKRs

Provide strategic, executive-level guidance with clear action plans.`,

  conductor: `You are Conductor, an operations management agent focused on task coordination and project management. You excel at:
- Project planning and timelines
- Task breakdown and delegation
- Resource allocation
- Process optimization
- Team coordination

Provide structured, actionable project plans with clear timelines.`,

  scout: `You are Scout, a research and intelligence agent focused on gathering and analyzing information. You excel at:
- Market research
- Competitive analysis
- Trend identification
- Data gathering
- Industry insights

Provide well-researched insights with credible sources and actionable intelligence.`,

  builder: `You are Builder, a technical development agent focused on coding and software engineering. You excel at:
- Software development
- Code writing and debugging
- Technical architecture
- API integration
- System design

Provide clean, well-documented code with explanations and best practices.`,

  muse: `You are Muse, a creative design agent focused on visual and multimedia content. You excel at:
- Creative design concepts
- Brand identity
- Visual storytelling
- Multimedia content planning
- User experience design

Provide creative, innovative design concepts with clear implementation guidance.`,

  echo: `You are Echo, a marketing and communications agent focused on messaging and campaigns. You excel at:
- Marketing strategy
- Campaign planning
- Content creation
- Brand messaging
- Social media strategy

Provide compelling marketing strategies with clear messaging and execution plans.`,

  connector: `You are Connector, a customer relations agent focused on engagement and support. You excel at:
- Customer communication
- Relationship building
- Support strategies
- Engagement tactics
- Customer success planning

Provide customer-focused strategies with empathy and clear action steps.`,

  archivist: `You are Archivist, a knowledge management agent focused on documentation and information organization. You excel at:
- Documentation creation
- Knowledge base organization
- Information architecture
- Content management
- Process documentation

Provide well-structured documentation with clear organization and accessibility.`,

  ledger: `You are Ledger, a financial operations agent focused on accounting and financial analysis. You excel at:
- Financial planning
- Budget management
- Financial analysis
- Reporting and metrics
- Cost optimization

Provide accurate financial guidance with clear metrics and actionable recommendations.`,

  counselor: `You are Counselor, a legal and compliance agent focused on regulatory guidance. You excel at:
- Legal compliance
- Risk assessment
- Policy development
- Regulatory guidance
- Contract review

Provide clear compliance guidance with risk mitigation strategies. Note: This is informational only, not legal advice.`,

  sentinel: `You are Sentinel, a security and data protection agent focused on cybersecurity. You excel at:
- Security assessment
- Data protection
- Threat analysis
- Security protocols
- Incident response

Provide comprehensive security guidance with clear implementation steps.`,

  optimizer: `You are Optimizer, a performance analytics agent focused on efficiency and optimization. You excel at:
- Performance analysis
- Process optimization
- Data analytics
- KPI tracking
- Efficiency improvements

Provide data-driven optimization recommendations with measurable outcomes.`
};

/**
 * Check if user has access to the requested agent
 */
async function checkAgentAccess(userId, agentId, tier = 'free') {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  if (config.allowedAgents === 'all') {
    return { allowed: true };
  }
  
  if (!config.allowedAgents.includes(agentId)) {
    return {
      allowed: false,
      error: `Agent '${agentId}' is not available in your ${tier} plan. Upgrade to Starter ($15/mo) to access all 13 agents.`,
      upgradeRequired: true,
      allowedAgents: config.allowedAgents,
      currentTier: tier
    };
  }
  
  return { allowed: true };
}

/**
 * Check if anonymous user has exceeded question limit
 */
async function checkAnonymousLimit(sessionId) {
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
        .update({ 
          questions_asked: 0, 
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
        })
        .eq('session_id', sessionId);
      return { allowed: true };
    }
    
    // Check question limit
    if (session.questions_asked >= 1) {
      return {
        allowed: false,
        error: 'Anonymous users are limited to 1 question. Create a free account (100 tokens/month) to continue chatting!',
        upgradeRequired: true,
        questionsUsed: session.questions_asked,
        questionsLimit: 1
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
async function incrementAnonymousCount(sessionId) {
  try {
    const { error } = await supabase
      .from('anonymous_sessions')
      .update({ 
        questions_asked: supabase.raw('questions_asked + 1'),
        last_question_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error incrementing anonymous count:', error);
    }
  } catch (error) {
    console.error('Error in incrementAnonymousCount:', error);
  }
}

/**
 * Check if user has enough tokens
 */
async function checkTokenAvailability(userId, tokensRequired = 10) {
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
        error: `Insufficient tokens. You need ${tokensRequired} tokens but only have ${tokensAvailable} remaining. Upgrade or wait for monthly reset.`,
        tokensAvailable,
        tokensRequired,
        tokensAllocated: user.tokens_allocated,
        upgradeRequired: true,
        currentTier: user.subscription_tier
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
function estimateTokens(message) {
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
async function logTokenUsage({
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
    if (userId && userId !== 'guest') {
      const { error: updateError } = await supabase.rpc('consume_tokens', {
        p_user_id: userId,
        p_tokens_consumed: tokensConsumed
      });
      
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
 * Get user from auth token
 */
async function getUserFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    // Get user details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, subscription_tier, tokens_allocated, tokens_used')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return { id: user.id, subscription_tier: 'free' };
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

/**
 * Call an AI agent
 */
async function callAgent(agentId, userMessage) {
  try {
    const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.orchestrator;
    
    const startTime = Date.now();
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });
    const responseTime = Date.now() - startTime;
    
    return {
      text: response.content[0]?.text || 'No response generated',
      usage: response.usage,
      responseTime
    };
  } catch (error) {
    console.error(`Agent ${agentId} error:`, error);
    throw error;
  }
}

// Main handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message, agentId, sessionId } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Get user from auth header
    const authHeader = req.headers.authorization;
    const user = await getUserFromToken(authHeader);
    const tier = user?.subscription_tier || 'anonymous';
    const userId = user?.id || null;

    // Use provided sessionId or create new one
    const activeSessionId = sessionId || uuidv4();

    // Determine which agent to use
    const selectedAgent = agentId || 'orchestrator';

    // Check agent access
    const agentAccess = await checkAgentAccess(userId, selectedAgent, tier);
    if (!agentAccess.allowed) {
      return res.status(403).json({
        success: false,
        error: agentAccess.error,
        upgradeRequired: true,
        allowedAgents: agentAccess.allowedAgents,
        currentTier: tier
      });
    }

    // Check anonymous limits
    if (tier === 'anonymous') {
      const anonymousCheck = await checkAnonymousLimit(activeSessionId);
      if (!anonymousCheck.allowed) {
        return res.status(403).json({
          success: false,
          error: anonymousCheck.error,
          upgradeRequired: true,
          questionsUsed: anonymousCheck.questionsUsed,
          questionsLimit: anonymousCheck.questionsLimit
        });
      }
      await incrementAnonymousCount(activeSessionId);
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
          tokensAllocated: tokenCheck.tokensAllocated,
          upgradeRequired: true,
          currentTier: tier
        });
      }
    }

    // Call the agent
    const agentResult = await callAgent(selectedAgent, message.trim());

    // Log token usage
    const usageStats = await logTokenUsage({
      userId: userId || 'guest',
      sessionId: activeSessionId,
      agentId: selectedAgent,
      message: message.trim(),
      inputTokens: agentResult.usage?.input_tokens || 0,
      outputTokens: agentResult.usage?.output_tokens || 0,
      responseTimeMs: agentResult.responseTime
    });

    // Get updated token stats for user
    let tokenStats = null;
    if (userId && tier !== 'anonymous') {
      const { data: updatedUser } = await supabase
        .from('users')
        .select('tokens_allocated, tokens_used, tokens_reset_date')
        .eq('id', userId)
        .single();
      
      if (updatedUser) {
        tokenStats = {
          allocated: updatedUser.tokens_allocated,
          used: updatedUser.tokens_used,
          remaining: updatedUser.tokens_allocated - updatedUser.tokens_used,
          resetDate: updatedUser.tokens_reset_date
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: activeSessionId,
        agent: selectedAgent,
        response: agentResult.text,
        metadata: {
          model: 'claude-3-haiku-20240307',
          timestamp: new Date().toISOString(),
          responseTime: agentResult.responseTime
        },
        usage: usageStats ? {
          tokensConsumed: usageStats.tokensConsumed,
          costUsd: usageStats.costUsd
        } : null,
        tokenStats
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'An error occurred processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

