/**
 * Chat Routes - Express Router for AI Agent Chat
 * Wraps the chat-v3.mjs handler into Express routes
 */

import express from 'express';
import chatHandler from '../agents/chat-v3.mjs';

const router = express.Router();

// POST /api/chat - Main chat endpoint
// Supports both authenticated and anonymous users
router.post('/', chatHandler);

export default router;

