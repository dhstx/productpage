/**
 * Usage Monitoring Dashboard
 * Comprehensive view of Points usage, throttle status, and warnings
 */

import React, { useState, useEffect } from 'react';
import { PTStatusCard } from './PTHealthBar';
import "@/styles/usage.css";

export default function UsageMonitoringDashboard({ userId }) {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch usage data
  useEffect(() => {
    if (!userId) return;
    
    async function fetchUsageData() {
      try {
        const response = await fetch(`/api/pt/usage?userId=${userId}`);
        const data = await response.json();
        const normalized = normalizeUsagePayload(data);
        setUsageData(normalized);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchUsageData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsageData, 30000);
    return () => clearInterval(interval);
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="usage-card" style={{ color: 'var(--text)' }}>
        Error loading usage data: {error}
      </div>
    );
  }
  
  if (!usageData) {
    return null;
  }
  
  const {
    ptStatus,
    throttleStatus,
    recentUsage,
    warnings,
    daysInCycle,
    daysInMonth
  } = usageData;
  
  return (
    <div className="usage-monitoring-dashboard space-y-6">
      {/* Point Status Card */}
      <PTStatusCard
        userPTStatus={ptStatus}
        daysInCycle={daysInCycle}
        daysInMonth={daysInMonth}
      />
      
      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <WarningsPanel warnings={warnings} />
      )}
      
      {/* Throttle Status */}
      {throttleStatus && (
        <ThrottleStatusPanel throttleStatus={throttleStatus} />
      )}
      
      {/* Recent Usage */}
      {recentUsage && recentUsage.length > 0 && (
        <RecentUsagePanel recentUsage={recentUsage} />
      )}
      
      {/* Usage Statistics */}
      <UsageStatisticsPanel usageData={usageData} />
    </div>
  );
}

function normalizeUsagePayload(payload) {
  if (!payload) {
    return null;
  }

  if (payload.ptStatus) {
    return payload;
  }

  const core = payload.core || {};
  const advanced = payload.advanced || {};

  return {
    ptStatus: {
      corePTAllocated: core.total ?? 0,
      corePTUsed: core.used ?? 0,
      advancedPTAllocated: advanced.total ?? 0,
      advancedPTUsed: advanced.used ?? 0,
      billingCycleEnd: payload.reset_date ?? null,
      throttleActive: false
    },
    throttleStatus: payload.throttleStatus || null,
    recentUsage: payload.recentUsage || [],
    statistics: payload.statistics || null,
    warnings: payload.warnings || [],
    daysInCycle: payload.days_until_reset ?? 0,
    daysInMonth: 30
  };
}

/**
 * Warnings Panel
 */
