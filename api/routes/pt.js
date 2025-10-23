/**
 * PT (Processing Time) Routes - Express Router
 */

import express from 'express';
import ptUsageHandler from '../pt/usage.js';
import ptEstimateHandler from '../pt/estimate.js';
import ptCheckThrottlesHandler from '../pt/check-throttles.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All PT routes require authentication
router.use(requireAuth);

// GET /api/pt/usage - Get PT usage statistics
router.get('/usage', ptUsageHandler);

// POST /api/pt/estimate - Estimate PT cost for a request
router.post('/estimate', ptEstimateHandler);

// GET /api/pt/check-throttles - Check current throttle status
router.get('/check-throttles', ptCheckThrottlesHandler);

export default router;

