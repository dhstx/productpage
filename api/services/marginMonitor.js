/**
 * Margin Monitoring Service
 * Traffic-light system for margin health monitoring and automated alerts
 */

import { createClient } from '@supabase/supabase-js';

// Traffic light thresholds
export const MARGIN_THRESHOLDS = {
  green: { min: 0.65, status: 'green', label: 'Healthy' },
  yellow: { min: 0.50, max: 0.65, status: 'yellow', label: 'Warning' },
  red: { max: 0.50, status: 'red', label: 'Critical' }
};

export const ADVANCED_BURN_THRESHOLDS = {
  green: { max: 0.90, status: 'green' },
  yellow: { min: 0.90, max: 1.10, status: 'yellow' },
  red: { min: 1.10, status: 'red' }
};

/**
 * Calculate margin status based on percentage
 */
export function getMarginStatus(marginPercentage) {
  if (marginPercentage >= MARGIN_THRESHOLDS.green.min) {
    return { ...MARGIN_THRESHOLDS.green, marginPercentage };
  } else if (marginPercentage >= MARGIN_THRESHOLDS.yellow.min) {
    return { ...MARGIN_THRESHOLDS.yellow, marginPercentage };
  } else {
    return { ...MARGIN_THRESHOLDS.red, marginPercentage };
  }
}

/**
 * Calculate Advanced burn status
 */
export function getAdvancedBurnStatus(actualPercentage, targetPercentage) {
  const ratio = actualPercentage / targetPercentage;
  
  if (ratio < ADVANCED_BURN_THRESHOLDS.green.max) {
    return { ...ADVANCED_BURN_THRESHOLDS.green, ratio, actualPercentage, targetPercentage };
  } else if (ratio < ADVANCED_BURN_THRESHOLDS.yellow.max) {
    return { ...ADVANCED_BURN_THRESHOLDS.yellow, ratio, actualPercentage, targetPercentage };
  } else {
    return { ...ADVANCED_BURN_THRESHOLDS.red, ratio, actualPercentage, targetPercentage };
  }
}

/**
 * Calculate margin for a specific scope (platform, tier, or user)
 */
export async function calculateMargin(scopeType, scopeId, periodStart, periodEnd, supabase) {
  let query = supabase
    .from('pt_usage')
    .select('*')
    .gte('created_at', periodStart.toISOString())
    .lte('created_at', periodEnd.toISOString());
  
  // Filter by scope
  if (scopeType === 'tier') {
    // Join with users to filter by tier
    query = supabase
      .from('pt_usage')
      .select(`
        *,
        users!inner (
          subscription_tier
        )
      `)
      .eq('users.subscription_tier', scopeId)
      .gte('created_at', periodStart.toISOString())
      .lte('created_at', periodEnd.toISOString());
  } else if (scopeType === 'user') {
    query = query.eq('user_id', scopeId);
  }
  
  const { data: usageRecords, error } = await query;
  
  if (error) {
    console.error('Error fetching usage records:', error);
    return null;
  }
  
  // Calculate totals
  let totalCOGS = 0;
  let totalPT = 0;
  let corePT = 0;
  let advancedPT = 0;
  
  usageRecords.forEach(record => {
    totalCOGS += parseFloat(record.cost_usd);
    totalPT += record.pt_consumed;
    
    if (record.pt_type === 'core') {
      corePT += record.pt_consumed;
    } else {
      advancedPT += record.pt_consumed;
    }
  });
  
  // Calculate revenue based on scope
  let totalRevenue = 0;
  
  if (scopeType === 'platform') {
    // Sum all subscription revenue
    const { data: users } = await supabase
      .from('users')
      .select(`
        subscription_tier,
        subscription_tiers!inner (
          price_usd
        )
      `);
    
    totalRevenue = users?.reduce((sum, user) => {
      return sum + parseFloat(user.subscription_tiers.price_usd);
    }, 0) || 0;
    
    // Prorate for period
    const daysInPeriod = (periodEnd - periodStart) / (1000 * 60 * 60 * 24);
    const daysInMonth = 30;
    totalRevenue = (totalRevenue / daysInMonth) * daysInPeriod;
    
  } else if (scopeType === 'tier') {
    // Get tier price
    const { data: tier } = await supabase
      .from('subscription_tiers')
      .select('price_usd')
      .eq('tier', scopeId)
      .single();
    
    if (tier) {
      // Count users in tier
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .eq('subscription_tier', scopeId);
      
      const userCount = users?.length || 0;
      totalRevenue = parseFloat(tier.price_usd) * userCount;
      
      // Prorate
      const daysInPeriod = (periodEnd - periodStart) / (1000 * 60 * 60 * 24);
      const daysInMonth = 30;
      totalRevenue = (totalRevenue / daysInMonth) * daysInPeriod;
    }
    
  } else if (scopeType === 'user') {
    // Get user's tier price
    const { data: user } = await supabase
      .from('users')
      .select(`
        subscription_tier,
        subscription_tiers!inner (
          price_usd
        )
      `)
      .eq('id', scopeId)
      .single();
    
    if (user) {
      totalRevenue = parseFloat(user.subscription_tiers.price_usd);
      
      // Prorate
      const daysInPeriod = (periodEnd - periodStart) / (1000 * 60 * 60 * 24);
      const daysInMonth = 30;
      totalRevenue = (totalRevenue / daysInMonth) * daysInPeriod;
    }
  }
  
  // Calculate margin
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCOGS) / totalRevenue) : 0;
  const advancedPercentage = totalPT > 0 ? (advancedPT / totalPT) : 0;
  
  return {
    scopeType,
    scopeId,
    periodStart,
    periodEnd,
    totalRevenue,
    totalCOGS,
    grossMargin,
    totalPT,
    corePT,
    advancedPT,
    advancedPercentage
  };
}

