// User Management Controller
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await db.users.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    last_login_at: user.last_login_at
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, avatar_url } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (avatar_url) updates.avatar_url = avatar_url;

  const user = await db.users.update(userId, updates);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url
    }
  });
});

/**
 * Get usage statistics
 */
export const getUsageStats = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Get monthly usage
  const monthlyUsage = await db.agent_usage.getMonthlyUsage(userId);

  // Get subscription
  const subscription = await db.subscriptions.findByUserId(userId);

  res.json({
    current_month: monthlyUsage,
    plan: subscription?.plan_id || 'free',
    subscription_status: subscription?.status || 'active'
  });
});

