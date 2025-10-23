/**
 * Billing Routes - Express Router
 */

import express from 'express';
import billingHistoryHandler from '../billing/history.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All billing routes require authentication
router.use(requireAuth);

// GET /api/billing/history - Get billing history
router.get('/history', billingHistoryHandler);

export default router;

