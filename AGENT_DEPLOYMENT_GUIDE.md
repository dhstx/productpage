# DHStx AI Agent System - Deployment Guide

## Phase 1: Core Infrastructure ✅ COMPLETED

This guide will help you deploy the enhanced AI agent system to your dhstx.co website.

---

## What Was Implemented

### 1. Backend Services ✅
- **Agent Executor** (`api/services/agentExecutor.js`): Executes agents using Claude/GPT-4
- **Orchestrator** (`api/services/orchestrator.js`): Routes requests to appropriate agents
- **Agent Prompts** (`api/services/agentPrompts.js`): System prompts for all 13 agents
- **Chat API** (`api/agents/chat.js`): REST API endpoints for frontend

### 2. Agent Configuration ✅
- **Enhanced Agents** (`src/lib/agents.js`): 13 specialized agents with full metadata
- **Intelligent Routing**: Automatic agent selection based on user intent
- **A2A Protocol**: Foundation for agent-to-agent communication

### 3. Database Schema ✅
- **SQL Migration** (`supabase-agent-schema.sql`): Complete database schema
- Tables: `agent_executions`, `conversation_sessions`, `agent_metrics`, `agent_feedback`
- Row Level Security (RLS) policies configured

### 4. Dependencies ✅
- `@anthropic-ai/sdk`: Anthropic Claude API client
- `openai`: OpenAI GPT-4 API client
- `uuid`: UUID generation for sessions

---

## Deployment Steps

### Step 1: Set Up Environment Variables

1. Copy the agent system variables to your `.env` file:

```bash
cp .env.agent-system .env.local
```

2. Update with your actual API keys:
   - Get Anthropic API key from: https://console.anthropic.com/
   - OpenAI API key is already configured (you have `OPENAI_API_KEY`)
   - Supabase keys are already configured

### Step 2: Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-agent-schema.sql`
4. Paste and run the SQL script
5. Verify tables were created successfully

### Step 3: Install Dependencies

```bash
npm install
```

Dependencies are already installed:
- ✅ @anthropic-ai/sdk
- ✅ openai
- ✅ uuid

### Step 4: Test the API Locally

1. Start the API server:

```bash
npm run dev
```

2. Test the health endpoint:

```bash
curl http://localhost:3001/health
```

3. Test the chat endpoint (requires authentication):

```bash
curl -X POST http://localhost:3001/api/agents/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Help me develop a strategic plan for Q1",
    "sessionId": "test-session-123"
  }'
```

### Step 5: Update Frontend (Next Phase)

The frontend needs to be updated to use the new agent system. This includes:

1. **Agent Selection UI**: Update the "Select Agent" dropdown with all 13 agents
2. **Chat Interface**: Connect to the new `/api/agents/chat` endpoint
3. **Session Management**: Implement conversation session tracking
4. **Streaming Responses**: Add real-time streaming for better UX

---

## API Endpoints

### POST `/api/agents/chat`
Send a message to the AI agent system.

**Request:**
```json
{
  "message": "Your message here",
  "sessionId": "optional-session-id",
  "agentId": "optional-specific-agent-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "agent": {
      "id": "commander",
      "name": "Commander"
    },
    "response": "Agent's response here",
    "metadata": {
      "model": "claude-3-opus-20240229",
      "provider": "anthropic",
      "executionTime": 1234,
      "tokensUsed": 567,
      "timestamp": "2025-10-21T..."
    }
  }
}
```

