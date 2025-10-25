import { ExternalLink, Target, CheckCircle, AlertCircle, Calendar, Users } from 'lucide-react';
import BackArrow from '../components/BackArrow';
import { getMockPurchases } from '../lib/stripe';
import { Link } from 'react-router-dom';

export default function Platforms() {
  const purchases = getMockPurchases();

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('Portal link copied to clipboard!');
  };

  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto flex w-full max-w-screen-xl min-w-0 flex-col gap-6 px-4 py-6 md:px-8">
        <BackArrow />
        <div className="space-y-2">
          <h1 className="h2 leading-tight text-balance font-bold uppercase tracking-tight" style={{ color: 'var(--text)' }}>
          PLATFORMS
        </h1>
          <p className="text-sm text-pretty sm:text-base" style={{ color: 'var(--muted)' }}>
          Access and manage your platform instances and system status.
        </p>
        </div>

      {/* Platform List */}
      <section className="space-y-6">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="card-surface flex flex-col gap-6 p-6">
            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[4px]" style={{ background: 'var(--panel-bg)' }}>
                  <Target className="h-6 w-6 text-[#FFC96C]" />
                </div>
                <div className="min-w-0 space-y-2">
                  <h3 className="h3 uppercase tracking-tight text-pretty" style={{ color: 'var(--text)' }}>
                    Management Portal
                  </h3>
                  <p className="text-xs text-pretty sm:text-sm" style={{ color: 'var(--muted)' }}>
                    {purchase.productName} • Purchased {purchase.purchaseDate}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="capitalize" style={{ color: 'var(--muted)' }}>{purchase.status}</span>
                    </div>
                    <span style={{ color: 'var(--muted)' }}>•</span>
                    <span className="break-all" style={{ color: 'var(--muted)' }}>board.yourorganization.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
              <h4 className="text-xs font-semibold uppercase tracking-tight sm:text-sm" style={{ color: 'var(--text)' }}>
                Platform Features
              </h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FeatureStat label="Active Initiatives" value="0" />
                <FeatureStat label="Team Members" value="0" />
                <FeatureStat label="Upcoming Events" value="0" />
                <FeatureStat label="Teams" value="0" />
              </div>
            </div>

            <div className="border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
              <h4 className="text-xs font-semibold uppercase tracking-tight sm:text-sm" style={{ color: 'var(--text)' }}>
                Quick Actions
              </h4>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={purchase.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Portal
                </a>
                <button
                  onClick={() => handleCopyLink(purchase.platformUrl)}
                  className="btn-system"
                >
                  Copy Portal Link
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* System Status */}
      <section>
        <h2 className="h2 leading-tight text-balance mb-4 uppercase tracking-tight" style={{ color: 'var(--text)' }}>
          SYSTEM STATUS
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Active Initiatives"
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
            label="Upcoming Events"
            value="0"
            subValue="/ 0"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Engaged Members"
            value="0"
          />
        </div>
      </section>

      {/* Urgent Actions */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="h2 leading-tight text-balance uppercase tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <AlertCircle className="h-5 w-5 text-[#FFC96C]" />
            URGENT ACTIONS
          </h2>
        </div>
        <div className="card-surface flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <CheckCircle className="h-12 w-12 text-[#FFC96C]" />
          <p className="text-sm text-pretty sm:text-base" style={{ color: 'var(--muted)' }}>No urgent actions! Great work.</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="h2 leading-tight text-balance uppercase tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Calendar className="h-5 w-5 text-[#FFC96C]" />
            UPCOMING EVENTS
          </h2>
        </div>
        <div className="card-surface flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <Calendar className="h-12 w-12 text-[#B3B3B3]" />
          <p className="text-sm text-pretty sm:text-base" style={{ color: 'var(--muted)' }}>No upcoming events found.</p>
        </div>
      </section>
      </div>
    </div>
  );
}

function FeatureStat({ label, value }) {
  return (
    <div className="panel-system min-w-0 space-y-2 p-3 text-pretty">
      <div className="text-[clamp(1.25rem,4vw,1.75rem)] font-bold text-[#F2F2F2]">{value}</div>
      <div className="text-[10px] uppercase tracking-tight text-[#B3B3B3] sm:text-xs">{label}</div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }) {
  return (
    <div className="panel-system flex min-w-0 flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[#FFC96C]">{icon}</div>
        <div className="text-right">
          <div className="text-[clamp(1.5rem,4.5vw,2rem)] font-bold text-[#F2F2F2]">
            {value}
            {subValue && <span className="ml-1 text-sm text-[#B3B3B3] sm:text-base">{subValue}</span>}
          </div>
        </div>
      </div>
      <div className="text-xs uppercase tracking-tight text-[#B3B3B3] sm:text-sm">{label}</div>
    </div>
  );
}

