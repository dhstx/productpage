/**
 * Usage Monitoring Dashboard
 * Comprehensive view of PT usage, throttle status, and warnings
 */

import React, { useState, useEffect } from 'react';
import { PTStatusCard } from './PTHealthBar';

export default function UsageMonitoringDashboard({ userId }) {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch usage data
  useEffect(() => {
    if (!userId) return;
    
    async function fetchUsageData() {
      try {
        const response = await fetch(`/api/usage/status?userId=${userId}`);
        const data = await response.json();
        setUsageData(data);
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
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
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
      {/* PT Status Card */}
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

/**
 * Warnings Panel
 */
function WarningsPanel({ warnings }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
        ⚠️ Warnings
      </h4>
      <div className="space-y-2">
        {warnings.map((warning, index) => (
          <div key={index} className="text-sm text-yellow-800">
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
    <div className={`rounded-lg p-4 border ${
      currentlyThrottled 
        ? 'bg-red-50 border-red-200' 
        : 'bg-green-50 border-green-200'
    }`}>
      <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
        currentlyThrottled ? 'text-red-900' : 'text-green-900'
      }`}>
        {currentlyThrottled ? '⏸️ Throttle Active' : '✅ No Active Throttles'}
      </h4>
      
      {currentlyThrottled && (
        <div className="mb-4 p-3 bg-white rounded border border-red-300">
          <div className="text-sm text-red-800">
            <strong>Reason:</strong> {throttleReason}
          </div>
          <div className="text-sm text-red-800 mt-1">
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
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
  const statusColors = {
    ok: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <div className={`p-3 rounded border ${statusColors[status]}`}>
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {threshold && (
        <div className="text-xs mt-1 opacity-75">{threshold}</div>
      )}
    </div>
  );
}

/**
 * Recent Usage Panel
 */
function RecentUsagePanel({ recentUsage }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Recent Activity
      </h4>
      <div className="space-y-2">
        {recentUsage.slice(0, 5).map((usage, index) => (
          <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                usage.model_class === 'advanced' 
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {usage.model_class}
              </span>
              <span className="text-gray-700">{usage.agent_id}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{usage.pt_consumed} PT</span>
              <span className="text-gray-400 text-xs">
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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
          label="Avg PT/Request"
          value={statistics.avgPTPerRequest.toFixed(1)}
          icon="📈"
        />
      </div>
      
      {/* Model Distribution Chart */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-600 mb-2">
          Model Distribution
        </div>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500"
            style={{ width: `${statistics.corePercentage}%` }}
            title={`Core: ${statistics.corePercentage}%`}
          />
          <div 
            className="bg-purple-500"
            style={{ width: `${statistics.advancedPercentage}%` }}
            title={`Advanced: ${statistics.advancedPercentage}%`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
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
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

/**
 * PT Cost Estimator Component
 * Shows estimated PT cost before sending request
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
          {estimate.ptCost} PT
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

