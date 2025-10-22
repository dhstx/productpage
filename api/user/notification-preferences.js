/**
 * API Endpoint: User Notification Preferences
 * POST /api/user/notification-preferences
 * Save user notification preferences
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const preferences = req.body;

    // Save preferences to database
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        email_notifications: preferences.emailNotifications,
        pt_alerts: preferences.ptAlerts,
        billing_reminders: preferences.billingReminders,
        product_updates: preferences.productUpdates,
        marketing_emails: preferences.marketingEmails,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving preferences:', error);
      return res.status(500).json({ error: 'Failed to save preferences' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Notification preferences error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

