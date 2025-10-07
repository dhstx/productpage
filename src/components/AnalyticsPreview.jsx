import { memo, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const AnalyticsPreview = () => {
  const data = useMemo(
    () => [
      { month: 'Jan', spend: 32, savings: 4 },
      { month: 'Feb', spend: 30, savings: 6 },
      { month: 'Mar', spend: 28, savings: 8 },
      { month: 'Apr', spend: 27, savings: 10 },
      { month: 'May', spend: 26, savings: 11 },
      { month: 'Jun', spend: 25, savings: 12 }
    ],
    []
  );

  return (
    <div className="space-y-4" aria-describedby="analytics-summary">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[#F2F2F2] font-semibold uppercase tracking-tight">Spend vs. Optimization</p>
          <p id="analytics-summary" className="text-[#B3B3B3] text-sm">
            Track how optimization initiatives reduce monthly spend across your digital asset portfolio.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#F2F2F2] text-xl font-bold">$25k</p>
          <p className="text-[#B3B3B3] text-xs">Projected spend this quarter</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC96C" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFC96C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
            <XAxis dataKey="month" stroke="#B3B3B3" />
            <YAxis stroke="#B3B3B3" tickFormatter={(value) => `$${value}k`} />
            <Tooltip
              cursor={{ stroke: '#FFC96C', strokeWidth: 1 }}
              contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: 4, border: '1px solid #202020' }}
              labelStyle={{ color: '#F2F2F2' }}
              formatter={(value, name) => [`$${value}k`, name === 'spend' ? 'Spend' : 'Savings']}
            />
            <Area type="monotone" dataKey="spend" stroke="#FFC96C" fill="url(#spend)" strokeWidth={2} />
            <Area type="monotone" dataKey="savings" stroke="#22C55E" fill="url(#savings)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(AnalyticsPreview);
