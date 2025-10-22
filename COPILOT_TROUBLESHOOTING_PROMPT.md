# GitHub Copilot / Cursor AI Troubleshooting Prompt

## Context

I have a Next.js/React application deployed on Vercel with a multi-agent AI system. Users are getting "Error: An error occurred processing your request" when trying to chat with agents.

## System Architecture

- **Frontend**: React with AIChatInterface component
- **Backend**: Vercel serverless function at `/api/agents/chat.mjs`
- **AI**: Multi-agent orchestration system using Anthropic Claude
- **Database**: Supabase for logging and session management
- **Deployment**: Vercel (production)

## Current Error

When users send a message to an agent, they receive:
```
Error: An error occurred processing your request
```

The error appears in the chat interface as a red error bubble.

## Files Involved

1. **Frontend**: `src/components/AIChatInterface.jsx` - Chat UI component
2. **API Client**: `src/lib/api/agentClient.js` - Calls `/api/agents/chat`
3. **Serverless Function**: `api/agents/chat.mjs` - Vercel function handler
4. **Orchestration**: `api/services/orchestration.js` - Multi-agent logic
5. **Agent Prompts**: `api/services/prompts.js` - System prompts for agents
6. **Configuration**: `api/services/config.js` - Agent capabilities and routing

## What I Need You To Do

Please analyze the codebase and help me:

### 1. **Identify the Root Cause**
- Check if all required environment variables are present
- Verify all imports are valid and modules exist
- Check for syntax errors or runtime errors
- Validate API response structure matches frontend expectations
- Check if orchestration.js can be imported in Vercel serverless context

### 2. **Check Environment Variables**
Required in Vercel:
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_API_BASE` - OpenAI API base URL
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key

### 3. **Verify Dependencies**
Check `package.json` includes:
- `@anthropic-ai/sdk`
- `@supabase/supabase-js`
- `uuid`
- All other required packages

### 4. **Check Import Paths**
In `api/agents/chat.mjs`:
- Can it import from `./prompts.js`?
- Are relative imports working in Vercel?
- Should imports use absolute paths?

### 5. **Validate Response Structure**
Frontend expects:
```javascript
{
  success: true,
  data: {
    sessionId: string,
    agent: string,
    response: string,
    metadata: object
  }
}
```

Does the API return this structure?

### 6. **Check Error Handling**
- Are errors being caught and logged?
- Is the error message being returned to frontend?
- Can we see more detailed error info?

## Specific Questions

1. **Is `api/services/orchestration.js` being bundled correctly by Vercel?**
   - Vercel serverless functions have size limits
   - Complex imports might fail

2. **Should I inline the orchestration logic into `chat.mjs`?**
   - Would avoid import issues
   - But makes code harder to maintain

3. **Are there any Vercel-specific issues with ES modules?**
   - `.mjs` extension should work
   - But are dynamic imports needed?

4. **Is the Anthropic API being called correctly?**
   - Check API key format
   - Check model name
   - Check request structure

5. **Is Supabase connection working?**
   - Non-blocking logging might be failing
   - But shouldn't cause main request to fail

## Expected Behavior

When a user sends "Create a project timeline":
1. Frontend calls `/api/agents/chat` with message
2. Serverless function receives request
3. Calls `handleUserRequest()` from orchestration.js
4. Orchestrator analyzes request
5. Routes to appropriate agent (Conductor)
6. Agent generates response using Claude
7. Response returned to frontend
8. Displayed in chat interface

## What's Working

- ✅ Frontend UI loads correctly
- ✅ Agent selector shows all 13 agents
- ✅ User can type and send messages
- ✅ API endpoint is being called (no 404)
- ✅ Error is being caught and displayed

## What's NOT Working

- ❌ Agent responses not being generated
- ❌ Generic error message (no details)
- ❌ Unknown root cause

## Debugging Steps To Try

Please suggest:

1. **How to add more detailed error logging** in chat.mjs
2. **How to test the serverless function locally** before deploying
3. **How to check Vercel function logs** for detailed errors
4. **Simplified version of chat.mjs** that works without orchestration (for testing)
5. **Alternative approaches** if current architecture won't work on Vercel

## Code Snippets To Review

### Frontend API Call (agentClient.js)
```javascript
export async function sendMessage(message, agentId = null, sessionId = null) {
  const response = await fetch(`/api/agents/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agentId, sessionId }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: `HTTP ${response.status}` 
    }));
    throw new Error(error.error || 'Failed to send message');
  }
  
  return await response.json();
}
```

### Serverless Function (chat.mjs - simplified)
```javascript
export default async function handler(req, res) {
  try {
    const { message, agentId, sessionId } = req.body;
    
    // Validation
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message required' });
    }
    
    // Call orchestration
    const result = await handleUserRequest(message, userId, sessionId, agentId);
    
    return res.status(200).json({
      success: true,
      data: {
        sessionId: sessionId || uuidv4(),
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
```

## Output Format

Please provide:

1. **Root cause analysis** - What's most likely causing the error
2. **Step-by-step fix** - Exact code changes needed
3. **Testing approach** - How to verify the fix works
4. **Alternative solutions** - If main approach won't work
5. **Prevention** - How to avoid this in future

## Additional Context

- This is a production deployment on Vercel
- The multi-agent system works in local testing
- Environment variables are set in Vercel dashboard
- Recent changes: Switched from Express API to Vercel serverless functions
- Using Anthropic Claude 3 Haiku model

---

**Please analyze this systematically and provide a comprehensive solution.**

