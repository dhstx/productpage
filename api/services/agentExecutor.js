// Agent Execution Service
// Handles execution of AI agents using Anthropic Claude and OpenAI APIs

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { getAgentById } from '../../src/lib/agents-enhanced.js';
import AGENT_PROMPTS from './agentPrompts.js';

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

// Agent-to-model mapping
const MODEL_MAPPING = {
  // Use Claude 3 Opus for deep reasoning
  commander: { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  counselor: { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  
  // Use GPT-4 for creative and code generation
  builder: { provider: 'openai', model: 'gpt-4-turbo-preview' },
  muse: { provider: 'openai', model: 'gpt-4-turbo-preview' },
  echo: { provider: 'openai', model: 'gpt-4-turbo-preview' },
  
  // Use Claude 3.5 Sonnet for everything else (fast and cost-effective)
  orchestrator: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  conductor: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  scout: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  connector: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  archivist: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  ledger: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  sentinel: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  optimizer: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
};

/**
 * Execute an AI agent with the given message and context
 * @param {string} agentId - The ID of the agent to execute
 * @param {string} userMessage - The user's message
 * @param {object} context - Additional context (conversation history, user info, etc.)
 * @returns {Promise<object>} The agent's response with metadata
 */
export async function executeAgent(agentId, userMessage, context = {}) {
  const startTime = Date.now();
  
  try {
    // Get agent configuration
    const agent = getAgentById(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Get system prompt
    const systemPrompt = AGENT_PROMPTS[agentId];
    if (!systemPrompt) {
      throw new Error(`System prompt for agent ${agentId} not found`);
    }

    // Get model configuration
    const modelConfig = MODEL_MAPPING[agentId];
    if (!modelConfig) {
      throw new Error(`Model configuration for agent ${agentId} not found`);
    }

    // Build conversation history
    const messages = buildMessages(userMessage, context);

    // Execute based on provider
    let result;
    if (modelConfig.provider === 'anthropic') {
      result = await executeWithClaude(agent, systemPrompt, messages, modelConfig.model, context);
    } else {
      result = await executeWithOpenAI(agent, systemPrompt, messages, modelConfig.model, context);
    }

    // Calculate execution time
    const executionTime = Date.now() - startTime;

    return {
      success: true,
      agentId: agent.id,
      agentName: agent.name,
      response: result.response,
      model: modelConfig.model,
      provider: modelConfig.provider,
      usage: result.usage,
      executionTime,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error executing agent ${agentId}:`, error);
    
    return {
      success: false,
      agentId,
      error: error.message,
      executionTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Execute agent using Anthropic Claude
 */
async function executeWithClaude(agent, systemPrompt, messages, model, context) {
  try {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
      temperature: 0.7,
    });

    return {
      response: response.content[0].text,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}

/**
 * Execute agent using OpenAI GPT-4
 */
async function executeWithOpenAI(agent, systemPrompt, messages, model, context) {
  try {
    // Convert messages to OpenAI format
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: model,
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    return {
      response: response.choices[0].message.content,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

/**
 * Build messages array from user message and conversation history
 */
function buildMessages(userMessage, context) {
  const messages = [];

  // Add conversation history if available
  if (context.conversationHistory && Array.isArray(context.conversationHistory)) {
    // Take last 10 messages to stay within context limits
    const recentHistory = context.conversationHistory.slice(-10);
    
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage
  });

  return messages;
}

/**
 * Execute agent with streaming response
 * @param {string} agentId - The ID of the agent to execute
 * @param {string} userMessage - The user's message
 * @param {object} context - Additional context
 * @returns {Promise<Stream>} A stream of response chunks
 */
export async function executeAgentStreaming(agentId, userMessage, context = {}) {
  const agent = getAgentById(agentId);
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  const systemPrompt = AGENT_PROMPTS[agentId];
  const modelConfig = MODEL_MAPPING[agentId];
  const messages = buildMessages(userMessage, context);

  if (modelConfig.provider === 'anthropic') {
    return await anthropic.messages.stream({
      model: modelConfig.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
      temperature: 0.7,
    });
  } else {
    return await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });
  }
}

export default {
  executeAgent,
  executeAgentStreaming
};

