# Agent Execution Architecture for DHStx Platform

**Date:** October 21, 2025  
**Author:** Manus AI

---

## Executive Summary

This document outlines the recommended architecture for executing the 13 DHStx AI agents, leveraging your existing integrations and infrastructure. The solution combines **Anthropic Claude** (via your API key) as the primary reasoning engine, **OpenAI GPT-4** for specialized tasks, and your existing **Supabase** infrastructure for state management.

---

## 1. Available Options Analysis

Based on your environment, you have access to:

### Option A: Anthropic Claude API ✅ **RECOMMENDED**
- **Status**: API key configured (`ANTHROPIC_API_KEY`)
- **Models**: Claude 3.5 Sonnet, Claude 3 Opus
- **Strengths**: 
  - Superior reasoning and analysis
  - 200K context window (excellent for complex workflows)
  - Strong at following system prompts and maintaining persona
  - Multimodal capabilities (text, images, documents)
  - Cost-effective for high-volume usage
- **Best For**: Chief of Staff, Scout, Counselor, Optimizer, Archivist
- **Cost**: ~$3-15 per million tokens (depending on model)

### Option B: OpenAI API ✅ **AVAILABLE**
- **Status**: API key configured (`OPENAI_API_KEY`)
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5
- **Strengths**:
  - Excellent for creative tasks
  - Strong function calling capabilities
  - Good for structured output
  - Fast response times
- **Best For**: Muse, Echo, Connector, Builder (code generation)
- **Cost**: ~$10-30 per million tokens (GPT-4)

### Option C: Taskade MCP ⚠️ **LIMITED USE**
- **Status**: MCP server configured
- **Strengths**: Task management, workflow automation
- **Limitations**: Not a general AI execution platform
- **Best For**: Integration with Conductor for task management
- **Use Case**: Store and sync tasks, not execute AI reasoning

### Option D: Manus (This Platform) ⚠️ **NOT RECOMMENDED FOR PRODUCTION**
- **Status**: You're using it now
- **Limitations**: 
  - Not designed for embedded agent execution
  - No API for programmatic access from your app
  - Session-based, not suitable for real-time user requests
- **Use Case**: Development, prototyping, testing only

---

## 2. Recommended Architecture: Hybrid Multi-Model Approach

### 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DHStx Frontend (React)                    │
│                  User Interface & Chat UI                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js API Server (Backend)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Orchestrator Service (Node.js)             │    │
│  │  • Intent Classification                           │    │
│  │  • Agent Selection                                 │    │
│  │  • Context Management                              │    │
│  └──────────────┬─────────────────────────────────────┘    │
│                 │                                            │
│  ┌──────────────▼─────────────────────────────────────┐    │
│  │         Agent Execution Engine                     │    │
│  │                                                     │    │
│  │  ┌─────────────────┐    ┌─────────────────┐      │    │
│  │  │ Anthropic Claude│    │   OpenAI GPT-4  │      │    │
│  │  │   (Primary)     │    │  (Specialized)  │      │    │
│  │  └─────────────────┘    └─────────────────┘      │    │
│  │                                                     │    │
│  │  Agent-Specific System Prompts + Context          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (PostgreSQL)                       │
│  • Session State                                            │
│  • Conversation History                                     │
│  • Agent Execution Logs                                     │
│  • User Preferences                                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Agent-to-Model Mapping

| Agent | Primary Model | Reasoning |
|-------|--------------|-----------|
| **Orchestrator** | Claude 3.5 Sonnet | Fast routing, excellent at intent classification |
| **Chief of Staff** | Claude 3 Opus | Deep reasoning for strategic decisions |
| **Conductor** | Claude 3.5 Sonnet | Efficient task management, structured output |
| **Scout** | Claude 3.5 Sonnet | Superior research and analysis capabilities |
| **Builder** | GPT-4 | Excellent code generation and technical tasks |
| **Muse** | GPT-4 + DALL-E | Creative generation, design descriptions |
| **Echo** | GPT-4 | Marketing copy, persuasive writing |
| **Connector** | Claude 3.5 Sonnet | Empathetic, nuanced customer communication |
| **Archivist** | Claude 3.5 Sonnet | Document processing, summarization |
| **Ledger** | Claude 3.5 Sonnet | Precise financial calculations and reporting |
| **Counselor** | Claude 3 Opus | Complex legal reasoning |
| **Sentinel** | Claude 3.5 Sonnet | Security analysis, compliance checking |
| **Optimizer** | Claude 3.5 Sonnet | Data analysis, statistical reasoning |

