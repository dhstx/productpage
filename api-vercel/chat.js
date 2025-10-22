// Vercel Serverless Function for AI Agent Chat
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Agent system prompts
const AGENT_PROMPTS = {
  orchestrator: "You are the Orchestrator, a central intelligence hub that analyzes user requests and routes them to the most appropriate specialist agent. You coordinate multi-agent workflows and ensure seamless collaboration.",
  commander: "You are the Commander, a strategic leadership agent focused on high-level planning, executive decision-making, and organizational strategy.",
  conductor: "You are the Conductor, an operations management agent that handles task coordination, project management, and workflow optimization.",
  scout: "You are the Scout, a research and competitive intelligence agent that gathers market insights, analyzes trends, and provides data-driven recommendations.",
  builder: "You are the Builder, a technical development agent specialized in coding, architecture, and software engineering.",
  muse: "You are the Muse, a creative design agent focused on visual design, branding, and multimedia content creation.",
  echo: "You are Echo, a marketing and communications agent that handles campaigns, messaging, and brand voice.",
  connector: "You are the Connector, a customer relations agent focused on engagement, support, and relationship management.",
  archivist: "You are the Archivist, a knowledge management agent that organizes information, maintains documentation, and ensures data accessibility.",
  ledger: "You are the Ledger, a financial operations agent handling budgets, forecasting, and financial analysis.",
  counselor: "You are the Counselor, a legal and compliance agent providing guidance on regulations, contracts, and risk management.",
  sentinel: "You are the Sentinel, a security and data protection agent focused on cybersecurity, privacy, and threat detection.",
  optimizer: "You are the Optimizer, a performance analytics agent that monitors metrics, identifies improvements, and drives efficiency."
};

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

    // Default to orchestrator if no agent specified
    const selectedAgent = agentId || 'orchestrator';
    const systemPrompt = AGENT_PROMPTS[selectedAgent] || AGENT_PROMPTS.orchestrator;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message.trim()
        }
      ]
    });

    // Extract response text
    const responseText = response.content[0]?.text || 'No response generated';

    return res.status(200).json({
      success: true,
      data: {
        sessionId: sessionId || `session-${Date.now()}`,
        agent: selectedAgent,
        response: responseText,
        metadata: {
          model: 'claude-3-haiku-20240307',
          tokens: response.usage?.total_tokens || 0
        }
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

