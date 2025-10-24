import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PTHealthBar from '../components/PTHealthBar';
import UsageMonitoringDashboard from '../components/UsageMonitoringDashboard';
import BackArrow from '../components/BackArrow';
import { Zap, Users, TrendingUp, Settings, CreditCard } from 'lucide-react';

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

  return (
    <>
      <BackArrow />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your account and usage
            </p>
          </div>

          {/* Points Health Bar */}
          {!loading && ptData && (
            <div className="mb-8">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stats?.totalAgents || 0}
              </h3>
              <p className="text-sm text-gray-600">Active Agents</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stats?.totalConversations || 0}
              </h3>
              <p className="text-sm text-gray-600">Conversations</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stats?.teamMembers || 1}
              </h3>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {ptData?.tier || '...'}
              </h3>
              <p className="text-sm text-gray-600">Current Plan</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/agents"
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <Zap className="h-8 w-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Start Chatting</h3>
              <p className="text-blue-100">
                Chat with AI agents to get work done
              </p>
            </Link>

            <Link
              to="/billing"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <CreditCard className="h-8 w-8 mb-3 text-gray-700" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Manage Billing</h3>
              <p className="text-gray-600">
                View usage, upgrade plan, or add Points
              </p>
            </Link>

            <Link
              to="/settings"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <Settings className="h-8 w-8 mb-3 text-gray-700" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Settings</h3>
              <p className="text-gray-600">
                Customize your account and preferences
              </p>
            </Link>
          </div>

          {/* Usage Monitoring */}
          {user && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Monitoring</h2>
              <UsageMonitoringDashboard userId={user.id} />
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

