/**
 * Points Health Bar Component
 * Visual indicator of Points usage with color-coded warnings
 */

import React from 'react';

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
  
  // Determine color and status
  let colorClass, statusText, statusIcon;
  
  if (usagePercentage < 50) {
    colorClass = 'bg-green-500';
    statusText = 'On track';
    statusIcon = '🟢';
  } else if (usagePercentage < 85) {
    colorClass = 'bg-yellow-500';
    statusText = 'Moderate usage';
    statusIcon = '🟡';
  } else {
    colorClass = 'bg-red-500';
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
          <span className="text-sm font-medium text-gray-700">
            {statusIcon} {ptLabel}
          </span>
          <span className="text-xs text-gray-500">
            {statusText}
          </span>
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {ptUsed.toLocaleString()} / {ptAllocated.toLocaleString()} Points
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, usagePercentage)}%` }}
        />
        
        {/* Projection indicator (if showing) */}
        {showProjection && projectedPercentage > usagePercentage && (
          <div 
            className="absolute top-0 left-0 h-full bg-gray-400 opacity-30"
            style={{ width: `${Math.min(100, projectedPercentage)}%` }}
          />
        )}
      </div>
      
      {/* Details */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
        <span>
          {ptRemaining.toLocaleString()} Points remaining
        </span>
        <span>
          {Math.round(usagePercentage)}% used
        </span>
      </div>
      
      {/* Projection message */}
      {showProjection && daysInCycle > 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          At current rate: ~{projectedUsage.toLocaleString()} Points by month end
          {projectedUsage > ptAllocated && (
            <span className="text-red-600 font-medium ml-1">
              (⚠️ {(projectedUsage - ptAllocated).toLocaleString()} Points over limit)
            </span>
          )}
        </div>
      )}
      
      {/* Warning messages */}
      {usagePercentage >= 85 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <strong>⚠️ Warning:</strong> You've used {Math.round(usagePercentage)}% of your Points. 
          Throttle activates at 100%. Consider upgrading or slowing usage.
        </div>
      )}
      
      {usagePercentage >= 50 && usagePercentage < 85 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
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
  let statusColor, statusText, statusIcon;
  
  if (advancedPercentage >= hardCap) {
    statusColor = 'text-red-600';
    statusText = 'Hard cap exceeded';
    statusIcon = '🚫';
  } else if (advancedPercentage >= softCap) {
    statusColor = 'text-yellow-600';
    statusText = 'Approaching limit';
    statusIcon = '⚠️';
  } else {
    statusColor = 'text-green-600';
    statusText = 'Within limits';
    statusIcon = '✅';
  }
  
  return (
    <div className={`advanced-pt-sub-bar ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">
            {statusIcon} Advanced Model Usage
          </span>
        </div>
        <div className={`text-xs font-semibold ${statusColor}`}>
          {advancedPct}% of total Points
        </div>
      </div>
      
      {/* Progress bar with cap indicators */}
      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Soft cap indicator */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-yellow-400"
          style={{ left: `${softCapPct}%` }}
        />
        
        {/* Hard cap indicator */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-red-500"
          style={{ left: `${hardCapPct}%` }}
        />
        
        {/* Usage bar */}
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
            advancedPercentage >= hardCap ? 'bg-red-500' :
            advancedPercentage >= softCap ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, advancedPct)}%` }}
        />
      </div>
      
      {/* Cap labels */}
      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
        <span>Soft cap: {softCapPct}%</span>
        <span>Hard cap: {hardCapPct}%</span>
      </div>
      
      {/* Warning messages */}
      {advancedPercentage >= hardCap && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <strong>🚫 Hard Cap Exceeded:</strong> You've exceeded the Advanced model usage limit. 
          Overflow fees (2× rate) apply. Upgrade your tier or purchase more Advanced Points.
        </div>
      )}
      
      {advancedPercentage >= softCap && advancedPercentage < hardCap && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
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
    <div className={`pt-status-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Point Usage
        </h3>
        {throttleActive && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
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
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Billing cycle resets in:</span>
            <span className="font-medium text-gray-900">
              {daysRemaining} days
            </span>
          </div>
          <div className="mt-1 text-gray-500">
            {cycleEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}
      
      {/* Upgrade CTA (if usage high) */}
      {(corePTUsed / corePTAllocated) > 0.80 && (
        <div className="mt-4">
          <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade for More Points →
          </button>
        </div>
      )}
    </div>
  );
}

