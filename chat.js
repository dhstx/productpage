// AI Agent Chat API
// Handles user chat requests through the orchestrator

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleUserRequest, getUserSessions, getSession } from '../services/orchestrator.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/agents/chat
 * Send a message to the AI agent system
 */
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, sessionId, agentId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Use provided sessionId or create a new one
    const activeSessionId = sessionId || uuidv4();

    // Handle the request through orchestrator
    const result = await handleUserRequest(
      message.trim(),
      userId,
      activeSessionId,
      agentId // Optional: specific agent selected by user
    );

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
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred processing your request',
      message: error.message
    });
  }
});

/**
 * GET /api/agents/sessions
 * Get user's conversation sessions
 */
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    const sessions = await getUserSessions(userId, limit);

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred fetching sessions'
    });
  }
});

/**
 * GET /api/agents/sessions/:sessionId
 * Get a specific conversation session
 */
router.get('/sessions/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await getSession(sessionId);

    // Verify session belongs to user
    if (session && session.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred fetching the session'
    });
  }
});

export default router;

