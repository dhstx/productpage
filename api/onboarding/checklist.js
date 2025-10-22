/**
 * API Endpoint: Onboarding Checklist
 * GET /api/onboarding/checklist?userId=xxx
 * Returns onboarding checklist progress for a user
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

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check various completion criteria
    const checks = await Promise.all([
      // 1. Has sent first message
      supabase
        .from('chat_history')
        .select('id')
        .eq('user_id', userId)
        .limit(1),
      
      // 2. Has subscription (not freemium)
      supabase
        .from('subscription_tiers')
        .select('tier')
        .eq('user_id', userId)
        .single(),
      
      // 3. Has completed profile
      supabase
        .from('user_profiles')
        .select('full_name, avatar_url')
        .eq('user_id', userId)
        .single(),
      
      // 4. Has invited team member (if applicable)
      supabase
        .from('team_members')
        .select('id')
        .eq('team_id', userId)
        .limit(1),
    ]);

    const [chatCheck, subCheck, profileCheck, teamCheck] = checks;

    // Build checklist items
    const items = [
      {
        title: 'Send your first message',
        description: 'Try chatting with one of our AI agents',
        completed: !chatCheck.error && chatCheck.data && chatCheck.data.length > 0,
        action: {
          label: 'Start chatting',
          url: '/agents',
        },
      },
      {
        title: 'Complete your profile',
        description: 'Add your name and profile picture',
        completed: !profileCheck.error && 
                   profileCheck.data?.full_name && 
                   profileCheck.data?.avatar_url,
        action: {
          label: 'Edit profile',
          url: '/settings',
        },
      },
      {
        title: 'Explore available agents',
        description: 'See all 13 specialized AI agents',
        completed: !chatCheck.error && chatCheck.data && chatCheck.data.length >= 3,
        action: {
          label: 'View agents',
          url: '/agents',
        },
      },
      {
        title: 'Understand Platform Tokens (PT)',
        description: 'Learn how PT works and track your usage',
        completed: !chatCheck.error && chatCheck.data && chatCheck.data.length >= 1,
        action: {
          label: 'View billing',
          url: '/billing',
        },
      },
      {
        title: 'Choose a plan',
        description: 'Upgrade from freemium to unlock more features',
        completed: !subCheck.error && 
                   subCheck.data?.tier && 
                   subCheck.data.tier !== 'freemium',
        action: {
          label: 'View pricing',
          url: '/pricing',
        },
      },
    ];

    // Add team invite item only if user has a paid plan
    if (!subCheck.error && subCheck.data?.tier && 
        ['business', 'enterprise'].includes(subCheck.data.tier)) {
      items.push({
        title: 'Invite your team',
        description: 'Collaborate with team members',
        completed: !teamCheck.error && teamCheck.data && teamCheck.data.length > 0,
        action: {
          label: 'Manage team',
          url: '/team',
        },
      });
    }

    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length;

    return res.status(200).json({
      items,
      completedCount,
      totalCount,
      percentComplete: Math.round((completedCount / totalCount) * 100),
    });

  } catch (error) {
    console.error('Onboarding checklist error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