### GET `/api/agents/sessions`
Get user's conversation sessions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Strategic Planning Discussion",
      "last_agent_id": "commander",
      "message_count": 15,
      "created_at": "2025-10-21T...",
      "updated_at": "2025-10-21T..."
    }
  ]
}
```

### GET `/api/agents/sessions/:sessionId`
Get a specific conversation session.

---

## Agent Routing Logic

The Orchestrator automatically routes requests based on keywords:

| Keywords | Agent | Example |
|----------|-------|---------|
| strategy, strategic, vision, investor | **Commander** | "Help me develop our Q1 strategy" |
| task, schedule, meeting, deadline | **Conductor** | "Schedule a team meeting for next week" |
| research, competitive, market, trend | **Scout** | "Research our top 3 competitors" |
| develop, code, build, api, technical | **Builder** | "Build a REST API for user management" |
| design, creative, visual, brand, video | **Muse** | "Design a logo for our new product" |
| marketing, campaign, social media, seo | **Echo** | "Create a social media campaign" |
| customer, client, support, feedback | **Connector** | "Draft a response to this customer inquiry" |
| document, sop, knowledge, archive | **Archivist** | "Create an SOP for onboarding" |
| financial, budget, invoice, expense | **Ledger** | "Generate a P&L report for Q3" |
| legal, contract, compliance, policy | **Counselor** | "Review this vendor contract" |
| security, threat, vulnerability, privacy | **Sentinel** | "Audit our security policies" |
| analytics, performance, optimize, data | **Optimizer** | "Analyze our conversion funnel" |

Users can also explicitly select an agent using the `agentId` parameter.

---

## Cost Monitoring

### Estimated Costs (per 1,000 requests)

| Model | Avg Tokens | Cost per 1K | Monthly (10K requests) |
|-------|------------|-------------|------------------------|
| Claude 3.5 Sonnet | 2,000 | $0.006 | $60 |
| Claude 3 Opus | 2,500 | $0.038 | $380 (for Commander/Counselor only) |
| GPT-4 Turbo | 1,500 | $0.015 | $150 (for Builder/Muse/Echo only) |

**Blended Cost Estimate**: ~$120-150/month for 10,000 agent executions

### Monitor Usage

Query your database to track token usage:

```sql
SELECT 
  agent_id,
  COUNT(*) as total_requests,
  SUM(tokens_used) as total_tokens,
  AVG(execution_time_ms) as avg_response_time
FROM agent_executions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY agent_id
ORDER BY total_requests DESC;
```

---

## Testing Checklist

### Backend Tests
- [ ] Health endpoint responds
- [ ] Chat endpoint accepts authenticated requests
- [ ] Orchestrator routes to correct agents
- [ ] Agent executor calls Claude/GPT-4 successfully
- [ ] Conversation history is saved to Supabase
- [ ] Session management works correctly

### Agent Tests
Test each agent with appropriate prompts:

- [ ] **Orchestrator**: "What can you help me with?"
- [ ] **Commander**: "Help me develop a strategic plan"
- [ ] **Conductor**: "Create a project timeline"
- [ ] **Scout**: "Research AI trends in 2025"
- [ ] **Builder**: "Write a Python function to validate emails"
- [ ] **Muse**: "Design a modern landing page"
- [ ] **Echo**: "Create a marketing campaign"
- [ ] **Connector**: "Draft a customer support response"
- [ ] **Archivist**: "Summarize this meeting transcript"
- [ ] **Ledger**: "Calculate monthly burn rate"
- [ ] **Counselor**: "Review this NDA"
- [ ] **Sentinel**: "Audit our authentication system"
- [ ] **Optimizer**: "Analyze our signup conversion rate"

---

## Troubleshooting

### Issue: "Agent not found" error
**Solution**: Ensure `src/lib/agents.js` is using the enhanced version

### Issue: "Anthropic API error"
**Solution**: Verify `ANTHROPIC_API_KEY` is set correctly in `.env`

### Issue: "OpenAI API error"
**Solution**: Verify `OPENAI_API_KEY` and `OPENAI_API_BASE` are set

### Issue: Database connection error
**Solution**: Check Supabase credentials and ensure tables are created

### Issue: "Unauthorized" error
**Solution**: Ensure user is authenticated and JWT token is valid

---

## Next Steps

### Phase 2: Frontend Integration (Week 2)
1. Update agent selection UI
2. Connect chat interface to new API
3. Implement streaming responses
4. Add conversation history view
5. Create agent performance dashboard

### Phase 3: Advanced Features (Week 3-4)
1. Implement agent-to-agent communication
2. Add multi-agent workflows
3. Create agent analytics dashboard
4. Implement user feedback system
5. Add cost monitoring and alerts

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the agent execution logs in Supabase
3. Check API server logs for errors
4. Review the implementation code in `api/services/`

---

## Files Created/Modified

### New Files
- ✅ `api/services/agentExecutor.js`
- ✅ `api/services/orchestrator.js`
- ✅ `api/services/agentPrompts.js`
- ✅ `api/agents/chat.js`
- ✅ `src/lib/agents-enhanced.js`
- ✅ `supabase-agent-schema.sql`
- ✅ `.env.agent-system`
- ✅ `AGENT_DEPLOYMENT_GUIDE.md`

### Modified Files
- ✅ `api/server.js` (added chat routes)
- ✅ `src/lib/agents.js` (replaced with enhanced version)
- ✅ `package.json` (added dependencies)

### Backup Files
- ✅ `src/lib/agents-old.js` (original agents.js backup)

---

**Status**: Phase 1 Complete ✅  
**Ready for**: Database setup and API testing  
**Next**: Frontend integration


