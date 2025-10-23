/**
 * Dashboard Routes - Express Router
 */

import express from 'express';
import dashboardStatsHandler from '../dashboard/stats.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(requireAuth);

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', dashboardStatsHandler);

export default router;