/**
 * Monitor margins and create alert records
 */
export async function monitorMargins(supabase) {
  const now = new Date();
  const periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
  const periodEnd = now;
  
  const results = {
    platform: null,
    tiers: [],
    alerts: []
  };
  
  // 1. Monitor platform-wide margin
  const platformMargin = await calculateMargin('platform', null, periodStart, periodEnd, supabase);
  
  if (platformMargin) {
    const marginStatus = getMarginStatus(platformMargin.grossMargin);
    const burnStatus = getAdvancedBurnStatus(platformMargin.advancedPercentage, 0.25); // Target 25%
    
    results.platform = {
      ...platformMargin,
      marginStatus,
      burnStatus
    };
    
    // Create monitoring record
    const { data: monitoringRecord } = await supabase
      .from('margin_monitoring')
      .insert({
        scope_type: 'platform',
        scope_id: 'all',
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        total_revenue: platformMargin.totalRevenue,
        total_cogs: platformMargin.totalCOGS,
        gross_margin: platformMargin.grossMargin,
        total_pt_consumed: platformMargin.totalPT,
        core_pt_consumed: platformMargin.corePT,
        advanced_pt_consumed: platformMargin.advancedPT,
        advanced_percentage: platformMargin.advancedPercentage,
        status: marginStatus.status,
        status_reason: `Margin: ${Math.round(platformMargin.grossMargin * 100)}%, Advanced: ${Math.round(platformMargin.advancedPercentage * 100)}%`
      })
      .select()
      .single();
    
    // Check if alert needed
    if (marginStatus.status === 'yellow' || marginStatus.status === 'red') {
      results.alerts.push({
        scope: 'platform',
        status: marginStatus.status,
        margin: platformMargin.grossMargin,
        message: `Platform margin is ${marginStatus.label.toLowerCase()}: ${Math.round(platformMargin.grossMargin * 100)}%`
      });
    }
  }
  
  // 2. Monitor tier-level margins
  const tiers = ['entry', 'pro', 'pro_plus', 'business', 'enterprise'];
  
  for (const tier of tiers) {
    const tierMargin = await calculateMargin('tier', tier, periodStart, periodEnd, supabase);
    
    if (tierMargin && tierMargin.totalPT > 0) {
      const marginStatus = getMarginStatus(tierMargin.grossMargin);
      const burnStatus = getAdvancedBurnStatus(tierMargin.advancedPercentage, 0.25);
      
      results.tiers.push({
        tier,
        ...tierMargin,
        marginStatus,
        burnStatus
      });
      
      // Create monitoring record
      await supabase
        .from('margin_monitoring')
        .insert({
          scope_type: 'tier',
          scope_id: tier,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          total_revenue: tierMargin.totalRevenue,
          total_cogs: tierMargin.totalCOGS,
          gross_margin: tierMargin.grossMargin,
          total_pt_consumed: tierMargin.totalPT,
          core_pt_consumed: tierMargin.corePT,
          advanced_pt_consumed: tierMargin.advancedPT,
          advanced_percentage: tierMargin.advancedPercentage,
          status: marginStatus.status,
          status_reason: `${tier}: Margin ${Math.round(tierMargin.grossMargin * 100)}%, Advanced ${Math.round(tierMargin.advancedPercentage * 100)}%`
        });
      
      // Check if alert needed
      if (marginStatus.status === 'yellow' || marginStatus.status === 'red') {
        results.alerts.push({
          scope: 'tier',
          tier,
          status: marginStatus.status,
          margin: tierMargin.grossMargin,
          message: `${tier} tier margin is ${marginStatus.label.toLowerCase()}: ${Math.round(tierMargin.grossMargin * 100)}%`
        });
      }
    }
  }
  
  return results;
}

