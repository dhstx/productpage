/**
 * Chat API v3 - Complete PT Tracking with Adaptive Controls
 * Implements metered Advanced PT, two-layer caps, and throttling
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { calculatePTCost, estimatePTCost } from '../services/ptCostCalculator.js';
import { routeModel, isEmergencyModeActive } from '../services/modelRouter.js';
import { performThrottleChecks } from '../services/throttleManager.js';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Agent system prompts (inlined)
const AGENT_PROMPTS = {
  commander: `You are the Commander agent, an expert at breaking down complex requests into actionable steps and coordinating multi-agent workflows. Your role is to analyze user requests, determine which specialized agents are needed, and orchestrate their collaboration to achieve the user's goals efficiently.`,
  
  researcher: `You are the Researcher agent, specialized in gathering, analyzing, and synthesizing information from various sources. You excel at finding relevant data, fact-checking, and providing comprehensive research summaries.`,
  
  writer: `You are the Writer agent, skilled in creating clear, engaging, and well-structured content. You adapt your writing style to match the user's needs, whether it's technical documentation, creative content, or business communications.`,
  
  analyst: `You are the Analyst agent, expert in data analysis, pattern recognition, and deriving actionable insights from information. You excel at breaking down complex problems and providing data-driven recommendations.`,
  
  coder: `You are the Coder agent, specialized in software development, code review, debugging, and technical problem-solving. You provide clean, efficient, and well-documented code solutions.`,
  
  strategist: `You are the Strategist agent, focused on high-level planning, business strategy, and long-term thinking. You help users develop comprehensive strategies and make informed decisions.`,
  
  qa: `You are the QA agent, specialized in quality assurance, testing, and validation. You review outputs for accuracy, completeness, and quality, identifying potential issues and suggesting improvements.`,
  
  optimizer: `You are the Optimizer agent, focused on improving efficiency, performance, and resource utilization. You analyze processes and suggest optimizations.`,
  
  designer: `You are the Designer agent, specialized in user experience, interface design, and visual communication. You help create intuitive and aesthetically pleasing solutions.`,
  
  educator: `You are the Educator agent, skilled in explaining complex concepts in simple terms, creating learning materials, and adapting explanations to different knowledge levels.`,
  
  critic: `You are the Critic agent, providing constructive feedback, identifying weaknesses, and suggesting improvements. You help refine ideas and outputs through critical analysis.`,
  
  innovator: `You are the Innovator agent, focused on creative problem-solving, brainstorming novel approaches, and thinking outside the box to find unique solutions.`,
  
  integrator: `You are the Integrator agent, specialized in combining outputs from multiple agents, resolving conflicts, and creating cohesive final deliverables.`
};

/**
 * Main chat handler
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { 
      message, 
      agent = 'commander',
      userId,
      sessionId,
      requestedModel = 'auto',
      estimateOnly = false
    } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Handle anonymous users
    if (!userId) {
      return handleAnonymousRequest(message, agent, sessionId, res);
    }
    
    // Check if emergency mode is active
    const emergencyMode = await isEmergencyModeActive(supabase);
    if (emergencyMode.active) {
      console.warn('Emergency mode active, forcing Core model');
    }
    
    // Estimate PT cost
    const estimate = estimatePTCost(message, requestedModel);
    
    if (estimateOnly) {
      return res.status(200).json({
        estimate,
        message: 'This request will cost approximately ' + estimate.ptCost + ' PT'
      });
    }
    
    // Perform throttle checks
    const throttleChecks = await performThrottleChecks(
      userId,
      estimate.ptType,
      supabase
    );
    
    if (!throttleChecks.passed) {
      return res.status(429).json({
        error: 'Request throttled',
        throttled: true,
        blocks: throttleChecks.blocks,
        warnings: throttleChecks.warnings
      });
    }
    
    // Route to appropriate model
    const routing = await routeModel({
      userId,
      requestedModel,
      requestedModelClass: estimate.ptType,
      responseLength: 'medium',
      supabase
    });
    
    // Override if emergency mode
    if (emergencyMode.active) {
      routing.model = 'claude-3-haiku-20240307';
      routing.modelClass = 'core';
      routing.routingDecision = 'emergency_override';
      routing.routingReason = emergencyMode.reason;
    }
    
    // Get agent prompt
    const systemPrompt = AGENT_PROMPTS[agent] || AGENT_PROMPTS.commander;
    
    // Call AI model
    const startTime = Date.now();
    const response = await anthropic.messages.create({
      model: routing.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });
    
    const responseTime = Date.now() - startTime;
    
    // Extract response
    const assistantMessage = response.content[0].text;
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    
    // Calculate actual PT cost
    const ptCost = await calculatePTCost({
      inputTokens,
      outputTokens,
      model: routing.model,
      usageContext: {
        agentType: agent === 'commander' ? 'moderate' : 'simple',
        contentType: 'text',
        integrations: 0
      },
      supabase
    });
    
    // Consume PT
    const consumeResult = await supabase.rpc('consume_pt', {
      p_user_id: userId,
      p_pt_amount: ptCost.ptCost,
      p_pt_type: ptCost.ptType,
      p_usage_id: null // Will be set after logging
    });
    
    if (!consumeResult.data?.success) {
      console.error('Failed to consume PT:', consumeResult.error);
    }
    
    // Log usage
    const { data: usageLog } = await supabase
      .from('pt_usage')
      .insert({
        user_id: userId,
        session_id: sessionId,
        agent_id: agent,
        model_used: routing.model,
        model_requested: requestedModel,
        model_class: routing.modelClass,
        response_length: ptCost.totalTokens <= 1500 ? 'short' : ptCost.totalTokens <= 4200 ? 'medium' : 'long',
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: ptCost.totalTokens,
        pt_consumed: ptCost.ptCost,
        pt_type: ptCost.ptType,
        cost_usd: ptCost.totalCost,
        pt_cost_usd: ptCost.baseCost,
        routing_decision: routing.routingDecision,
        routing_reason: routing.routingReason
      })
      .select()
      .single();
    
    // Get updated PT status
    const { data: userStatus } = await supabase
      .from('user_pt_status')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Check for warnings
    const warnings = [...throttleChecks.warnings];
    if (routing.warning) {
      warnings.push({
        type: 'routing_warning',
        message: routing.message
      });
    }
    
    // Return response
    return res.status(200).json({
      response: assistantMessage,
      agent,
      model: routing.model,
      modelClass: routing.modelClass,
      routing: {
        decision: routing.routingDecision,
        reason: routing.routingReason,
        message: routing.message
      },
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: ptCost.totalTokens,
        ptConsumed: ptCost.ptCost,
        ptType: ptCost.ptType,
        cost: ptCost.totalCost,
        responseTime
      },
      ptStatus: {
        corePTAllocated: userStatus?.core_pt_allocated || 0,
        corePTUsed: userStatus?.core_pt_used || 0,
        corePTRemaining: (userStatus?.core_pt_allocated || 0) - (userStatus?.core_pt_used || 0),
        coreUsagePercentage: userStatus?.core_usage_percentage || 0,
        advancedPTAllocated: userStatus?.advanced_pt_allocated || 0,
        advancedPTUsed: userStatus?.advanced_pt_used || 0,
        advancedPTRemaining: (userStatus?.advanced_pt_allocated || 0) - (userStatus?.advanced_pt_used || 0),
        advancedUsagePercentage: userStatus?.advanced_usage_percentage || 0,
        billingCycleEnd: userStatus?.billing_cycle_end,
        throttleActive: userStatus?.throttle_active || false
      },
      warnings: warnings.length > 0 ? warnings : undefined,
      emergencyMode: emergencyMode.active ? {
        active: true,
        reason: emergencyMode.reason
      } : undefined
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Handle anonymous user requests
 */
