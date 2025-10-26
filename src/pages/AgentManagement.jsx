import { useState, useEffect } from 'react';
import BackArrow from '../components/BackArrow';
import AIChatInterface from '../components/AIChatInterface';
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
      <div className="min-h-screen bg-[#0A0A0A] text-[#F2F2F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
              AI AGENTS DASHBOARD
            </h1>
            <p className="text-[#B3B3B3]">
              Chat with our specialized AI agents to get help with your tasks
            </p>
            {user && (
              <p className="text-sm text-[#808080] mt-2">
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
            <div className="mb-6 bg-[#0F0F0F] rounded-lg border border-[#1A1A1A] p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-[#1A1A1A] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1A1A1A] rounded w-1/2"></div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="card-surface p-6">
            <AIChatInterface onPTUpdate={fetchPTUsage} />
          </div>
        </div>
      </div>
    </>
  );
}