/**
 * Apply auto-mitigation actions
 */
export async function applyAutoMitigation(status, scope, supabase) {
  const actions = [];
  
  if (status === 'red') {
    // Critical: Reduce Advanced routing
    actions.push({
      action: 'reduce_advanced_routing',
      target: scope.scopeType === 'platform' ? 'all' : scope.scopeId,
      newLimit: 0.10 // Reduce to 10%
    });
    
    // If platform-wide and margin <40%, emergency mode
    if (scope.scopeType === 'platform' && scope.grossMargin < 0.40) {
      actions.push({
        action: 'emergency_force_core',
        duration: '12h'
      });
    }
  } else if (status === 'yellow') {
    // Warning: Tighten Advanced routing
    actions.push({
      action: 'tighten_advanced_routing',
      target: scope.scopeType === 'platform' ? 'all' : scope.scopeId,
      newLimit: 0.15 // Reduce to 15%
    });
  }
  
  // Log mitigation actions
  await supabase
    .from('margin_monitoring')
    .update({
      mitigation_applied: true,
      mitigation_actions: { actions, timestamp: new Date().toISOString() }
    })
    .eq('scope_type', scope.scopeType)
    .eq('scope_id', scope.scopeId || 'all')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour
  
  return actions;
}

/**
 * Send Slack alert
 */
export async function sendSlackAlert(alert, marginData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Slack webhook URL not configured');
    return false;
  }
  
  const emoji = alert.status === 'red' ? '🔴' : '🟡';
  const statusText = alert.status === 'red' ? 'RED' : 'YELLOW';
  
  const message = {
    text: `${emoji} Pricing Alert — ${alert.scope.toUpperCase()} in ${statusText}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} Pricing Alert — ${alert.scope.toUpperCase()} in ${statusText}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Scope:* ${alert.scope}${alert.tier ? ` (${alert.tier})` : ''}`
          },
          {
            type: 'mrkdwn',
            text: `*Margin:* ${Math.round(alert.margin * 100)}% (target: >65%)`
          },
          {
            type: 'mrkdwn',
            text: `*Advanced Burn:* ${Math.round(marginData.advancedPercentage * 100)}% (target: <25%)`
          },
          {
            type: 'mrkdwn',
            text: `*Status:* ${alert.message}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Recommended Actions:*\n1. Review top 10 users by Advanced PT consumption\n2. Consider reducing Advanced soft cap\n3. Send targeted upgrade offers to high-burn users'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Dashboard'
            },
            url: `${process.env.APP_URL}/admin/margin-monitoring`
          }
        ]
      }
    ]
  };
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending Slack alert:', error);
    return false;
  }
}

/**
 * Main monitoring job (to be run periodically)
 */
export async function runMarginMonitoringJob() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  console.log('Running margin monitoring job...');
  
  // Monitor margins
  const results = await monitorMargins(supabase);
  
  console.log(`Platform margin: ${Math.round(results.platform.grossMargin * 100)}%`);
  console.log(`Alerts: ${results.alerts.length}`);
  
  // Process alerts
  for (const alert of results.alerts) {
    console.log(`Alert: ${alert.message}`);
    
    // Send Slack notification
    const marginData = alert.scope === 'platform' 
      ? results.platform 
      : results.tiers.find(t => t.tier === alert.tier);
    
    await sendSlackAlert(alert, marginData);
    
    // Mark alert as sent
    await supabase
      .from('margin_monitoring')
      .update({
        alert_sent: true,
        alert_sent_at: new Date().toISOString()
      })
      .eq('scope_type', alert.scope)
      .eq('scope_id', alert.tier || 'all')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
    // Apply auto-mitigation if red status
    if (alert.status === 'red') {
      const scope = alert.scope === 'platform' 
        ? results.platform 
        : results.tiers.find(t => t.tier === alert.tier);
      
      const actions = await applyAutoMitigation('red', scope, supabase);
      console.log(`Applied ${actions.length} mitigation actions`);
    }
  }
  
  return results;
}

