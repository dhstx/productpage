// AI Agent routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { executeAgent, getAgentStatus, listAgents, getAgentLogs } from './execute.js';

const router = express.Router();

// All agent routes require authentication
router.use(requireAuth);

// List all available agents
router.get('/', listAgents);

// Execute an agent
router.post('/:agentId/execute', executeAgent);

// Get agent status
router.get('/:agentId/status', getAgentStatus);

// Get user's agent execution logs
router.get('/logs', getAgentLogs);

export default router;
