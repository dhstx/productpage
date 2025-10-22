import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Record PT consumption in ledger
 */
export async function recordPTConsumption({
  userId,
  corePT,
  advancedPT,
  conversationId,
  model,
  inputTokens,
  outputTokens,
  providerCost
}) {
  const { data, error } = await supabase.rpc('record_pt_consumption', {
    p_user_id: userId,
    p_core_pt: corePT,
    p_advanced_pt: advancedPT,
    p_source_id: conversationId,
    p_model: model,
    p_input_tokens: inputTokens,
    p_output_tokens: outputTokens,
    p_provider_cost: providerCost
  });

  if (error) {
    console.error('Failed to record PT consumption:', error);
    throw new Error('Failed to record PT consumption');
  }

  return data;
}

/**
 * Record PT allocation (subscription, top-up)
 */
export async function recordPTAllocation({
  userId,
  corePT = 0,
  advancedPT = 0,
  sourceType,
  sourceId,
  description
}) {
  // Get current balances
  const { data: currentUsage } = await supabase
    .from('user_pt_usage')
    .select('core_pt_remaining, advanced_pt_remaining')
    .eq('user_id', userId)
    .single();

  if (!currentUsage) {
    throw new Error('User PT usage not found');
  }

  const newCoreBalance = currentUsage.core_pt_remaining + corePT;
  const newAdvancedBalance = currentUsage.advanced_pt_remaining + advancedPT;

  // Insert ledger entry
  const { data, error } = await supabase
    .from('pt_ledger')
    .insert({
      user_id: userId,
      transaction_type: 'allocation',
      core_pt_delta: corePT,
      advanced_pt_delta: advancedPT,
      core_pt_balance: newCoreBalance,
      advanced_pt_balance: newAdvancedBalance,
      source_type: sourceType,
      source_id: sourceId,
      description
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to record PT allocation:', error);
    throw new Error('Failed to record PT allocation');
  }

  return data;
}

/**
 * Get user's PT ledger
 */
export async function getUserPTLedger(userId, { limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('pt_ledger')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to get PT ledger:', error);
    throw new Error('Failed to get PT ledger');
  }

  return data;
}

/**
 * Perform daily reconciliation
 */
export async function performDailyReconciliation(date = null) {
  const reconciliationDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dateString = reconciliationDate.toISOString().split('T')[0];

  const { data, error } = await supabase.rpc('perform_daily_reconciliation', {
    p_date: dateString
  });

  if (error) {
    console.error('Failed to perform daily reconciliation:', error);
    throw new Error('Failed to perform daily reconciliation');
  }

  return data;
}

/**
 * Get reconciliation report
 */
export async function getReconciliationReport(startDate, endDate) {
  const { data, error } = await supabase
    .from('pt_reconciliation')
    .select('*')
    .gte('reconciliation_date', startDate)
    .lte('reconciliation_date', endDate)
    .order('reconciliation_date', { ascending: false });

  if (error) {
    console.error('Failed to get reconciliation report:', error);
    throw new Error('Failed to get reconciliation report');
  }

  return data;
}

/**
 * Create PT dispute
 */
export async function createPTDispute({
  userId,
  disputeType,
  ledgerEntryId,
  disputedPT,
  description,
  evidence = {}
}) {
  const { data, error } = await supabase.rpc('create_pt_dispute', {
    p_user_id: userId,
    p_dispute_type: disputeType,
    p_ledger_entry_id: ledgerEntryId,
    p_disputed_pt: disputedPT,
    p_description: description
  });

  if (error) {
    console.error('Failed to create PT dispute:', error);
    throw new Error('Failed to create PT dispute');
  }

  // Update evidence if provided
  if (Object.keys(evidence).length > 0) {
    await supabase
      .from('pt_disputes')
      .update({ user_evidence: evidence })
      .eq('id', data);
  }

  return data;
}

/**
 * Get user's disputes
 */
export async function getUserDisputes(userId) {
  const { data, error } = await supabase
    .from('pt_disputes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to get user disputes:', error);
    throw new Error('Failed to get user disputes');
  }

  return data;
}

