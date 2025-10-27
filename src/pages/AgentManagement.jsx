import { useState, useEffect } from 'react';
import BackArrow from '../components/BackArrow';
import "../styles/dashboard-theme.css";
import { AgentSelectionProvider } from '@/context/AgentSelectionContext';
import DashboardChatbox from '@/components/chat/DashboardChatbox';
import PTHealthBar from '../components/PTHealthBar';
import { useAuth } from '../contexts/AuthContext';

export default function AgentManagement() {
  const { user } = useAuth();
  const [ptData, setPtData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPTUsage();
    }
  }, [user]);

  async function fetchPTUsage() {
    try {
      const response = await fetch('/api/pt/usage', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPtData(data);
      } else {
        console.error('Failed to fetch PT usage');
      }
    } catch (error) {
      console.error('Error fetching PT usage:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackArrow />
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight" style={{ color: 'var(--text)' }}>
              AI AGENTS DASHBOARD
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              Chat with our specialized AI agents to get help with your tasks
            </p>
            {user && (
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                Logged in as: {user.email} ({user.user_metadata?.role || 'user'})
              </p>
            )}
          </div>

          {/* Point Health Bar */}
          {!loading && ptData && (
            <div className="mb-6">
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

          {/* Loading State */}
          {loading && (
            <div className="mb-6 rounded-lg p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 rounded w-3/4" style={{ background: 'var(--bg-elev)' }}></div>
                  <div className="h-4 rounded w-1/2" style={{ background: 'var(--bg-elev)' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="dashboard-card p-6">
            <AgentSelectionProvider>
              <DashboardChatbox />
            </AgentSelectionProvider>
          </div>
        </div>
      </div>
    </>
  );
}

