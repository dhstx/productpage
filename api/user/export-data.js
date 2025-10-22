/**
 * API Endpoint: Export User Data
 * GET /api/user/export-data
 * Export all user data as JSON
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch all user data
    const [
      profileData,
      chatHistory,
      tokenUsage,
      subscription,
      preferences,
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('chat_history').select('*').eq('user_id', user.id),
      supabase.from('token_usage').select('*').eq('user_id', user.id),
      supabase.from('subscription_tiers').select('*').eq('user_id', user.id).single(),
      supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
    ]);

    // Compile export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      profile: profileData.data || {},
      chatHistory: chatHistory.data || [],
      tokenUsage: tokenUsage.data || [],
      subscription: subscription.data || {},
      preferences: preferences.data || {},
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${user.id}.json"`);
    
    return res.status(200).json(exportData);

  } catch (error) {
    console.error('Data export error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

