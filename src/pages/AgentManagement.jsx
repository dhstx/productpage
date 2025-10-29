import { useState, useEffect } from 'react';
import BackArrow from '../components/BackArrow';
import "../styles/dashboard-theme.css";
import AgentsGrid from '@/features/agents/AgentsGrid';
import AgentBioPanel from '@/features/agents/AgentBioPanel';
import PTHealthBar from '../components/PTHealthBar';
import PageTitle from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';

export default function AgentManagement() {
  const { user } = useAuth();
  const [ptData, setPtData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

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
            <PageTitle className="mb-2 uppercase tracking-tight">AGENT DASHBOARD</PageTitle>
            <p style={{ color: 'var(--muted)' }}>
              Understand and customize your agents to sharpen the efficacy of your tasks
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
            <div className="mb-6 rounded-lg p-4 border" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 rounded w-3/4" style={{ background: 'color-mix(in oklab, var(--border) 40%, transparent)' }}></div>
                <div className="h-4 rounded w-1/2" style={{ background: 'color-mix(in oklab, var(--border) 40%, transparent)' }}></div>
              </div>
            </div>
          )}

          {/* Agents Grid */}
          <div className="rounded-lg border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <AgentsGrid onSelect={(agent) => setSelectedAgent(agent)} />
          </div>

          {/* Bio Panel */}
          <AgentBioPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        </div>
      </div>
    </>
  );
}

