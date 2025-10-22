/**
 * API Endpoint: Agent Usage Statistics
 * GET /api/agents/usage-stats?userId=xxx
 * Returns agent usage statistics for a user
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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user's chat history from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: chatHistory, error: chatError } = await supabase
      .from('chat_history')
      .select('agent_name, created_at, response_time')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (chatError) {
      console.error('Error fetching chat history:', chatError);
      // Return empty stats if no data
      return res.status(200).json({
        totalMessages: 0,
        uniqueAgents: 0,
        avgResponseTime: 0,
        topAgents: [],
        recentActivity: [],
      });
    }

    if (!chatHistory || chatHistory.length === 0) {
      return res.status(200).json({
        totalMessages: 0,
        uniqueAgents: 0,
        avgResponseTime: 0,
        topAgents: [],
        recentActivity: [],
      });
    }

    // Calculate statistics
    const totalMessages = chatHistory.length;

    // Count messages per agent
    const agentCounts = {};
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    chatHistory.forEach(chat => {
      // Count agent usage
      if (chat.agent_name) {
        agentCounts[chat.agent_name] = (agentCounts[chat.agent_name] || 0) + 1;
      }

      // Sum response times
      if (chat.response_time) {
        totalResponseTime += chat.response_time;
        responseTimeCount++;
      }
    });

    // Get unique agents count
    const uniqueAgents = Object.keys(agentCounts).length;

    // Calculate average response time
    const avgResponseTime = responseTimeCount > 0 
      ? (totalResponseTime / responseTimeCount / 1000).toFixed(1) // Convert to seconds
      : 0;

    // Sort agents by usage
    const topAgents = Object.entries(agentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Format recent activity
    const recentActivity = chatHistory.slice(0, 10).map(chat => {
      const timeDiff = Date.now() - new Date(chat.created_at).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let timeAgo;
      if (days > 0) {
        timeAgo = `${days}d ago`;
      } else if (hours > 0) {
        timeAgo = `${hours}h ago`;
      } else if (minutes > 0) {
        timeAgo = `${minutes}m ago`;
      } else {
        timeAgo = 'Just now';
      }

      return {
        agent: chat.agent_name,
        timeAgo,
      };
    });

    return res.status(200).json({
      totalMessages,
      uniqueAgents,
      avgResponseTime,
      topAgents,
      recentActivity,
    });

  } catch (error) {
    console.error('Agent usage stats error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