function WarningsPanel({ warnings }) {
  return (
    <div className="usage-card">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        ⚠️ Warnings
      </h4>
      <div className="space-y-2">
        {warnings.map((warning, index) => (
          <div key={index} className="text-sm" style={{ color: 'var(--text)' }}>
            <span className="font-medium">{warning.type}:</span> {warning.message}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Throttle Status Panel
 */
function ThrottleStatusPanel({ throttleStatus }) {
  const {
    currentlyThrottled,
    throttleReason,
    throttleUntil,
    burnRate72h,
    advancedUsagePercentage,
    softCapBreached,
    hardCapBreached,
    historicalStats
  } = throttleStatus;
  
  return (
    <div className="usage-card">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        {currentlyThrottled ? '⏸️ Throttle Active' : '✅ No Active Throttles'}
      </h4>

      {currentlyThrottled && (
        <div
          className="mb-4"
          style={{
            padding: 12,
            background: 'var(--bg-elev)',
            border: '1px solid var(--card-border)',
            borderRadius: 8,
            color: 'var(--text)'
          }}
        >
          <div className="text-sm">
            <strong>Reason:</strong> {throttleReason}
          </div>
          <div className="text-sm mt-1">
            <strong>Expires:</strong> {new Date(throttleUntil).toLocaleString()}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="72h Burn Rate"
          value={`${burnRate72h}%`}
          status={burnRate72h > 40 ? 'danger' : burnRate72h > 30 ? 'warning' : 'ok'}
          threshold="Limit: 40%"
        />

        <MetricCard
          label="Advanced Usage"
          value={`${advancedUsagePercentage}%`}
          status={hardCapBreached ? 'danger' : softCapBreached ? 'warning' : 'ok'}
          threshold={`Soft: 20%, Hard: 25%`}
        />
      </div>

      {/* Historical Stats */}
      {historicalStats && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
          <div className="text-xs space-y-1" style={{ color: 'var(--muted)' }}>
            <div>Throttle events: {historicalStats.throttleCount}</div>
            <div>Soft cap breaches: {historicalStats.softCapBreaches}</div>
            <div>Hard cap breaches: {historicalStats.hardCapBreaches}</div>
            <div>Avg burn rate: {historicalStats.avgBurnRate}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Metric Card
 */
function MetricCard({ label, value, status, threshold }) {
  return (
    <div className="usage-card p-3">
      <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
      {threshold && (
        <div className="text-xs mt-1 usage-subtle">{threshold}</div>
      )}
    </div>
  );
}

/**
 * Recent Usage Panel
 */
function RecentUsagePanel({ recentUsage }) {
  return (
    <div className="usage-card">
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
        Recent Activity
      </h4>
      <div className="space-y-2">
        {recentUsage.slice(0, 5).map((usage, index) => (
          <div key={index} className="flex items-center justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'var(--bg-elev)', border: '1px solid var(--card-border)', color: 'var(--text)' }}>
                {usage.model_class}
              </span>
              <span style={{ color: 'var(--text)' }}>{usage.agent_id}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="usage-subtle">{usage.pt_consumed} Points</span>
              <span className="text-xs usage-subtle">
                {new Date(usage.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Usage Statistics Panel
 */
function UsageStatisticsPanel({ usageData }) {
  const { statistics } = usageData;
  
  if (!statistics) return null;
  
  return (
    <div className="usage-card">
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
        Usage Statistics
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={statistics.totalRequests}
          icon="📊"
        />
        <StatCard
          label="Core Requests"
          value={statistics.coreRequests}
          icon="🟦"
        />
        <StatCard
          label="Advanced Requests"
          value={statistics.advancedRequests}
          icon="🟪"
        />
        <StatCard
          label="Avg Points/Request"
          value={statistics.avgPTPerRequest.toFixed(1)}
          icon="📈"
        />
      </div>

      {/* Model Distribution Chart */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>
          Model Distribution
        </div>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div
            style={{ width: `${statistics.corePercentage}%`, background: 'var(--accent-gold)' }}
            title={`Core: ${statistics.corePercentage}%`}
          />
          <div
            style={{ width: `${statistics.advancedPercentage}%`, background: 'color-mix(in oklab, var(--accent-gold) 50%, transparent)' }}
            title={`Advanced: ${statistics.advancedPercentage}%`}
          />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
          <span>Core: {statistics.corePercentage}%</span>
          <span>Advanced: {statistics.advancedPercentage}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Card
 */
function StatCard({ label, value, icon }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}

/**
 * Point Cost Estimator Component
 * Shows estimated Point cost before sending request
 */
export function PTCostEstimator({ message, model = 'auto', responseLength = 'medium' }) {
  const [estimate, setEstimate] = useState(null);
  
  useEffect(() => {
    if (!message || message.length < 10) {
      setEstimate(null);
      return;
    }
    
    // Debounce estimation
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            model,
            estimateOnly: true
          })
        });
        
        const data = await response.json();
        setEstimate(data.estimate);
      } catch (err) {
        console.error('Estimation error:', err);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [message, model, responseLength]);
  
  if (!estimate) return null;
  
  return (
    <div className="pt-cost-estimator bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-blue-700">
          Estimated cost:
        </span>
        <span className="font-semibold text-blue-900">
          {estimate.ptCost} Points
          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
            estimate.ptType === 'advanced' 
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {estimate.ptType}
          </span>
        </span>
      </div>
    </div>
  );
}

