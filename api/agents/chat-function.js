import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Agent prompts
const agentPrompts = {
  orchestrator: "You are the Orchestrator, the central intelligence hub...",
  commander: "You are the Commander, providing strategic leadership...",
  conductor: "You are the Conductor, managing operations and tasks...",
  scout: "You are the Scout, conducting research and competitive intelligence...",
  builder: "You are the Builder, a technical development expert...",
  muse: "You are the Muse, a creative design specialist...",
  echo: "You are Echo, a marketing and communications expert...",
  connector: "You are the Connector, managing customer relations...",
  archivist: "You are the Archivist, managing knowledge and documentation...",
  ledger: "You are the Ledger, handling financial operations...",
  counselor: "You are the Counselor, providing legal and compliance guidance...",
  sentinel: "You are the Sentinel, ensuring security and data protection...",
  optimizer: "You are the Optimizer, analyzing performance and optimization..."
};

// Model selection
function getModelForAgent(agentId) {
  const agentId_lower = agentId.toLowerCase();
  
  if (['commander', 'counselor'].includes(agentId_lower)) {
    return { provider: 'anthropic', model: 'claude-3-haiku-20240307' };
  }
  
  if (['builder', 'muse', 'echo'].includes(agentId_lower)) {
    return { provider: 'openai', model: 'gpt-4-turbo-preview' };
  }
  
  return { provider: 'anthropic', model: 'claude-3-haiku-20240307' };
}

// Execute agent
async function executeAgent(agentId, userMessage, sessionId) {
  const { provider, model } = getModelForAgent(agentId);
  const systemPrompt = agentPrompts[agentId.toLowerCase()] || agentPrompts.orchestrator;
  
  try {
    if (provider === 'anthropic') {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });
      
      return {
        content: response.content[0].text,
        model,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        }
      };
    } else {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2048,
      });
      
      return {
        content: response.choices[0].message.content,
        model,
        usage: {
          input_tokens: response.usage.prompt_tokens,
          output_tokens: response.usage.completion_tokens,
        }
      };
    }
  } catch (error) {
    console.error('Agent execution error:', error);
    throw error;
  }
}

// Main handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message, agentId = 'orchestrator', sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Execute agent
    const result = await executeAgent(agentId, message, sessionId);
    
    // Log to database (non-blocking)
    try {
      await supabase.from('agent_executions').insert({
        agent_id: agentId,
        session_id: sessionId,
        user_message: message,
        agent_response: result.content,
        model: result.model,
        tokens_used: result.usage.input_tokens + result.usage.output_tokens,
      });
    } catch (dbError) {
      console.error('Database logging error:', dbError);
    }
    
    return res.status(200).json({
      success: true,
      agent: agentId,
      response: result.content,
      metadata: {
        model: result.model,
        usage: result.usage,
      }
    });
    
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
}
