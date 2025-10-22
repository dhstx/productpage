/**
 * API Endpoint: Dashboard Statistics
 * GET /api/dashboard/stats
 * Returns comprehensive dashboard statistics for a user
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

    // Fetch user's subscription data
    const { data: subscription, error: subError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error fetching subscription:', subError);
    }

    // Fetch chat history count
    const { count: conversationCount, error: chatError } = await supabase
      .from('chat_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (chatError) {
      console.error('Error fetching chat count:', chatError);
    }

    // Fetch unique agents used
    const { data: agentsUsed, error: agentsError } = await supabase
      .from('chat_history')
      .select('agent_name')
      .eq('user_id', user.id);

    const uniqueAgents = agentsUsed 
      ? new Set(agentsUsed.map(a => a.agent_name)).size 
      : 0;

    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
    }

    // Fetch team members count (if applicable)
    const { count: teamCount, error: teamError } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', user.id); // Assuming user.id is team owner

    if (teamError && teamError.code !== 'PGRST116') {
      console.error('Error fetching team count:', teamError);
    }

    // Fetch recent activity
    const { data: recentChats, error: recentError } = await supabase
      .from('chat_history')
      .select('agent_name, created_at, message_preview')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent activity:', recentError);
    }

    // Format recent activity
    const recentActivity = recentChats?.map(chat => {
      const timeDiff = Date.now() - new Date(chat.created_at).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let timestamp;
      if (days > 0) {
        timestamp = `${days}d ago`;
      } else if (hours > 0) {
        timestamp = `${hours}h ago`;
      } else if (minutes > 0) {
        timestamp = `${minutes}m ago`;
      } else {
        timestamp = 'Just now';
      }

      return {
        title: `Chat with ${chat.agent_name}`,
        description: chat.message_preview || 'No preview available',
        timestamp,
      };
    }) || [];

    // Calculate billing cycle info
    let billingCycleInfo = null;
    if (subscription?.billing_cycle_start) {
      const cycleStart = new Date(subscription.billing_cycle_start);
      const nextCycle = new Date(cycleStart);
      nextCycle.setMonth(nextCycle.getMonth() + 1);
      
      const daysUntilReset = Math.ceil((nextCycle - Date.now()) / (1000 * 60 * 60 * 24));
      
      billingCycleInfo = {
        nextResetDate: nextCycle.toISOString(),
        daysUntilReset,
        currentCycleStart: cycleStart.toISOString(),
      };
    }

    // Return comprehensive stats
    return res.status(200).json({
      totalAgents: uniqueAgents,
      totalConversations: conversationCount || 0,
      teamMembers: (teamCount || 0) + 1, // +1 for the user themselves
      currentTier: subscription?.tier || 'freemium',
      recentActivity,
      billingCycle: billingCycleInfo,
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

