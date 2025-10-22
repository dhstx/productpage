/**
 * API Endpoint: Delete User Account
 * DELETE /api/user/delete-account
 * Permanently delete user account and all data
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

    // Delete user data from all tables
    // Note: In production, you might want to use database triggers or cascading deletes
    await Promise.all([
      supabase.from('user_profiles').delete().eq('user_id', user.id),
      supabase.from('chat_history').delete().eq('user_id', user.id),
      supabase.from('token_usage').delete().eq('user_id', user.id),
      supabase.from('subscription_tiers').delete().eq('user_id', user.id),
      supabase.from('user_preferences').delete().eq('user_id', user.id),
      supabase.from('team_members').delete().eq('user_id', user.id),
    ]);

    // Delete user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return res.status(500).json({ error: 'Failed to delete account' });
    }

    return res.status(200).json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

