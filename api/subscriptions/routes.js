// Subscription management routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getSubscriptionStatus,
  cancelSubscription,
  reactivateSubscription,
  updateSubscription
} from './controller.js';

const router = express.Router();

// All subscription routes require authentication
router.use(requireAuth);

router.get('/status', getSubscriptionStatus);
router.post('/cancel', cancelSubscription);
router.post('/reactivate', reactivateSubscription);
router.post('/update', updateSubscription);

export default router;