---

## 3. Implementation Details

### 3.1 Agent Execution Service (Node.js)

```javascript
// /api/services/agentExecutor.js

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { getAgentById } from '../lib/agents-enhanced.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Agent system prompts
const AGENT_PROMPTS = {
  orchestrator: `You are the Orchestrator, the central intelligence hub of the DHStx platform...`,
  commander: `You are the Chief of Staff, providing executive-level strategic guidance...`,
  // ... (full prompts for each agent)
};

export async function executeAgent(agentId, userMessage, context = {}) {
  const agent = getAgentById(agentId);
  
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }
  
  const systemPrompt = AGENT_PROMPTS[agentId];
  
  // Determine which model to use
  const useOpenAI = ['builder', 'muse', 'echo'].includes(agentId);
  
  if (useOpenAI) {
    return await executeWithOpenAI(agent, systemPrompt, userMessage, context);
  } else {
    return await executeWithClaude(agent, systemPrompt, userMessage, context);
  }
}

async function executeWithClaude(agent, systemPrompt, userMessage, context) {
  const model = agent.id === 'commander' || agent.id === 'counselor' 
    ? 'claude-3-opus-20240229'
    : 'claude-3-5-sonnet-20241022';
  
  const response = await anthropic.messages.create({
    model: model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
  });
  
  return {
    agentId: agent.id,
    agentName: agent.name,
    response: response.content[0].text,
    model: model,
    usage: response.usage,
    timestamp: new Date().toISOString()
  };
}

async function executeWithOpenAI(agent, systemPrompt, userMessage, context) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });
  
  return {
    agentId: agent.id,
    agentName: agent.name,
    response: response.choices[0].message.content,
    model: 'gpt-4-turbo-preview',
    usage: response.usage,
    timestamp: new Date().toISOString()
  };
}
```

### 3.2 Orchestrator Routing Logic

```javascript
// /api/services/orchestrator.js

import { routeRequest } from '../lib/agents-enhanced.js';
import { executeAgent } from './agentExecutor.js';

export async function handleUserRequest(userMessage, userId, sessionId) {
  // Step 1: Route to appropriate agent
  const selectedAgent = routeRequest(userMessage);
  
  // Step 2: Build context
  const context = {
    userId,
    sessionId,
    timestamp: new Date().toISOString(),
    conversationHistory: await getConversationHistory(sessionId)
  };
  
  // Step 3: Execute agent
  const result = await executeAgent(
    selectedAgent.id,
    userMessage,
    context
  );
  
  // Step 4: Log execution
  await logAgentExecution(result, userId, sessionId);
  
  // Step 5: Return response
  return {
    agent: selectedAgent,
    response: result.response,
    metadata: {
      model: result.model,
      executionTime: result.executionTime,
      tokensUsed: result.usage
    }
  };
}
```

### 3.3 API Endpoint

```javascript
// /api/agents/chat.js

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleUserRequest } from '../services/orchestrator.js';

const router = express.Router();

router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;
    
    const result = await handleUserRequest(message, userId, sessionId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

---

## 4. State Management with Supabase

### 4.1 Database Schema

```sql
-- Agent execution logs
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id UUID NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  agent_name VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  model_used VARCHAR(50),
  tokens_used INTEGER,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation sessions
