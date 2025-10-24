/**
 * Chat Routes - Express Router for AI Agent Chat
 * Wraps the chat-v3.mjs handler into Express routes
 */

import express from 'express';
import chatHandler from '../agents/chat-v3.mjs';
import { getUserSessions, getSession } from '../services/orchestrator.js';

const router = express.Router();

// POST /api/chat - Main chat endpoint
// Supports both authenticated and anonymous users
router.post('/', chatHandler);

// GET /api/chat/sessions?userId=...
// Returns recent sessions for the user; if no userId, return empty list
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.json({ success: true, data: [] });
    const sessions = await getUserSessions(userId, parseInt(req.query.limit) || 20);
    return res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

// GET /api/chat/sessions/:sessionId
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: session });
  } catch (error) {
    console.error('Session fetch error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch session' });
  }
});

export default router;

