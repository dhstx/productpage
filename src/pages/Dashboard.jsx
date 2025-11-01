import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "../styles/dashboard-theme.css";
import "@/styles/theme-overrides.css";
import "@/styles/dashboard-light-guard.css";
import "@/styles/light-guards.css";
import "@/styles/dashboard-mobile.css";
import "@/styles/usage.css";
import PTHealthBar from '../components/PTHealthBar';
import UsageMonitoringDashboard from '../components/UsageMonitoringDashboard';
import BackArrow from '../components/BackArrow';
import { Zap, Users, TrendingUp, CreditCard } from 'lucide-react';
import AgentRail from '../components/AgentRail';
import { AgentSelectionProvider } from '@/context/AgentSelectionContext';
import DashboardChatbox from '@/components/chat/DashboardChatbox';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [ptData, setPtData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    try {
      // Fetch Points usage
      const ptResponse = await fetch('/api/pt/usage', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (ptResponse.ok) {
        const ptDataResult = await ptResponse.json();
        setPtData(ptDataResult);
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const [selectedAgent, setSelectedAgent] = useState('Chief of Staff');

  return (
    <>
      <BackArrow />
      <div className="dashboard min-h-screen w-full max-w-screen overflow-x-hidden dashboard-surface">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="h2 mb-1 uppercase tracking-tight text-primary">DASHBOARD</h1>
            <p className="text-sm text-muted-fg">
              Monitor and configure your AI agents
            </p>
          </div>

          {/* Layout: left rail + main content */}
          <AgentSelectionProvider initial={selectedAgent}>
            <div className="dash-grid lg:grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
              {/* Left Agent Rail */}
              <div className="dash-agents">
                <AgentRail selectedName={selectedAgent} onSelect={setSelectedAgent} />
              </div>

              {/* Main column */}
              <div className="dash-chat space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-tight dashboard-muted">Total Agents</span>
                    <Zap className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div className="text-2xl font-extrabold text-primary">
                    {loading ? '…' : stats?.totalAgents || 0}
                  </div>
                </div>
                <div className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-tight dashboard-muted">Conversations</span>
                    <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div className="text-2xl font-extrabold text-primary">
                    {loading ? '…' : stats?.totalConversations || 0}
                  </div>
                </div>
                <div className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-tight dashboard-muted">Team Members</span>
                    <Users className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div className="text-2xl font-extrabold text-primary">
                    {loading ? '…' : stats?.teamMembers || 1}
                  </div>
                </div>
                <div className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-tight dashboard-muted">Current Plan</span>
                    <CreditCard className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div className="text-2xl font-extrabold text-primary">
                    {ptData?.tier || '…'}
                  </div>
                </div>
              </div>

              {/* Point Health Bar */}
              {!loading && ptData && (
                <div className="dashboard-card p-4">
                  <PTHealthBar
                    corePT={{
                      used: ptData.core.used,
                      total: ptData.core.total,
                      percentage: ptData.core.percentage,
                    }}
                    advancedPT={{
                      used: ptData.advanced.used,
                      total: ptData.advanced.total,
                      percentage: ptData.advanced.percentage,
                    }}
                    tier={ptData.tier}
                  />
                </div>
              )}

              {/* Agent Chat Box */}
              <section className="dashboard-card p-0">
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-tight text-primary">
                    AGENT CHAT BOX
                  </h3>
                </div>
                <div className="p-4">
                  <DashboardChatbox />
                </div>
              </section>

              {/* Actions removed per design cleanup */}

              {/* Usage Monitoring & Recent Activity Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {user && (
                  <div className="dashboard-card">
                    <div className="usage-card">
                      <h3 className="usage-title">USAGE MONITORING</h3>
                      <div className="mt-3 usage-card">
                        <UsageMonitoringDashboard userId={user.id} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="dashboard-card p-4">
                  <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text)' }}>Recent Activity</h2>
                  {loading ? (
                    <div className="space-y-3">
                      {[1,2,3].map((i) => (
                        <div key={i} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full" style={{ background: 'var(--card-bg)' }} />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 rounded" style={{ background: 'var(--card-bg)' }} />
                            <div className="h-3 w-1/2 rounded" style={{ background: 'var(--card-bg)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : stats?.recentActivity?.length ? (
                    <div className="space-y-3">
                      {stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
                          <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: 'var(--card-bg)' }}>
                            <Zap className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{activity.title}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>{activity.description}</p>
                            <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>No recent activity</p>
                  )}
                </div>
              </div>
              </div>
            </div>
          </AgentSelectionProvider>
        </div>
      </div>
    </>
  );
}