CREATE TABLE conversation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  last_agent_id VARCHAR(50),
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent performance metrics
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  total_executions INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER,
  total_tokens_used INTEGER,
  user_satisfaction_avg DECIMAL(3,2),
  UNIQUE(agent_id, date)
);
```

---

## 5. Cost Analysis

### 5.1 Estimated Monthly Costs (1,000 users, 10 requests/user/month)

| Component | Usage | Cost |
|-----------|-------|------|
| **Anthropic Claude** | 8,000 requests × 2K tokens avg | ~$120/month |
| **OpenAI GPT-4** | 2,000 requests × 1.5K tokens avg | ~$90/month |
| **Supabase** | Database + Auth | $25/month (Pro plan) |
| **Vercel** | Hosting + Serverless | $20/month (Pro plan) |
| **Total** | | **~$255/month** |

### 5.2 Cost Optimization Strategies

1. **Use Claude 3.5 Sonnet** for most agents (cheaper than Opus)
2. **Cache system prompts** to reduce token usage
3. **Implement response streaming** for better UX
4. **Rate limiting** per user to control costs
5. **Fallback to GPT-3.5** for simple queries

---

## 6. Advanced Features

### 6.1 Agent-to-Agent Communication

```javascript
// A2A Protocol implementation
export async function executeMultiAgentWorkflow(workflow) {
  const results = [];
  
  for (const step of workflow.steps) {
    const previousResults = results.filter(r => 
      step.dependencies.includes(r.stepId)
    );
    
    const context = {
      ...step.context,
      previousResults
    };
    
    const result = await executeAgent(
      step.agentId,
      step.message,
      context
    );
    
    results.push({
      stepId: step.id,
      agentId: step.agentId,
      result
    });
  }
  
  return results;
}
```

### 6.2 Streaming Responses

```javascript
// Streaming for real-time responses
export async function executeAgentStreaming(agentId, userMessage, context) {
  const agent = getAgentById(agentId);
  const systemPrompt = AGENT_PROMPTS[agentId];
  
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  
  return stream;
}
```

---

## 7. Integration with Existing Services

### 7.1 Taskade Integration (for Conductor)

```javascript
// Sync tasks with Taskade
import { execSync } from 'child_process';

export async function syncTasksWithTaskade(tasks) {
  const result = execSync(
    `manus-mcp-cli tool call create-task --server taskade --input '${JSON.stringify(tasks)}'`,
    { encoding: 'utf-8' }
  );
  
  return JSON.parse(result);
}
```

### 7.2 Notion Integration (for Archivist)

```javascript
// Store knowledge in Notion
export async function storeInNotionKnowledgeBase(content) {
  const result = execSync(
    `manus-mcp-cli tool call notion-create-page --server notion --input '${JSON.stringify(content)}'`,
    { encoding: 'utf-8' }
  );
  
  return JSON.parse(result);
}
```

---

## 8. Deployment Checklist

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- [ ] Install OpenAI SDK: `npm install openai`
- [ ] Create agent execution service
- [ ] Implement Orchestrator routing
- [ ] Set up Supabase tables
- [ ] Create API endpoints

### Phase 2: Agent Implementation (Week 3-4)
- [ ] Write system prompts for all 13 agents
- [ ] Implement agent executor with model selection
- [ ] Add conversation history management
- [ ] Implement logging and metrics

### Phase 3: Frontend Integration (Week 5-6)
- [ ] Update chat UI to display agent selection
- [ ] Implement streaming responses
- [ ] Add agent switching capability
- [ ] Create agent performance dashboard

### Phase 4: Testing & Optimization (Week 7-8)
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Cost monitoring and optimization
- [ ] Launch beta program

---

## 9. Recommendation Summary

**Primary Execution Engine**: **Anthropic Claude API**
- Use Claude 3.5 Sonnet for 10 agents (fast, cost-effective)
- Use Claude 3 Opus for Chief of Staff and Counselor (deep reasoning)
- Use OpenAI GPT-4 for Builder, Muse, Echo (specialized tasks)

**State Management**: **Supabase PostgreSQL**
- Conversation history
- Agent execution logs
- Performance metrics

**Orchestration**: **Custom Node.js Service**
- Intent classification
- Agent routing
- Context management
- A2A protocol implementation

**Estimated Cost**: **~$255/month** for 10,000 agent executions

This architecture gives you:
✅ **Full control** over agent behavior
✅ **Cost-effective** execution
✅ **Scalable** infrastructure
✅ **Production-ready** from day one

---

Would you like me to proceed with implementing this architecture in your codebase?

