import { Link } from 'react-router-dom';
import { ExternalLink, Target, AlertCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { getMockPurchases } from '../lib/stripe';

export default function Dashboard() {
  const purchases = getMockPurchases();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          ACCOUNT DASHBOARD
        </h1>
        <p className="text-[#B3B3B3]">
          Welcome back! Manage your organization and access your board portal.
        </p>
      </div>

      {/* Board Portal Access */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          YOUR BOARD PORTAL
        </h2>
        {purchases.map((purchase) => (
          <div key={purchase.id} className="panel-system p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#FFC96C]" />
                  <h3 className="text-[#F2F2F2] font-bold uppercase tracking-tight">
                    {purchase.productName}
                  </h3>
                </div>
                <p className="text-[#B3B3B3] text-sm mb-1">
                  board.yourorganization.com
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[#B3B3B3] text-sm">Active & Configured</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>0 Active Items</span>
              </div>
            </div>

            <p className="text-[#B3B3B3] mb-6">
              Access your organization's dedicated board management portal where members can view initiatives, manage tasks, coordinate events, and collaborate on strategic planning.
            </p>

            <div className="flex gap-3">
              <a 
                href={purchase.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-system flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Board Portal
              </a>
              <a 
                href={purchase.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-system flex items-center gap-2"
              >
                Copy Portal Link
              </a>
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
          <Link to="/platforms" className="text-[#FFC96C] text-sm hover:underline">
            View All
          </Link>
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
          <Link to="/platforms" className="text-[#FFC96C] text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="panel-system p-8 text-center">
          <Calendar className="w-12 h-12 text-[#B3B3B3] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No upcoming events found.</p>
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
