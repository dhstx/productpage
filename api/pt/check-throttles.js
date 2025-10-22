import { createClient } from '@supabase/supabase-js';
import { checkThrottles } from '../services/throttleManager.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check all throttles
    const throttleResult = await checkThrottles(user.id);

    if (throttleResult.throttled) {
      return res.status(200).json({
        throttled: true,
        type: throttleResult.type,
        reason: throttleResult.reason,
        message: throttleResult.message,
        wait_until: throttleResult.waitUntil,
        current_usage: throttleResult.currentUsage,
        limit: throttleResult.limit
      });
    }

    return res.status(200).json({
      throttled: false,
      message: 'No active throttles'
    });

  } catch (error) {
    console.error('Throttle check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check throttles',
      message: error.message 
    });
  }
}

