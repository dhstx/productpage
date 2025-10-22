// AI Agent Chat API
// Handles user chat requests through the MULTI-AGENT orchestrator

import express from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { requireAuth } from '../middleware/auth.js';
import { handleUserRequest } from '../services/orchestration.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Rate limiter for chat endpoints
const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later."
  }
});

/**
 * POST /api/agents/chat
 * Send a message to the AI agent system with multi-agent orchestration
 */
router.post('/chat', optionalAuth, chatRateLimiter, async (req, res) => {
  try {
    const { message, sessionId, agentId } = req.body;
    const userId = req.user?.id || 'guest-' + Date.now();

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Use provided sessionId or create a new one
    const activeSessionId = sessionId || uuidv4();

    // Build request object for orchestration
    const request = {
      request_id: uuidv4(),
      user_id: userId,
      message: message.trim(),
      context: {
        user_integrations: [], // TODO: Fetch from database
        conversation_history: [],
        user_tier: req.user?.tier || 'free',
        preferred_agent: agentId // If user selected specific agent
      }
    };

    // Handle the request through multi-agent orchestration
    const result = await handleUserRequest(request);

    // Format response based on result type
    if (result.type === 'success') {
      res.json({
        success: true,
        data: {
          sessionId: activeSessionId,
          agent: result.report.lead_agent,
          response: result.report.summary,
          report: result.report,
          metadata: result.report.metadata
        }
      });
    } else if (result.type === 'clarification_needed') {
      res.json({
        success: true,
        data: {
          sessionId: activeSessionId,
          needsClarification: true,
          question: result.question
        }
      });
    } else if (result.type === 'integrations_required') {
      res.json({
        success: true,
        data: {
          sessionId: activeSessionId,
          needsIntegrations: true,
          missing: result.missing,
          canProceedPartially: result.can_proceed_partially
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Unknown error occurred'
      });
    }

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
router.get('/sessions', optionalAuth, chatRateLimiter, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const limit = parseInt(req.query.limit) || 20;

    // TODO: Implement session fetching from database
    const sessions = [];

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
router.get('/sessions/:sessionId', requireAuth, chatRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // TODO: Implement session fetching from database
    const session = null;

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

