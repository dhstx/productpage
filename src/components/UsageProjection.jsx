import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function UsageProjection({ ptData, billingCycle }) {
  const [projection, setProjection] = useState(null);

  useEffect(() => {
    if (ptData && billingCycle) {
      calculateProjection();
    }
  }, [ptData, billingCycle]);

  function calculateProjection() {
    const { core, advanced } = ptData;
    const { daysUntilReset } = billingCycle;

    // Calculate days elapsed in current cycle
    const cycleLengthDays = 30; // Assuming 30-day cycles
    const daysElapsed = cycleLengthDays - daysUntilReset;

    if (daysElapsed <= 0) {
      setProjection(null);
      return;
    }

    // Calculate daily usage rate
    const coreDailyRate = core.used / daysElapsed;
    const advancedDailyRate = advanced.used / daysElapsed;

    // Project end-of-cycle usage
    const coreProjected = coreDailyRate * cycleLengthDays;
    const advancedProjected = advancedDailyRate * cycleLengthDays;

    // Calculate percentage of allocation
    const coreProjectedPercent = (coreProjected / core.total) * 100;
    const advancedProjectedPercent = advanced.total > 0 
      ? (advancedProjected / advanced.total) * 100 
      : 0;

    // Determine status
    let status = 'good';
    let message = 'You\'re on track with your usage';
    let icon = CheckCircle;
    let color = 'text-green-600';
    let bgColor = 'bg-green-50';
    let borderColor = 'border-green-200';

    if (coreProjectedPercent > 100 || advancedProjectedPercent > 100) {
      status = 'warning';
      message = 'You may run out of Points before the cycle ends';
      icon = AlertTriangle;
      color = 'text-orange-600';
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
    } else if (coreProjectedPercent > 80 || advancedProjectedPercent > 80) {
      status = 'caution';
      message = 'You\'re using Points faster than expected';
      icon = TrendingUp;
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-200';
    }

    setProjection({
      core: {
        projected: Math.round(coreProjected),
        percent: Math.round(coreProjectedPercent),
      },
      advanced: {
        projected: Math.round(advancedProjected),
        percent: Math.round(advancedProjectedPercent),
      },
      status,
      message,
      icon,
      color,
      bgColor,
      borderColor,
      daysRemaining: daysUntilReset,
    });
  }

  if (!projection) {
    return null;
  }

  const Icon = projection.icon;

  return (
    <div className={`rounded-lg border ${projection.borderColor} ${projection.bgColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${projection.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Usage Projection
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            {projection.message}
          </p>

          <div className="space-y-2">
            {/* Core Points Projection */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Core Points (projected)</span>
                <span>
                  {projection.core.projected} / {ptData.core.total} ({projection.core.percent}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    projection.core.percent > 100
                      ? 'bg-red-500'
                      : projection.core.percent > 80
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(projection.core.percent, 100)}%` }}
                />
              </div>
            </div>

            {/* Advanced Points Projection */}
            {ptData.advanced.total > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Advanced Points (projected)</span>
                  <span>
                    {projection.advanced.projected} / {ptData.advanced.total} ({projection.advanced.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      projection.advanced.percent > 100
                        ? 'bg-red-500'
                        : projection.advanced.percent > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(projection.advanced.percent, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-3">
            {projection.daysRemaining} days remaining in billing cycle
          </p>

          {projection.status !== 'good' && (
            <div className="mt-3">
              <a
                href="/pricing"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Consider upgrading your plan →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