async function handleAnonymousRequest(message, agent, sessionId, res) {
  if (!sessionId) {
    return res.status(400).json({
      error: 'Session ID required for anonymous users'
    });
  }
  
  // Get or create anonymous session
  let { data: session } = await supabase
    .from('anonymous_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  
  if (!session) {
    // Create new session
    const { data: newSession, error } = await supabase
      .from('anonymous_sessions')
      .insert({
        session_id: sessionId,
        questions_asked: 0,
        pt_used: 0,
        max_questions: 1
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({
        error: 'Failed to create session'
      });
    }
    
    session = newSession;
  }
  
  // Check if blocked or exceeded limit
  if (session.blocked) {
    return res.status(403).json({
      error: 'Session blocked',
      reason: session.blocked_reason,
      message: 'Please create a free account to continue using the service.'
    });
  }
  
  if (session.questions_asked >= session.max_questions) {
    return res.status(429).json({
      error: 'Question limit exceeded',
      message: 'Anonymous users can ask 1 question. Please create a free account for 100 PT/month.',
      questionsAsked: session.questions_asked,
      maxQuestions: session.max_questions
    });
  }
  
  // Process request with Core model only
  const systemPrompt = AGENT_PROMPTS[agent] || AGENT_PROMPTS.commander;
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048, // Limited for anonymous
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });
    
    const assistantMessage = response.content[0].text;
    const ptUsed = 3; // Fixed 3 PT for anonymous (medium response)
    
    // Update session
    await supabase
      .from('anonymous_sessions')
      .update({
        questions_asked: session.questions_asked + 1,
        pt_used: session.pt_used + ptUsed,
        last_active_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    return res.status(200).json({
      response: assistantMessage,
      agent,
      model: 'claude-3-haiku-20240307',
      modelClass: 'core',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        ptConsumed: ptUsed
      },
      anonymousStatus: {
        questionsAsked: session.questions_asked + 1,
        questionsRemaining: session.max_questions - (session.questions_asked + 1),
        message: session.questions_asked + 1 >= session.max_questions 
          ? 'This was your last free question. Create an account for 100 PT/month!'
          : null
      }
    });
    
  } catch (error) {
    console.error('Anonymous request error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

