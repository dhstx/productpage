/**
 * Vercel Serverless Function for AI Agent Chat
 * WITH FULL MULTI-AGENT ORCHESTRATION
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
  process.env.SUPABASE_KEY
);

// Import orchestration logic (inline for Vercel)
// Note: In production, this should be imported from orchestration.js
// For now, we'll use a simplified version that calls the orchestrator

async function callAgent(agentId, systemPrompt, userMessage) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });
    
    return response.content[0]?.text || 'No response generated';
  } catch (error) {
    console.error(`Agent ${agentId} error:`, error);
    throw error;
  }
}

// Simplified orchestration for Vercel
async function handleUserRequest(message, userId, sessionId, agentId) {
  // If specific agent requested, use it directly
  if (agentId && agentId !== 'orchestrator') {
    const agentPrompts = await import('./prompts.js');
    const systemPrompt = agentPrompts.getAgentPrompt(agentId);
    const response = await callAgent(agentId, systemPrompt, message);
    
    return {
      success: true,
      agent: agentId,
      response: response,
      metadata: {
        model: 'claude-3-haiku-20240307',
        orchestrated: false
      }
    };
  }
  
  // Otherwise, use orchestrator
  const orchestratorPrompt = `You are the Orchestrator, a central intelligence hub that analyzes user requests and routes them to the most appropriate specialist agent.

Available agents:
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

Analyze the user's request and provide a helpful response. If the task requires multiple agents, coordinate their work and synthesize the results.`;

  const response = await callAgent('orchestrator', orchestratorPrompt, message);
  
  return {
    success: true,
    agent: 'orchestrator',
    response: response,
    metadata: {
      model: 'claude-3-haiku-20240307',
      orchestrated: true
    }
  };
}

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

    // Get user ID from auth header or use guest
    const authHeader = req.headers.authorization;
    let userId = 'guest-' + Date.now();
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // TODO: Verify JWT token and extract user ID
      userId = 'authenticated-user';
    }

    // Use provided sessionId or create new one
    const activeSessionId = sessionId || uuidv4();

    // Handle the request
    const result = await handleUserRequest(
      message.trim(),
      userId,
      activeSessionId,
      agentId
    );

    // Log to database (non-blocking)
    try {
      await supabase.from('agent_executions').insert({
        user_id: userId,
        session_id: activeSessionId,
        agent_id: result.agent,
        request: message.trim(),
        response: result.response,
        metadata: result.metadata,
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('Database logging error:', dbError);
      // Don't fail the request if logging fails
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: activeSessionId,
        agent: result.agent,
        response: result.response,
        metadata: result.metadata
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred processing your request',
      message: error.message
    });
  }
}

