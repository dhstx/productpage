// User management routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile, getUsageStats } from './controller.js';

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/usage', getUsageStats);

export default router;
