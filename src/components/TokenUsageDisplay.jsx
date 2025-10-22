import React from 'react';
import { AlertCircle, TrendingUp, Calendar, Zap } from 'lucide-react';

/**
 * TokenUsageDisplay Component
 * 
 * Displays user's token usage, remaining balance, and upgrade prompts
 */
const TokenUsageDisplay = ({ tokenStats, tier = 'free', onUpgrade }) => {
  if (!tokenStats) {
    return null;
  }

  const { allocated, used, remaining, resetDate } = tokenStats;
  const usagePercentage = Math.round((used / allocated) * 100);
  
  // Determine status color
  const getStatusColor = () => {
    if (usagePercentage >= 90) return 'text-red-600 bg-red-50';
    if (usagePercentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tierNames = {
    anonymous: 'Anonymous',
    free: 'Free',
    starter: 'Starter',
    professional: 'Professional',
    business: 'Business',
    enterprise: 'Enterprise'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Token Usage</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
          {tierNames[tier] || 'Free'} Plan
        </span>
      </div>

      {/* Usage Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Used</span>
          <span className="font-semibold text-gray-900">
            {used.toLocaleString()} / {allocated.toLocaleString()} tokens
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{usagePercentage}% used</span>
          <span>{remaining.toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Reset Date */}
      {resetDate && (
        <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
          <Calendar className="w-4 h-4" />
          <span>Resets on {formatDate(resetDate)}</span>
        </div>
      )}

      {/* Warning Message */}
      {usagePercentage >= 80 && (
        <div className={`flex items-start gap-2 p-3 rounded-lg ${getStatusColor()}`}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-medium">
              {usagePercentage >= 90 
                ? 'Almost out of tokens!' 
                : 'Running low on tokens'}
            </p>
            <p className="opacity-90">
              {usagePercentage >= 90
                ? `Only ${remaining} tokens left. Upgrade to continue chatting without interruption.`
                : `You've used ${usagePercentage}% of your monthly allocation. Consider upgrading for more tokens.`}
            </p>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {tier === 'free' && usagePercentage >= 50 && (
        <button
          onClick={onUpgrade}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          Upgrade to Starter - 500 tokens/mo
        </button>
      )}
    </div>
  );
};

export default TokenUsageDisplay;

