/**
 * DHStx Backend API Server
 * Express.js server for handling authentication, subscriptions, and agent execution
 * Last updated: 2025-10-23 23:32 UTC - Force redeploy for Stripe routes fix
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Ensure shared agents module is available in isolated API deploys
try {
  // Dynamic import allows graceful failure with helpful message
  await import('./lib/agents-enhanced.js');
} catch (err) {
  console.error('\u274c Missing shared module: ./lib/agents-enhanced.js');
  console.error('This file should be fetched during postinstall by ./scripts/fetch-shared.js');
  console.error('Hint: Ensure npm install ran and network access to GitHub is available.');
  console.error('Original error:', err?.message || err);
  process.exit(1);
}

// Import routes
import authRoutes from './auth/routes.js';
import stripeRoutes from './stripe/routes.js';
import agentRoutes from './agents/routes.js';
import chatRoutes from './routes/chat.js';
import usageRoutes from './usage/routes.js';
import dashboardRoutes from './routes/dashboard.js';
import billingRoutes from './routes/billing.js';
import ptRoutes from './routes/pt.js';
import subscriptionRoutes from './subscriptions/routes.js';
import subscriptionCurrentRoutes from './routes/subscription.js';
import userRoutes from './users/routes.js';
import statusRoutes from './status/routes.js';
import helpRoutes from './help/routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Load environment variables
dotenv.config({ path: '.env.backend' });
dotenv.config(); // Also load from .env if exists

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dhstx.co',
  'https://www.dhstx.co'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins during development
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Avoid noisy 404s for browsers requesting favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'DHStx API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      agents: '/api/agents',
      chat: '/api/chat',
      dashboard: '/api/dashboard',
      billing: '/api/billing',
      pt: '/api/pt',
      subscription: '/api/subscription',
      subscriptions: '/api/subscriptions',
      stripe: '/api/stripe',
      users: '/api/users',
      status: '/api/status'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/pt', ptRoutes);
app.use('/api/subscription', subscriptionCurrentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/help', helpRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      '/health',
      '/api/auth',
      '/api/agents',
      '/api/chat',
      '/api/dashboard',
      '/api/billing',
      '/api/pt',
      '/api/subscription',
      '/api/subscriptions',
      '/api/stripe',
      '/api/users',
      '/api/status'
    ]
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DHStx API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`✅ Server ready to accept connections`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;

