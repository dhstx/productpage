// DHStx Status API Routes
// Provides real-time system status monitoring endpoints

import express from 'express';
import { getSystemStatus, getUptimeHistory, getIncidentHistory } from './controller.js';

const router = express.Router();

// Get current system status
router.get('/current', getSystemStatus);

// Get uptime history (90 days)
router.get('/uptime', getUptimeHistory);

// Get incident history
router.get('/incidents', getIncidentHistory);

export default router;

