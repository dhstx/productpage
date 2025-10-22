import { performDailyReconciliation, calculateMonthlySummary } from '../services/ptAccounting.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Nightly reconciliation job
 * Runs at 2 AM UTC daily via Vercel Cron
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/nightly-reconciliation",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dateString = yesterday.toISOString().split('T')[0];

    console.log(`Starting nightly reconciliation for ${dateString}...`);

    // 1. Perform daily PT reconciliation
    const reconciliationId = await performDailyReconciliation(yesterday);
    console.log(`✓ Daily reconciliation complete: ${reconciliationId}`);

    // 2. Get all active users
    const { data: activeUsers } = await supabase
      .from('user_pt_usage')
      .select('user_id')
      .gt('core_pt_used', 0);

    console.log(`Found ${activeUsers?.length || 0} active users`);

    // 3. Calculate monthly summaries for active users
    const year = yesterday.getFullYear();
    const month = yesterday.getMonth() + 1;

    let summariesUpdated = 0;
    if (activeUsers) {
      for (const user of activeUsers) {
        try {
          await calculateMonthlySummary(user.user_id, year, month);
          summariesUpdated++;
        } catch (err) {
          console.error(`Failed to calculate summary for user ${user.user_id}:`, err);
        }
      }
    }

    console.log(`✓ Updated ${summariesUpdated} monthly summaries`);

    // 4. Check for discrepancies
    const { data: reconciliation } = await supabase
      .from('pt_reconciliation')
      .select('*')
      .eq('id', reconciliationId)
      .single();

    let discrepancyAlert = null;
    if (reconciliation) {
      const { total_provider_cost_usd, total_revenue_usd } = reconciliation;
      const margin = total_revenue_usd - total_provider_cost_usd;
      const marginPercent = total_revenue_usd > 0 ? (margin / total_revenue_usd) * 100 : 0;

      // Alert if margin is below 40%
      if (marginPercent < 40) {
        discrepancyAlert = {
          type: 'low_margin',
          margin_percent: marginPercent,
          date: dateString
        };

        // Send Slack alert if configured
        if (process.env.SLACK_WEBHOOK_URL) {
          await sendSlackAlert({
            text: `⚠️ Low Margin Alert`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Low Margin Detected*\nDate: ${dateString}\nMargin: ${marginPercent.toFixed(2)}%\nRevenue: $${total_revenue_usd}\nCost: $${total_provider_cost_usd}`
                }
              }
            ]
          });
        }
      }
    }

    // 5. Return summary
    return res.status(200).json({
      success: true,
      date: dateString,
      reconciliation_id: reconciliationId,
      summaries_updated: summariesUpdated,
      discrepancy_alert: discrepancyAlert,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Nightly reconciliation failed:', error);

    // Send error alert
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackAlert({
        text: `🚨 Nightly Reconciliation Failed`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Reconciliation Error*\nError: ${error.message}\nTime: ${new Date().toISOString()}`
            }
          }
        ]
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function sendSlackAlert(payload) {
  if (!process.env.SLACK_WEBHOOK_URL) return;

  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Failed to send Slack alert:', err);
  }
}

