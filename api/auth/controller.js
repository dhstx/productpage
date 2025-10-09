// Authentication Controller
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Register new user
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if user exists
  const existingUser = await db.users.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create user
  const user = await db.users.create({
    email,
    name: name || email.split('@')[0],
    password_hash
  });

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url
    }
  });
});

/**
 * Login with email and password
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = await db.users.findByEmail(email);
  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login
  await db.users.update(user.id, {
    last_login_at: new Date()
  });

  // Generate token
  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url
    }
  });
});

/**
 * Logout (client-side token removal)
 */
export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logout successful' });
});

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await db.users.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get subscription
  const subscription = await db.subscriptions.findByUserId(userId);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      created_at: user.created_at
    },
    subscription: subscription ? {
      plan_id: subscription.plan_id,
      status: subscription.status,
      current_period_end: subscription.current_period_end
    } : null
  });
});

/**
 * Google OAuth - Get authorization URL
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });

  res.json({ url: authUrl });
});

/**
 * Google OAuth - Callback handler
 */
export const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Find or create user
    let user = await db.users.findByGoogleId(data.id);

    if (!user) {
      // Check if user exists with this email
      user = await db.users.findByEmail(data.email);

      if (user) {
        // Link Google account to existing user
        user = await db.users.update(user.id, {
          google_id: data.id,
          avatar_url: data.picture || user.avatar_url
        });
      } else {
        // Create new user
        user = await db.users.create({
          email: data.email,
          name: data.name,
          google_id: data.id,
          avatar_url: data.picture
        });
      }
    }

    // Update last login
    await db.users.update(user.id, {
      last_login_at: new Date()
    });

    // Generate token
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.APP_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.APP_URL}/login?error=oauth_failed`);
  }
});

/**
 * Refresh token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    // Verify old token (ignore expiration)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    // Get user
    const user = await db.users.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

