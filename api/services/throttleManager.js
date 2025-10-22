/**
 * Throttle Manager Service
 * Implements two-layer Advanced caps and 40%/72h burn rate throttling
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Check Advanced PT caps (two-layer: soft 20%, hard 25%)
 */
export async function checkAdvancedCaps(userId, supabase) {
  // Call database function
  const { data, error } = await supabase.rpc('check_advanced_cap', {
    p_user_id: userId
  });
  
  if (error) {
    console.error('Error checking Advanced caps:', error);
    return {
      success: false,
      error: error.message
    };
  }
  
  return data;
}

/**
 * Check 40%/72h burn rate throttle
 */
export async function checkBurnRate(userId, supabase) {
  // Call database function
  const { data, error } = await supabase.rpc('check_burn_rate', {
    p_user_id: userId
  });
  
  if (error) {
    console.error('Error checking burn rate:', error);
    return {
      success: false,
      error: error.message
    };
  }
  
  return data;
}

/**
 * Check if user is currently throttled
 */
export async function isUserThrottled(userId, supabase) {
  const { data: user, error } = await supabase
    .from('users')
    .select('throttle_active, throttle_until, throttle_reason')
    .eq('id', userId)
    .single();
  
  if (error || !user) {
    return {
      throttled: false
    };
  }
  
  // Check if throttle is active and not expired
  if (user.throttle_active && user.throttle_until) {
    const throttleUntil = new Date(user.throttle_until);
    const now = new Date();
    
    if (now < throttleUntil) {
      const minutesRemaining = Math.ceil((throttleUntil - now) / (1000 * 60));
      
      return {
        throttled: true,
        reason: user.throttle_reason,
        throttleUntil,
        minutesRemaining
      };
    } else {
      // Throttle expired, clear it
      await clearThrottle(userId, supabase);
      return {
        throttled: false
      };
    }
  }
  
  return {
    throttled: false
  };
}

/**
 * Apply throttle to user
 */
