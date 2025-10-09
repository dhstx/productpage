import { ExternalLink, Target, Settings, CheckCircle } from 'lucide-react';
import { getMockPurchases } from '../lib/stripe';
import { useNavigate } from 'react-router-dom';

export default function Platforms() {
  const purchases = getMockPurchases();
  const navigate = useNavigate();

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('Portal link copied to clipboard!');
  };

  const handleViewAnalytics = () => {
    alert('Analytics Dashboard\n\nThis would show:\n• User engagement metrics\n• Platform usage statistics\n• Member activity reports\n• Event participation data\n\nComing soon!');
  };



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          MY PLATFORMS
        </h1>
        <p className="text-[#B3B3B3]">
          Access and manage your purchased platform instances.
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
                <a 
                  href={purchase.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-system flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </a>
                <button 
                  onClick={() => handleCopyLink(purchase.platformUrl)}
                  className="btn-system"
                >
                  Copy Portal Link
                </button>
                <button 
                  onClick={handleViewAnalytics}
                  className="btn-system"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
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
