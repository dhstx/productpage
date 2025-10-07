import { ExternalLink, Target, Settings, CheckCircle, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMockPurchases } from '../lib/stripe';

export default function Platforms() {
  const purchases = getMockPurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          MY PLATFORMS
        </h1>
        <p className="text-[#B3B3B3]">
          Access and manage every purchased digital asset environment from a single control plane.
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
                    Digital Asset Hub
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
                    <span className="text-[#B3B3B3] text-sm">assets.yourorganization.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#202020] pt-6 mb-6">
              <h4 className="text-[#F2F2F2] font-bold mb-4 uppercase tracking-tight text-sm">
                Platform Signals
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <FeatureStat label="Optimization Plans" value="0" />
                <FeatureStat label="Stakeholders" value="0" />
                <FeatureStat label="Renewals Due" value="0" />
                <FeatureStat label="Compliance Tasks" value="0" />
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
                  Open Hub
                </a>
                <a
                  href={purchase.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </a>
                <button className="btn-system">
                  Copy Portal Link
                </button>
                <Link to="/dashboard#analytics" className="btn-system flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Add Platform CTA */}
      <section>
        <div className="panel-system p-8 text-center">
          <h3 className="text-[#F2F2F2] font-bold text-xl uppercase tracking-tight mb-3">
            NEED ANOTHER ENVIRONMENT?
          </h3>
          <p className="text-[#B3B3B3] mb-6">
            Purchase additional environments for new business units, compliance regions, or sandbox testing.
          </p>
          <button className="btn-system">
            View Pricing Plans
          </button>
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
