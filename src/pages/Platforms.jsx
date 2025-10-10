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
    <div className="space-y-8">
      <BackArrow />
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          PLATFORMS
        </h1>
        <p className="text-[#B3B3B3]">
          Access and manage your platform instances and system status.
        </p>
      </div>

      {/* Platform List */}
      <section className="space-y-6">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="panel-system p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[4px] bg-[#202020] flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <div>
                  <h3 className="text-[#F2F2F2] font-bold text-xl uppercase tracking-tight mb-2">
                    Management Portal
                  </h3>
                  <p className="text-[#B3B3B3] text-sm mb-3">
                    {purchase.productName} • Purchased {purchase.purchaseDate}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[#B3B3B3] text-sm capitalize">{purchase.status}</span>
                    </div>
                    <span className="text-[#B3B3B3] text-sm">•</span>
                    <span className="text-[#B3B3B3] text-sm">board.yourorganization.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#202020] pt-6 mb-6">
              <h4 className="text-[#F2F2F2] font-bold mb-4 uppercase tracking-tight text-sm">
                Platform Features
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <FeatureStat label="Active Initiatives" value="0" />
                <FeatureStat label="Team Members" value="0" />
                <FeatureStat label="Upcoming Events" value="0" />
                <FeatureStat label="Committees" value="0" />
              </div>
            </div>

            <div className="border-t border-[#202020] pt-6">
              <h4 className="text-[#F2F2F2] font-bold mb-4 uppercase tracking-tight text-sm">
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={purchase.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system flex items-center gap-2"
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
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          SYSTEM STATUS
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FFC96C]" />
            URGENT ACTIONS
          </h2>
        </div>
        <div className="panel-system p-8 text-center">
          <CheckCircle className="w-12 h-12 text-[#FFC96C] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No urgent actions! Great work.</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFC96C]" />
            UPCOMING EVENTS
          </h2>
        </div>
        <div className="panel-system p-8 text-center">
          <Calendar className="w-12 h-12 text-[#B3B3B3] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No upcoming events found.</p>
        </div>
      </section>
    </div>
  );
}

function FeatureStat({ label, value }) {
  return (
    <div className="panel-system p-3">
      <div className="text-2xl font-bold text-[#F2F2F2] mb-1">{value}</div>
      <div className="text-[#B3B3B3] text-xs uppercase tracking-tight">{label}</div>
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

