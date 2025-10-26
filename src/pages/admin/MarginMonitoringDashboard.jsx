/**
 * Admin Margin Monitoring Dashboard
 * Traffic-light system for real-time margin health monitoring
 */

import React, { useState, useEffect } from 'react';

export default function MarginMonitoringDashboard() {
  const [marginData, setMarginData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  useEffect(() => {
    fetchMarginData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMarginData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  
  async function fetchMarginData() {
    try {
      const response = await fetch('/api/admin/margin-monitoring');
      const data = await response.json();
      setMarginData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching margin data:', error);
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!marginData) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading margin data
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Margin Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time margin health and Advanced model usage tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh
            </label>
            <button
              onClick={fetchMarginData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Now
            </button>
          </div>
        </div>
        
        {/* Platform-wide Status */}
        <PlatformStatusCard platform={marginData.platform} />
        
        {/* Tier Status Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tier-Level Margins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marginData.tiers.map(tier => (
              <TierStatusCard key={tier.tier} tier={tier} />
            ))}
          </div>
        </div>
        
        {/* Active Alerts */}
        {marginData.alerts && marginData.alerts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Active Alerts
            </h2>
            <div className="space-y-4">
              {marginData.alerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </div>
        )}
        
        {/* Historical Trends */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7-Day Margin Trend
          </h2>
          <MarginTrendChart data={marginData.historical} />
        </div>
      </div>
    </div>
  );
}

/**
 * Platform Status Card
 */
function PlatformStatusCard({ platform }) {
  const marginPct = Math.round(platform.grossMargin * 100);
  const advancedPct = Math.round(platform.advancedPercentage * 100);
  const status = platform.marginStatus.status;
  
  const statusColors = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };
  
  const statusIcons = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴'
  };
  
  return (
    <div className={`rounded-lg border-2 p-6 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{statusIcons[status]}</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Platform-Wide Status
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            {platform.marginStatus.label} — Last 24 hours
          </p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          label="Gross Margin"
          value={`${marginPct}%`}
          target="Target: >65%"
          status={status}
          large
        />
        <MetricCard
          label="Advanced Usage"
          value={`${advancedPct}%`}
          target="Target: <25%"
          status={platform.burnStatus.status}
          large
        />
        <MetricCard
          label="Revenue (24h)"
          value={`$${platform.totalRevenue.toFixed(2)}`}
          target={`COGS: $${platform.totalCOGS.toFixed(2)}`}
          status="green"
        />
        <MetricCard
          label="Total Points (24h)"
          value={platform.totalPT.toLocaleString()}
          target={`Core: ${platform.corePT} / Adv: ${platform.advancedPT}`}
          status="green"
        />
      </div>
    </div>
  );
}

/**
 * Tier Status Card
 */
function TierStatusCard({ tier }) {
  const marginPct = Math.round(tier.grossMargin * 100);
  const advancedPct = Math.round(tier.advancedPercentage * 100);
  const status = tier.marginStatus.status;
  
  const statusColors = {
    green: 'border-green-300 bg-white',
    yellow: 'border-yellow-300 bg-yellow-50',
    red: 'border-red-300 bg-red-50'
  };
  
  const statusIcons = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴'
  };
  
  return (
    <div className={`rounded-lg border-2 p-4 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusIcons[status]}</span>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {tier.tier.replace('_', ' ')}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Margin</span>
            <span className={`font-semibold ${
              status === 'green' ? 'text-green-700' :
              status === 'yellow' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {marginPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                status === 'green' ? 'bg-green-500' :
                status === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, marginPct)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Advanced Usage</span>
            <span className="font-semibold text-gray-900">
              {advancedPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500"
              style={{ width: `${Math.min(100, advancedPct)}%` }}
            />
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Revenue (24h):</span>
            <span className="font-medium">${tier.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>COGS (24h):</span>
            <span className="font-medium">${tier.totalCOGS.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Points:</span>
            <span className="font-medium">{tier.totalPT}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Alert Card
 */
function AlertCard({ alert }) {
  const statusColors = {
    yellow: 'bg-yellow-50 border-yellow-300',
    red: 'bg-red-50 border-red-300'
  };
  
  const statusIcons = {
    yellow: '⚠️',
    red: '🚨'
  };
  
  return (
    <div className={`rounded-lg border-2 p-4 ${statusColors[alert.status]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{statusIcons[alert.status]}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {alert.scope.toUpperCase()} Alert
            {alert.tier && ` — ${alert.tier}`}
          </h4>
          <p className="text-sm text-gray-700">
            {alert.message}
          </p>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
              View Details
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Apply Mitigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card
 */
function MetricCard({ label, value, target, status, large = false }) {
  const statusColors = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700'
  };
  
  return (
    <div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`${large ? 'text-3xl' : 'text-2xl'} font-bold ${statusColors[status] || 'text-gray-900'}`}>
        {value}
      </div>
      {target && (
        <div className="text-xs text-gray-500 mt-1">{target}</div>
      )}
    </div>
  );
}

/**
 * Margin Trend Chart (Simple)
 */
function MarginTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        No historical data available
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-2">
        {data.map((day, index) => {
          const marginPct = Math.round(day.grossMargin * 100);
          const status = marginPct >= 65 ? 'green' : marginPct >= 50 ? 'yellow' : 'red';
          
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1">
                <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      status === 'green' ? 'bg-green-500' :
                      status === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, marginPct)}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-900">
                {marginPct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

