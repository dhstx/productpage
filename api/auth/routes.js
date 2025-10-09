// Authentication routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  googleAuth,
  googleCallback,
  refreshToken
} from './controller.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/me', requireAuth, getCurrentUser);

export default router;

