import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Download } from 'lucide-react';

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    teamMembers: 50,
    currentToolsCost: 5000,
    adminHoursPerWeek: 20,
    platformsManaged: 3
  });

  const [results, setResults] = useState({
    annualSavings: 0,
    timeSavedPerMonth: 0,
    efficiencyImprovement: 0,
    paybackPeriod: 0,
    threeYearROI: 0
  });

  // Calculate ROI whenever inputs change
  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const { teamMembers: _teamMembers, currentToolsCost, adminHoursPerWeek, platformsManaged: _platformsManaged } = inputs;

    // Assumptions
    const avgHourlyRate = 50; // Average hourly rate for admin staff
    const dhstxMonthlyCost = 2499; // Professional plan
    const efficiencyGain = 0.40; // 40% efficiency improvement
    const toolConsolidation = 0.60; // 60% reduction in other tools

    // Calculations
    const currentAnnualToolsCost = currentToolsCost * 12;
    const _currentAnnualLaborCost = adminHoursPerWeek * 52 * avgHourlyRate;
    const dhstxAnnualCost = dhstxMonthlyCost * 12;

    // Savings from tool consolidation
    const toolsSavings = currentAnnualToolsCost * toolConsolidation;

    // Savings from efficiency gains
    const timeSaved = adminHoursPerWeek * efficiencyGain;
    const laborSavings = timeSaved * 52 * avgHourlyRate;

    // Total savings
    const totalAnnualSavings = toolsSavings + laborSavings - dhstxAnnualCost;

    // Efficiency improvement percentage
    const efficiencyImprovement = Math.round(efficiencyGain * 100);

    // Payback period (months)
    const paybackPeriod = dhstxAnnualCost / (totalAnnualSavings / 12);

    // 3-year ROI
    const threeYearSavings = totalAnnualSavings * 3;
    const threeYearInvestment = dhstxAnnualCost * 3;
    const threeYearROI = ((threeYearSavings - threeYearInvestment) / threeYearInvestment) * 100;

    setResults({
      annualSavings: Math.max(0, Math.round(totalAnnualSavings)),
      timeSavedPerMonth: Math.round(timeSaved * 4.33), // weeks to months
      efficiencyImprovement,
      paybackPeriod: Math.max(0.1, paybackPeriod).toFixed(1),
      threeYearROI: Math.round(threeYearROI)
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const downloadReport = () => {
    alert('ROI Report download feature coming soon! For now, take a screenshot of your results.');
  };

  return (
    <section className="py-24 bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
              <Calculator className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">ROI Calculator</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              CALCULATE YOUR SAVINGS
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto">
              See how much time and money your organization can save with DHStx
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
              <h3 className="text-2xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
                Your Organization
              </h3>
              
              <div className="space-y-6">
                {/* Team Members */}
                <div>
                  <label className="block text-[#F2F2F2] text-sm font-bold mb-2 uppercase tracking-tight">
                    Number of Team Members
                  </label>
                  <input
                    type="number"
                    value={inputs.teamMembers}
                    onChange={(e) => handleInputChange('teamMembers', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                    min="1"
                  />
                  <p className="text-[#B3B3B3] text-xs mt-1">Total staff in your organization</p>
                </div>

                {/* Current Tools Cost */}
                <div>
                  <label className="block text-[#F2F2F2] text-sm font-bold mb-2 uppercase tracking-tight">
                    Current Monthly Tools Cost ($)
                  </label>
                  <input
                    type="number"
                    value={inputs.currentToolsCost}
                    onChange={(e) => handleInputChange('currentToolsCost', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                    min="0"
                  />
                  <p className="text-[#B3B3B3] text-xs mt-1">Combined cost of all management tools</p>
                </div>

                {/* Admin Hours */}
                <div>
                  <label className="block text-[#F2F2F2] text-sm font-bold mb-2 uppercase tracking-tight">
                    Admin Hours Per Week
                  </label>
                  <input
                    type="number"
                    value={inputs.adminHoursPerWeek}
                    onChange={(e) => handleInputChange('adminHoursPerWeek', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                    min="0"
                  />
                  <p className="text-[#B3B3B3] text-xs mt-1">Time spent on administrative tasks</p>
                </div>

                {/* Platforms Managed */}
                <div>
                  <label className="block text-[#F2F2F2] text-sm font-bold mb-2 uppercase tracking-tight">
                    Platforms Managed
                  </label>
                  <input
                    type="number"
                    value={inputs.platformsManaged}
                    onChange={(e) => handleInputChange('platformsManaged', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                    min="1"
                  />
                  <p className="text-[#B3B3B3] text-xs mt-1">Number of separate platforms/tools</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Annual Savings */}
              <div className="bg-gradient-to-br from-[#FFC96C]/10 to-transparent border border-[#FFC96C]/20 rounded-[4px] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">Annual Savings</div>
                    <div className="text-4xl font-bold text-[#FFC96C]">
                      ${results.annualSavings.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-[#F2F2F2] text-sm">
                  Total cost savings in your first year with DHStx
                </p>
              </div>

              {/* Other Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] border border-[#202020] rounded-[4px] p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#FFC96C]" />
                    <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">Time Saved</div>
                  </div>
                  <div className="text-3xl font-bold text-[#F2F2F2]">{results.timeSavedPerMonth}h</div>
                  <div className="text-xs text-[#B3B3B3] mt-1">Per month</div>
                </div>

                <div className="bg-[#1A1A1A] border border-[#202020] rounded-[4px] p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#FFC96C]" />
                    <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">Efficiency</div>
                  </div>
                  <div className="text-3xl font-bold text-[#F2F2F2]">{results.efficiencyImprovement}%</div>
                  <div className="text-xs text-[#B3B3B3] mt-1">Improvement</div>
                </div>

                <div className="bg-[#1A1A1A] border border-[#202020] rounded-[4px] p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-[#FFC96C]" />
                    <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">Payback</div>
                  </div>
                  <div className="text-3xl font-bold text-[#F2F2F2]">{results.paybackPeriod}</div>
                  <div className="text-xs text-[#B3B3B3] mt-1">Months</div>
                </div>

                <div className="bg-[#1A1A1A] border border-[#202020] rounded-[4px] p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#FFC96C]" />
                    <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">3-Year ROI</div>
                  </div>
                  <div className="text-3xl font-bold text-[#F2F2F2]">{results.threeYearROI}%</div>
                  <div className="text-xs text-[#B3B3B3] mt-1">Return</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={downloadReport}
                  className="btn-system w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full Report
                </button>
                {/* UI-only removal per spec: View Pricing Plans button removed */}
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-[#1A1A1A] rounded-[4px] border border-[#202020]">
                <p className="text-[#B3B3B3] text-xs">
                  * Calculations based on industry averages and typical customer results. Actual savings may vary based on your specific use case and implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
