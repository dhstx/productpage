/**
 * Subscription Routes - Express Router
 */

import express from 'express';
import subscriptionCurrentHandler from '../subscription/current.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All subscription routes require authentication
router.use(requireAuth);

// GET /api/subscription/current - Get current subscription details
router.get('/current', subscriptionCurrentHandler);

export default router;

