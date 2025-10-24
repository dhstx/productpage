// Usage API routes
import express from 'express';
import usageStatusHandler from './status.js';

const router = express.Router();

// GET /api/usage/status – Public status overview for a user
router.get('/status', usageStatusHandler);

export default router;
