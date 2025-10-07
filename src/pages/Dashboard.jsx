import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Target, AlertCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { getMockPurchases } from '../lib/stripe';
import { getIntegrationHealth } from '../lib/integrations';

const AnalyticsPreview = lazy(() => import('../components/AnalyticsPreview'));

export default function Dashboard() {
  const purchases = getMockPurchases();
  const integrationHealth = getIntegrationHealth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          ACCOUNT DASHBOARD
        </h1>
        <p className="text-[#B3B3B3]">
          Welcome back! Manage your organization's digital asset portfolio and governance workflows from one place.
        </p>
      </div>

      {/* Asset Hub Access */}
      <section aria-labelledby="asset-hubs-heading" className="space-y-6">
        <h2 id="asset-hubs-heading" className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
          YOUR ASSET HUBS
        </h2>
        {purchases.map((purchase) => {
          const platformHostname = purchase.platformUrl.replace(/^https?:\/\//, '');

          return (
            <div key={purchase.id} className="panel-system p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#FFC96C]" />
                    <h3 className="text-[#F2F2F2] font-bold uppercase tracking-tight">
                      {purchase.productName}
                    </h3>
                  </div>
                  <p className="text-[#B3B3B3] text-sm mb-1" aria-label="Asset hub URL">
                    {platformHostname}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></div>
                    <span className="text-[#B3B3B3] text-sm">Operational &amp; Secure</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>0 Active Assets</span>
                </div>
              </div>

              <p className="text-[#B3B3B3] mt-4 mb-6">
                Access your organization's dedicated asset workspace where teams track entitlements, manage renewals, and
                collaborate on optimization initiatives in real time.
              </p>

              <div className="flex gap-3 flex-wrap">
                <a
                  href={purchase.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Asset Hub
                </a>
                <a
                  href={purchase.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Admin Controls
                </a>
                <Link to="/platforms#analytics" className="btn-system flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Analytics
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Analytics Overview */}
      <section id="analytics" aria-labelledby="analytics-heading" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="analytics-heading" className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
            PORTFOLIO ANALYTICS
          </h2>
          <Link to="/platforms" className="text-[#FFC96C] text-sm hover:underline">
            View All Assets
          </Link>
        </div>
        <div className="panel-system p-6" role="region" aria-live="polite">
          <Suspense fallback={<div className="text-[#B3B3B3] text-sm">Loading analytics...</div>}>
            <AnalyticsPreview />
          </Suspense>
        </div>
      </section>

      {/* System Status */}
      <section aria-labelledby="system-status-heading">
        <h2 id="system-status-heading" className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          SYSTEM STATUS
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Active Optimization Plans"
            value="0"
            subValue="/ 0"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Urgent Actions"
            value="0"
            subValue="/ 0"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Upcoming Renewals"
            value="0"
            subValue="/ 0"
          />
          <StatCard icon={<Users className="w-5 h-5" />} label="Active Stakeholders" value="0" />
        </div>
      </section>

      {/* Integration Health */}
      <section aria-labelledby="integration-health-heading">
        <h2 id="integration-health-heading" className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          INTEGRATION HEALTH
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {integrationHealth.map((integration) => {
            const statusClass =
              integration.status === 'configured' ? 'text-green-400' : 'text-red-400';

            return (
              <div key={integration.name} className="panel-system p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[#F2F2F2] text-sm font-semibold uppercase tracking-tight">
                    {integration.name}
                  </p>
                  <span className={`${statusClass} text-xs font-semibold uppercase tracking-wide`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-[#B3B3B3] text-sm">{integration.details}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Portfolio Alerts */}
      <section aria-labelledby="portfolio-alerts-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="portfolio-alerts-heading"
            className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-[#FFC96C]" />
            PORTFOLIO ALERTS
          </h2>
          <Link to="/platforms" className="text-[#FFC96C] text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="panel-system p-8 text-center" role="status">
          <CheckCircle className="w-12 h-12 text-[#FFC96C] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No critical portfolio alerts. Keep monitoring usage trends for opportunities.</p>
        </div>
      </section>

      {/* Upcoming Renewals */}
      <section aria-labelledby="upcoming-renewals-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="upcoming-renewals-heading"
            className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight flex items-center gap-2"
          >
            <Calendar className="w-5 h-5 text-[#FFC96C]" />
            UPCOMING RENEWALS
          </h2>
          <Link to="/platforms" className="text-[#FFC96C] text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="panel-system p-8 text-center">
          <Calendar className="w-12 h-12 text-[#B3B3B3] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No pending renewals found in the next 30 days.</p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }) {
  return (
    <div className="panel-system p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#FFC96C]">{icon}</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#F2F2F2]">
            {value}
            {subValue && <span className="text-[#B3B3B3] text-base ml-1">{subValue}</span>}
          </div>
        </div>
      </div>
      <div className="text-[#B3B3B3] text-sm uppercase tracking-tight">{label}</div>
    </div>
  );
}
