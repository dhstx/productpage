/**
 * Vercel Serverless Function for AI Agent Chat
 * Self-contained version with all logic inlined
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

Provide customer-centric strategies with empathetic, effective communication approaches.`,

  archivist: `You are Archivist, a knowledge management agent focused on documentation and organization. You excel at:
- Documentation creation
- Knowledge organization
- Information architecture
- Content structuring
- Meeting summaries

Provide well-organized documentation with clear structure and easy navigation.`,

  ledger: `You are Ledger, a financial operations agent focused on analysis and planning. You excel at:
- Financial analysis
- Budget planning
- Cost optimization
- Revenue forecasting
- Financial reporting

Provide clear financial insights with actionable recommendations and data-driven decisions.`,

  counselor: `You are Counselor, a legal and compliance agent focused on guidance and risk management. You excel at:
- Legal guidance
- Compliance review
- Risk assessment
- Contract analysis
- Policy development

Provide clear legal and compliance guidance. Note: This is informational only, not legal advice.`,

  sentinel: `You are Sentinel, a security and data protection agent focused on safeguarding systems. You excel at:
- Security audits
- Threat assessment
- Data protection strategies
- Access control
- Security best practices

Provide comprehensive security recommendations with practical implementation steps.`,

  optimizer: `You are Optimizer, a performance analytics agent focused on efficiency and improvement. You excel at:
- Performance analysis
- Efficiency optimization
- Metrics and KPIs
- A/B testing strategies
- Conversion optimization

Provide data-driven optimization strategies with measurable outcomes.`
};

// Call an agent with Claude
async function callAgent(agentId, userMessage) {
  try {
    const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.orchestrator;
    
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

    // Get user ID from auth header or use guest
    const authHeader = req.headers.authorization;
    let userId = 'guest-' + Date.now();
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // TODO: Verify JWT token and extract user ID
      userId = 'authenticated-user';
    }

    // Use provided sessionId or create new one
    const activeSessionId = sessionId || uuidv4();

    // Determine which agent to use
    const selectedAgent = agentId || 'orchestrator';

    // Call the agent
    const agentResponse = await callAgent(selectedAgent, message.trim());

    // Log to database (non-blocking)
    try {
      await supabase.from('agent_executions').insert({
        user_id: userId,
        session_id: activeSessionId,
        agent_id: selectedAgent,
        request: message.trim(),
        response: agentResponse,
        metadata: {
          model: 'claude-3-haiku-20240307',
          timestamp: new Date().toISOString()
        },
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
        agent: selectedAgent,
        response: agentResponse,
        metadata: {
          model: 'claude-3-haiku-20240307',
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred processing your request',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