/**
 * Resolve PT dispute (admin only)
 */
export async function resolvePTDispute({
  disputeId,
  adminUserId,
  decision,
  refundPT = 0,
  refundCost = 0,
  notes
}) {
  const { data, error} = await supabase
    .from('pt_disputes')
    .update({
      admin_user_id: adminUserId,
      admin_decision: decision,
      refund_pt_amount: refundPT,
      refund_cost_usd: refundCost,
      resolution_notes: notes,
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', disputeId)
    .select()
    .single();

  if (error) {
    console.error('Failed to resolve PT dispute:', error);
    throw new Error('Failed to resolve PT dispute');
  }

  // If approved, refund PT to user
  if (decision === 'approved' && refundPT > 0) {
    const dispute = data;
    await recordPTAllocation({
      userId: dispute.user_id,
      corePT: refundPT,
      advancedPT: 0,
      sourceType: 'refund',
      sourceId: disputeId,
      description: `Refund from dispute #${disputeId}: ${notes}`
    });
  }

  return data;
}

/**
 * Get monthly summary for user
 */
export async function getUserMonthlySummary(userId, year, month) {
  const { data, error } = await supabase
    .from('pt_monthly_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') { // Not found is OK
    console.error('Failed to get monthly summary:', error);
    throw new Error('Failed to get monthly summary');
  }

  return data;
}

/**
 * Calculate and update monthly summary
 */
export async function calculateMonthlySummary(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // Get all consumption for the month
  const { data: ledgerEntries } = await supabase
    .from('pt_ledger')
    .select('*')
    .eq('user_id', userId)
    .eq('transaction_type', 'consumption')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', endDate.toISOString());

  if (!ledgerEntries || ledgerEntries.length === 0) {
    return null;
  }

  // Calculate totals
  const corePTUsed = ledgerEntries.reduce((sum, entry) => sum + Math.abs(entry.core_pt_delta), 0);
  const advancedPTUsed = ledgerEntries.reduce((sum, entry) => sum + Math.abs(entry.advanced_pt_delta), 0);
  const totalCost = ledgerEntries.reduce((sum, entry) => sum + (entry.provider_cost_usd || 0), 0);

  // Get revenue (subscriptions + top-ups)
  const { data: subscriptionRevenue } = await supabase
    .from('pt_ledger')
    .select('metadata')
    .eq('user_id', userId)
    .eq('source_type', 'subscription')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', endDate.toISOString());

  const { data: topupRevenue } = await supabase
    .from('pt_ledger')
    .select('metadata')
    .eq('user_id', userId)
    .eq('source_type', 'top_up')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', endDate.toISOString());

  const subRevenue = subscriptionRevenue?.reduce((sum, entry) => 
    sum + (entry.metadata?.amount_usd || 0), 0) || 0;
  const topRevenue = topupRevenue?.reduce((sum, entry) => 
    sum + (entry.metadata?.amount_usd || 0), 0) || 0;
  const totalRevenue = subRevenue + topRevenue;

  const grossMargin = totalRevenue - totalCost;
  const grossMarginPercent = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;

  // Upsert monthly summary
  const { data, error } = await supabase
    .from('pt_monthly_summary')
    .upsert({
      user_id: userId,
      year,
      month,
      core_pt_used: corePTUsed,
      advanced_pt_used: advancedPTUsed,
      total_pt_used: corePTUsed + advancedPTUsed,
      total_cost_usd: totalCost,
      subscription_revenue_usd: subRevenue,
      topup_revenue_usd: topRevenue,
      total_revenue_usd: totalRevenue,
      gross_margin_usd: grossMargin,
      gross_margin_percent: grossMarginPercent,
      conversation_count: ledgerEntries.length,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,year,month'
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to calculate monthly summary:', error);
    throw new Error('Failed to calculate monthly summary');
  }

  return data;
}

export default {
  recordPTConsumption,
  recordPTAllocation,
  getUserPTLedger,
  performDailyReconciliation,
  getReconciliationReport,
  createPTDispute,
  getUserDisputes,
  resolvePTDispute,
  getUserMonthlySummary,
  calculateMonthlySummary
};

