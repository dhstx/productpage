// Test chat endpoint (no auth required) - FOR TESTING ONLY
// DO NOT USE IN PRODUCTION

import express from 'express';
import { handleUserRequest } from '../services/orchestrator.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/test/chat
 * Test endpoint for agent system (no auth required)
 * FOR DEVELOPMENT/TESTING ONLY
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, agentId } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Use test user ID
    const userId = 'test-user-' + uuidv4();
    const activeSessionId = sessionId || uuidv4();

    console.log(`\n📤 Test Chat Request:`);
    console.log(`   Message: "${message.trim()}"`);
    console.log(`   Session: ${activeSessionId}`);
    console.log(`   Agent: ${agentId || 'auto-routed'}`);

    // Handle the request through orchestrator
    const result = await handleUserRequest(
      message.trim(),
      userId,
      activeSessionId,
      agentId
    );

    console.log(`✅ Response from ${result.agent.name}:`);
    console.log(`   Execution time: ${result.metadata.executionTime}ms`);
    console.log(`   Tokens used: ${result.metadata.tokensUsed}`);
    console.log(`   Model: ${result.metadata.model}\n`);

    res.json({
      success: result.success,
      data: {
        sessionId: activeSessionId,
        agent: result.agent,
        response: result.response,
        metadata: result.metadata
      }
    });

  } catch (error) {
    console.error('❌ Test Chat API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;