export async function applyThrottle(userId, reason, durationMinutes = 30, supabase) {
  const throttleUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  
  const { error } = await supabase
    .from('users')
    .update({
      throttle_active: true,
      throttle_until: throttleUntil.toISOString(),
      throttle_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error applying throttle:', error);
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: true,
    throttleUntil,
    durationMinutes,
    reason
  };
}

/**
 * Clear throttle from user
 */
export async function clearThrottle(userId, supabase) {
  const { error } = await supabase
    .from('users')
    .update({
      throttle_active: false,
      throttle_until: null,
      throttle_reason: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error clearing throttle:', error);
    return {
      success: false,
      error: error.message
    };
  }
  
  return {
    success: true
  };
}

/**
 * Comprehensive pre-request throttle check
 */
export async function performThrottleChecks(userId, requestedModelClass, supabase) {
  const checks = {
    passed: true,
    throttled: false,
    warnings: [],
    blocks: []
  };
  
  // 1. Check if user is currently throttled
  const throttleStatus = await isUserThrottled(userId, supabase);
  if (throttleStatus.throttled) {
    checks.passed = false;
    checks.throttled = true;
    checks.blocks.push({
      type: 'active_throttle',
      reason: throttleStatus.reason,
      message: `You are currently throttled. Please wait ${throttleStatus.minutesRemaining} minutes.`,
      throttleUntil: throttleStatus.throttleUntil
    });
    return checks;
  }
  
  // 2. Check burn rate (40%/72h rule)
  const burnRateCheck = await checkBurnRate(userId, supabase);
  if (burnRateCheck.success) {
    if (burnRateCheck.throttle_applied) {
      checks.passed = false;
      checks.throttled = true;
      checks.blocks.push({
        type: 'burn_rate_exceeded',
        reason: '40%/72h limit exceeded',
        message: `You've used ${burnRateCheck.burn_percentage}% of your monthly PT in the last 72 hours. Please wait 30 minutes.`,
        burnPercentage: burnRateCheck.burn_percentage
      });
      return checks;
    } else if (burnRateCheck.burn_percentage > 30) {
      // Warning at 30%
      checks.warnings.push({
        type: 'burn_rate_warning',
        message: `You've used ${burnRateCheck.burn_percentage}% of your monthly PT in the last 72 hours. Slow down to avoid throttling.`,
        burnPercentage: burnRateCheck.burn_percentage
      });
    }
  }
  
  // 3. Check Advanced PT caps (if requesting Advanced model)
  if (requestedModelClass === 'advanced') {
    const capCheck = await checkAdvancedCaps(userId, supabase);
    
    if (capCheck.success) {
      if (capCheck.status === 'hard_cap_breached') {
        checks.passed = false;
        checks.blocks.push({
          type: 'advanced_hard_cap',
          reason: 'Advanced usage hard cap exceeded',
          message: `You've exceeded the Advanced model usage limit (${capCheck.hard_cap}%). Overflow fees apply or upgrade your tier.`,
          advancedPercentage: capCheck.advanced_percentage,
          hardCap: capCheck.hard_cap,
          overflowFee: true
        });
      } else if (capCheck.status === 'soft_cap_breached') {
        checks.warnings.push({
          type: 'advanced_soft_cap',
          message: `You're approaching the Advanced model usage limit (${capCheck.soft_cap}%). Consider upgrading.`,
          advancedPercentage: capCheck.advanced_percentage,
          softCap: capCheck.soft_cap
        });
      }
    }
  }
  
  // 4. Check PT availability
  const availabilityCheck = await checkPTAvailability(userId, requestedModelClass, supabase);
  if (!availabilityCheck.available) {
    checks.passed = false;
    checks.blocks.push({
      type: 'insufficient_pt',
      reason: availabilityCheck.reason,
      message: availabilityCheck.message,
      ptAvailable: availabilityCheck.pt_available,
      ptRequired: availabilityCheck.pt_required
    });
  }
  
  return checks;
}

/**
 * Check PT availability for request
 */
async function checkPTAvailability(userId, modelClass, supabase) {
  // Estimate PT required (conservative estimate)
  const estimatedPT = modelClass === 'advanced' ? 7 : 3; // Medium response
  
  const { data, error } = await supabase.rpc('check_pt_availability', {
    p_user_id: userId,
    p_pt_required: estimatedPT,
    p_pt_type: modelClass
  });
  
  if (error) {
    console.error('Error checking PT availability:', error);
    return {
      available: false,
      reason: 'check_failed',
      message: 'Unable to verify PT availability'
    };
  }
  
  if (!data.available) {
    return {
      available: false,
      reason: data.reason,
      message: getAvailabilityMessage(data),
      pt_available: data.pt_available,
      pt_required: data.pt_required
    };
  }
  
  return {
    available: true,
    pt_available: data.pt_available
  };
}

/**
 * Get user-friendly availability message
 */
function getAvailabilityMessage(data) {
  switch (data.reason) {
    case 'insufficient_pt':
      return `You need ${data.pt_required} PT but only have ${data.pt_available} PT remaining. Please upgrade or purchase more PT.`;
    case 'throttled':
      return `You are currently throttled until ${new Date(data.throttle_until).toLocaleTimeString()}.`;
    case 'user_not_found':
      return 'User account not found.';
    default:
      return 'PT not available for this request.';
  }
}

/**
 * Calculate cooldown duration based on violation severity
 */
export function calculateCooldownDuration(violationType, violationCount = 1) {
  const baseDurations = {
    burn_rate_40pct: 30, // 30 minutes
    burn_rate_60pct: 120, // 2 hours
    burn_rate_80pct: 1440, // 24 hours
    advanced_hard_cap: 60, // 1 hour
    repeated_violation: 180 // 3 hours
  };
  
  let duration = baseDurations[violationType] || 30;
  
  // Increase duration for repeated violations
  if (violationCount > 1) {
    duration = duration * Math.min(violationCount, 4); // Max 4x
  }
  
  return duration;
}

/**
 * Get throttle statistics for user
 */
export async function getThrottleStats(userId, supabase) {
  // Get burn rate history
  const { data: burnRates } = await supabase
    .from('pt_burn_rate')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  
  // Get cap breach history
  const { data: capBreaches } = await supabase
    .from('advanced_pt_caps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  // Calculate statistics
  const throttleCount = burnRates?.filter(b => b.throttle_triggered).length || 0;
  const softCapBreaches = capBreaches?.filter(c => c.soft_cap_breached).length || 0;
  const hardCapBreaches = capBreaches?.filter(c => c.hard_cap_breached).length || 0;
  
  const avgBurnRate = burnRates?.length > 0
    ? burnRates.reduce((sum, b) => sum + parseFloat(b.burn_percentage), 0) / burnRates.length
    : 0;
  
  return {
    throttleCount,
    softCapBreaches,
    hardCapBreaches,
    avgBurnRate: Math.round(avgBurnRate * 100) / 100,
    recentBurnRates: burnRates?.slice(0, 7) || [],
    recentCapStatus: capBreaches?.[0] || null
  };
}

/**
 * Apply overflow fee for hard cap breach
 */
export async function applyOverflowFee(userId, advancedPTUsed, supabase) {
  // Overflow fee is 2x the normal Advanced PT rate
  const normalRate = 0.035; // $0.035 per Advanced PT
  const overflowRate = normalRate * 2;
  const overflowFee = advancedPTUsed * overflowRate;
  
  // Update cap record with overflow fee
  const { data: user } = await supabase
    .from('users')
    .select('billing_cycle_start')
    .eq('id', userId)
    .single();
  
  if (user) {
    await supabase
      .from('advanced_pt_caps')
      .update({
        overflow_pt_used: advancedPTUsed,
        overflow_fee_usd: overflowFee,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('billing_cycle_start', user.billing_cycle_start);
  }
  
  return {
    overflowPTUsed: advancedPTUsed,
    overflowFee,
    overflowRate
  };
}

/**
 * Get user's current throttle status summary
 */
export async function getThrottleStatusSummary(userId, supabase) {
  const throttleStatus = await isUserThrottled(userId, supabase);
  const burnRateCheck = await checkBurnRate(userId, supabase);
  const capCheck = await checkAdvancedCaps(userId, supabase);
  const stats = await getThrottleStats(userId, supabase);
  
  return {
    currentlyThrottled: throttleStatus.throttled,
    throttleReason: throttleStatus.reason,
    throttleUntil: throttleStatus.throttleUntil,
    burnRate72h: burnRateCheck.burn_percentage,
    advancedUsagePercentage: capCheck.advanced_percentage,
    softCapBreached: capCheck.status === 'soft_cap_breached',
    hardCapBreached: capCheck.status === 'hard_cap_breached',
    historicalStats: stats
  };
}

