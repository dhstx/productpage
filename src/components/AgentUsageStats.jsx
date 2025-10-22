import { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Clock, Zap } from 'lucide-react';
import { agents as agentData } from '../lib/agents-enhanced';

export default function AgentUsageStats({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUsageStats();
    }
  }, [userId]);

  async function fetchUsageStats() {
    try {
      const response = await fetch(`/api/agents/usage-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching agent usage stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getAgentIcon = (agentName) => {
    const agent = agentData.find(a => a.name === agentName);
    return agent?.icon || '🤖';
  };

  const getAgentColor = (agentName) => {
    const agent = agentData.find(a => a.name === agentName);
    return agent?.color || '#6B7280';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Agent Usage Statistics
        </h3>
        <p className="text-sm text-gray-600 mt-1">Your most-used AI agents this month</p>
      </div>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalMessages || 0}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Total Messages
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.uniqueAgents || 0}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Zap className="h-4 w-4" />
              Agents Used
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.avgResponseTime || '0'}s</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              Avg Response
            </div>
          </div>
        </div>

        {/* Most Used Agents */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Most Used Agents</h4>
          <div className="space-y-3">
            {stats.topAgents?.slice(0, 5).map((agent, index) => {
              const percentage = (agent.count / stats.totalMessages) * 100;
              const agentColor = getAgentColor(agent.name);

              return (
                <div key={agent.name} className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-sm text-gray-500 w-4">
                    #{index + 1}
                  </div>
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${agentColor}20` }}
                  >
                    <span className="text-lg">{getAgentIcon(agent.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {agent.name}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {agent.count} uses
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: agentColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{getAgentIcon(activity.agent)}</span>
                  <span className="font-medium text-gray-900">{activity.agent}</span>
                  <span>•</span>
                  <span>{activity.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

