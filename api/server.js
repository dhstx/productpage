// DHStx Backend API Server
// Express.js server for handling authentication, subscriptions, and agent execution

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './auth/routes.js';
import stripeRoutes from './stripe/routes.js';
import agentRoutes from './agents/routes.js';
import agentChatRoutes from './agents/chat.js';
import subscriptionRoutes from './subscriptions/routes.js';
import userRoutes from './users/routes.js';
import statusRoutes from './status/routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/agents', agentChatRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/status', statusRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DHStx API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;

