/**
 * Points Health Bar Component
 * Visual indicator of Points usage with color-coded warnings
 */

import React from 'react';
import "@/styles/usage.css";

export default function PTHealthBar({ 
  ptUsed, 
  ptAllocated, 
  ptType = 'core',
  showProjection = true,
  daysInCycle = 0,
  daysInMonth = 30,
  className = ''
}) {
  // Calculate usage percentage
  const usagePercentage = ptAllocated > 0 ? (ptUsed / ptAllocated) * 100 : 0;
  const ptRemaining = Math.max(0, ptAllocated - ptUsed);
  
  // Calculate projected usage
  const dailyUsage = daysInCycle > 0 ? ptUsed / daysInCycle : 0;
  const projectedUsage = Math.round(ptUsed + (dailyUsage * (daysInMonth - daysInCycle)));
  const projectedPercentage = ptAllocated > 0 ? (projectedUsage / ptAllocated) * 100 : 0;
  
  // Determine status text/icon (visuals tokenized below)
  let statusText, statusIcon;
  
  if (usagePercentage < 50) {
    statusText = 'On track';
    statusIcon = '🟢';
  } else if (usagePercentage < 85) {
    statusText = 'Moderate usage';
    statusIcon = '🟡';
  } else {
    statusText = 'High usage';
    statusIcon = '🔴';
  }
  
  // Format label for display
  const ptLabel = ptType === 'core' ? 'Core Points' : 'Advanced Points';
  
  return (
    <div className={`pt-health-bar ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {statusIcon} {ptLabel}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {statusText}
          </span>
        </div>
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {ptUsed.toLocaleString()} / {ptAllocated.toLocaleString()} Points
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative w-full overflow-hidden" style={{ height: 8, borderRadius: 8, background: 'var(--bg-elev)', border: '1px solid var(--card-border)' }}>
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, usagePercentage)}%`, background: 'var(--accent-gold)', borderRadius: 8 }}
        />
        
        {/* Projection indicator (if showing) */}
        {showProjection && projectedPercentage > usagePercentage && (
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${Math.min(100, projectedPercentage)}%`, background: 'color-mix(in oklab, var(--accent-gold) 40%, transparent)', borderRadius: 8 }}
          />
        )}
      </div>
      
      {/* Details */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--muted)' }}>
        <span>
          {ptRemaining.toLocaleString()} Points remaining
        </span>
        <span>
          {Math.round(usagePercentage)}% used
        </span>
      </div>
      
      {/* Projection message */}
      {showProjection && daysInCycle > 0 && (
        <div className="mt-2 text-xs italic" style={{ color: 'var(--muted)' }}>
          At current rate: ~{projectedUsage.toLocaleString()} Points by month end
          {projectedUsage > ptAllocated && (
            <span className="font-medium ml-1" style={{ color: 'var(--text)' }}>
              (⚠️ {(projectedUsage - ptAllocated).toLocaleString()} Points over limit)
            </span>
          )}
        </div>
      )}
      
      {/* Warning messages */}
      {usagePercentage >= 85 && (
        <div className="mt-2 p-2 usage-card text-xs" style={{ padding: 8 }}>
          <strong>⚠️ Warning:</strong> You've used {Math.round(usagePercentage)}% of your Points. 
          Throttle activates at 100%. Consider upgrading or slowing usage.
        </div>
      )}
      
      {usagePercentage >= 50 && usagePercentage < 85 && (
        <div className="mt-2 p-2 usage-card text-xs" style={{ padding: 8 }}>
          <strong>💡 Tip:</strong> You've used {Math.round(usagePercentage)}% of your Points. 
          Monitor your usage to avoid running out before month end.
        </div>
      )}
    </div>
  );
}

/**
 * Advanced Points Sub-Bar Component
 * Shows Advanced Points usage as percentage of total Points
 */
export function AdvancedPTSubBar({ 
  advancedPTUsed, 
  totalPTUsed, 
  softCap = 0.20, 
  hardCap = 0.25,
  className = ''
}) {
  // Calculate Advanced percentage
  const advancedPercentage = totalPTUsed > 0 ? (advancedPTUsed / totalPTUsed) : 0;
  const advancedPct = Math.round(advancedPercentage * 100);
  const softCapPct = Math.round(softCap * 100);
  const hardCapPct = Math.round(hardCap * 100);
  
  // Determine status
  let statusText, statusIcon;
  
  if (advancedPercentage >= hardCap) {
    statusText = 'Hard cap exceeded';
    statusIcon = '🚫';
  } else if (advancedPercentage >= softCap) {
    statusText = 'Approaching limit';
    statusIcon = '⚠️';
  } else {
    statusText = 'Within limits';
    statusIcon = '✅';
  }
  
  return (
    <div className={`advanced-pt-sub-bar ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            {statusIcon} Advanced Model Usage
          </span>
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
          {advancedPct}% of total Points
        </div>
      </div>
      
      {/* Progress bar with cap indicators */}
      <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elev)', border: '1px solid var(--card-border)' }}>
        {/* Soft cap indicator */}
        <div className="absolute top-0 h-full w-0.5" style={{ left: `${softCapPct}%`, background: 'var(--card-border)' }} />
        
        {/* Hard cap indicator */}
        <div className="absolute top-0 h-full w-0.5" style={{ left: `${hardCapPct}%`, background: 'var(--card-border)' }} />
        
        {/* Usage bar */}
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, advancedPct)}%`, background: 'var(--accent-gold)' }}
        />
      </div>
      
      {/* Cap labels */}
      <div className="flex items-center justify-between mt-1 text-xs" style={{ color: 'var(--muted)' }}>
        <span>Soft cap: {softCapPct}%</span>
        <span>Hard cap: {hardCapPct}%</span>
      </div>
      
      {/* Warning messages */}
      {advancedPercentage >= hardCap && (
        <div className="mt-2 p-2 usage-card text-xs" style={{ padding: 8 }}>
          <strong>🚫 Hard Cap Exceeded:</strong> You've exceeded the Advanced model usage limit. 
          Overflow fees (2× rate) apply. Upgrade your tier or purchase more Advanced Points.
        </div>
      )}
      
      {advancedPercentage >= softCap && advancedPercentage < hardCap && (
        <div className="mt-2 p-2 usage-card text-xs" style={{ padding: 8 }}>
          <strong>⚠️ Soft Cap Reached:</strong> You're approaching the Advanced model usage limit ({hardCapPct}%). 
          Consider upgrading to Pro Plus or Business tier for higher limits.
        </div>
      )}
    </div>
  );
}

/**
 * Combined Points Status Component
 * Shows both Core and Advanced Points with all indicators
 */
export function PTStatusCard({ 
  userPTStatus,
  daysInCycle = 0,
  daysInMonth = 30,
  className = ''
}) {
  const {
    corePTAllocated = 0,
    corePTUsed = 0,
    advancedPTAllocated = 0,
    advancedPTUsed = 0,
    billingCycleEnd,
    throttleActive = false
  } = userPTStatus || {};
  
  const totalPTUsed = corePTUsed + advancedPTUsed;
  
  // Calculate days remaining
  const cycleEnd = billingCycleEnd ? new Date(billingCycleEnd) : null;
  const now = new Date();
  const daysRemaining = cycleEnd ? Math.ceil((cycleEnd - now) / (1000 * 60 * 60 * 24)) : 0;
  
  return (
    <div className={`pt-status-card usage-card p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          Point Usage
        </h3>
        {throttleActive && (
          <span className="px-2 py-1 text-xs font-medium rounded" style={{ background: 'var(--bg-elev)', color: 'var(--text)', border: '1px solid var(--card-border)' }}>
            ⏸️ Throttled
          </span>
        )}
      </div>
      
      {/* Core Points Health Bar */}
          <PTHealthBar
        ptUsed={corePTUsed}
        ptAllocated={corePTAllocated}
        ptType="core"
        showProjection={true}
        daysInCycle={daysInCycle}
        daysInMonth={daysInMonth}
        className="mb-4"
      />
      
          {/* Advanced Points Health Bar (if allocated) */}
      {advancedPTAllocated > 0 && (
        <>
          <PTHealthBar
            ptUsed={advancedPTUsed}
            ptAllocated={advancedPTAllocated}
            ptType="advanced"
            showProjection={false}
            className="mb-4"
          />
          
          {/* Advanced Points Sub-Bar */}
          <AdvancedPTSubBar
            advancedPTUsed={advancedPTUsed}
            totalPTUsed={totalPTUsed}
            softCap={0.20}
            hardCap={0.25}
            className="mb-4"
          />
        </>
      )}
      
      {/* Billing cycle info */}
      {cycleEnd && (
        <div className="mt-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--card-border)', color: 'var(--muted)' }}>
          <div className="flex items-center justify-between">
            <span>Billing cycle resets in:</span>
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              {daysRemaining} days
            </span>
          </div>
          <div className="mt-1" style={{ color: 'var(--muted)' }}>
            {cycleEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}
      
      {/* Upgrade CTA (if usage high) */}
      {(corePTUsed / corePTAllocated) > 0.80 && (
        <div className="mt-4">
          <button
            className="w-full text-sm font-medium rounded-lg transition-colors"
            style={{
              padding: '8px 16px',
              background: 'var(--accent-gold)',
              color: 'var(--text)'
            }}
          >
            Upgrade for More Points →
          </button>
        </div>
      )}
    </div>
  );
}

