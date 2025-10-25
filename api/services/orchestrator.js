// Orchestrator Service
// Central intelligence hub that routes requests to appropriate agents

import { routeRequest } from '../lib/agents-enhanced.js';
import { executeAgent } from './agentExecutor.js';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Supabase credentials not found in environment variables');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

/**
 * Handle user request through the orchestrator
 * @param {string} userMessage - The user's message
 * @param {string} userId - The user's ID
 * @param {string} sessionId - The conversation session ID
 * @param {string} selectedAgentId - Optional: specific agent selected by user
 * @returns {Promise<object>} The agent's response with metadata
 */
export async function handleUserRequest(userMessage, userId, sessionId, selectedAgentId = null) {
  const startTime = Date.now();

  try {
    // Step 1: Determine which agent to use
    let selectedAgent;
    if (selectedAgentId) {
      // User explicitly selected an agent
      selectedAgent = { id: selectedAgentId };
    } else {
      // Use intelligent routing
      selectedAgent = routeRequest(userMessage);
    }

    // Step 2: Get conversation history
    const conversationHistory = await getConversationHistory(sessionId);

    // Step 3: Build context
    const context = {
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      conversationHistory
    };

    // Step 4: Execute the selected agent
    const result = await executeAgent(
      selectedAgent.id,
      userMessage,
      context
    );

    // Step 5: Log the execution
    await logAgentExecution({
      userId,
      sessionId,
      agentId: result.agentId,
      agentName: result.agentName,
      userMessage,
      agentResponse: result.response,
      model: result.model,
      provider: result.provider,
      tokensUsed: result.usage?.totalTokens || 0,
      executionTime: result.executionTime,
      success: result.success
    });

    // Step 6: Update session
    await updateSession(sessionId, userId, result.agentId);

    // Step 7: Return response
    return {
      success: result.success,
      agent: {
        id: result.agentId,
        name: result.agentName
      },
      response: result.response,
      metadata: {
        model: result.model,
        provider: result.provider,
        executionTime: result.executionTime,
        tokensUsed: result.usage?.totalTokens || 0,
        timestamp: result.timestamp
      }
    };

  } catch (error) {
    console.error('Orchestrator error:', error);
    
    return {
      success: false,
      error: error.message,
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      metadata: {
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Get conversation history for a session
 */
async function getConversationHistory(sessionId) {
  try {
    const { data, error } = await supabase
      .from('agent_executions')
      .select('user_message, agent_response, agent_id')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }

    // Convert to message format
    const history = [];
    for (const msg of data || []) {
      history.push({
        role: 'user',
        content: msg.user_message
      });
      history.push({
        role: 'assistant',
        content: msg.agent_response
      });
    }

    return history;
  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    return [];
  }
}

/**
 * Log agent execution to database
 */
async function logAgentExecution(executionData) {
  try {
    const { error } = await supabase
      .from('agent_executions')
      .insert({
        user_id: executionData.userId,
        session_id: executionData.sessionId,
        agent_id: executionData.agentId,
        agent_name: executionData.agentName,
        user_message: executionData.userMessage,
        agent_response: executionData.agentResponse,
        model_used: executionData.model,
        provider: executionData.provider,
        tokens_used: executionData.tokensUsed,
        execution_time_ms: executionData.executionTime,
        success: executionData.success
      });

    if (error) {
      console.error('Error logging agent execution:', error);
    }
  } catch (error) {
    console.error('Error in logAgentExecution:', error);
  }
}

/**
 * Update conversation session
 */
async function updateSession(sessionId, userId, lastAgentId) {
  try {
    // Check if session exists
    const { data: existingSession } = await supabase
      .from('conversation_sessions')
      .select('id, message_count')
      .eq('id', sessionId)
      .single();

    if (existingSession) {
      // Update existing session
      await supabase
        .from('conversation_sessions')
        .update({
          last_agent_id: lastAgentId,
          message_count: (existingSession.message_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } else {
      // Create new session
      await supabase
        .from('conversation_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          last_agent_id: lastAgentId,
          message_count: 1,
          title: 'New Conversation'
        });
    }
  } catch (error) {
    console.error('Error updating session:', error);
  }
}

/**
 * Get session information
 */
export async function getSession(sessionId) {
  try {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
}

/**
 * Get user's conversation sessions
 */
export async function getUserSessions(userId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    return [];
  }
}

export default {
  handleUserRequest,
  getSession,
  getUserSessions
};

