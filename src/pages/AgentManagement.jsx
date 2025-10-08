import { useState } from 'react';
import { Bot, Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Settings, Play, Pause, RefreshCw } from 'lucide-react';

export default function AgentManagement() {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'Strategic Advisor',
      type: 'strategic',
      status: 'active',
      icon: Brain,
      description: 'Analyzes board initiatives and provides strategic recommendations',
      metrics: {
        tasksProcessed: 1247,
        accuracy: 94,
        avgResponseTime: '1.2s',
        uptime: 99.8
      },
      capabilities: [
        'Initiative prioritization',
        'Risk assessment',
        'Resource allocation',
        'Timeline optimization'
      ],
      lastActive: '2 minutes ago',
      version: 'v2.4.1'
    },
    {
      id: 2,
      name: 'Engagement Analyst',
      type: 'analytics',
      status: 'active',
      icon: TrendingUp,
      description: 'Tracks member participation and predicts engagement trends',
      metrics: {
        tasksProcessed: 892,
        accuracy: 91,
        avgResponseTime: '0.8s',
        uptime: 99.9
      },
      capabilities: [
        'Participation tracking',
        'Engagement predictions',
        'Communication optimization',
        'Retention insights'
      ],
      lastActive: '5 minutes ago',
      version: 'v2.3.8'
    },
    {
      id: 3,
      name: 'Operations Assistant',
      type: 'automation',
      status: 'active',
      icon: Zap,
      description: 'Automates routine tasks and optimizes operational workflows',
      metrics: {
        tasksProcessed: 3421,
        accuracy: 97,
        avgResponseTime: '0.3s',
        uptime: 99.7
      },
      capabilities: [
        'Task automation',
        'Workflow optimization',
        'Document generation',
        'Meeting summaries'
      ],
      lastActive: '1 minute ago',
      version: 'v2.5.0'
    }
  ]);

  const toggleAgentStatus = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'paused' : 'active' }
        : agent
    ));
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-500' : 'text-yellow-500';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? CheckCircle : AlertCircle;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          AGENT MANAGEMENT
        </h1>
        <p className="text-[#B3B3B3]">
          Monitor and configure your AI agents
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="panel-system p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B3B3B3] text-sm uppercase tracking-wide">Total Agents</span>
            <Bot className="w-5 h-5 text-[#FFC96C]" />
          </div>
          <p className="text-3xl font-bold text-[#F2F2F2]">{agents.length}</p>
        </div>

        <div className="panel-system p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B3B3B3] text-sm uppercase tracking-wide">Active</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-[#F2F2F2]">
            {agents.filter(a => a.status === 'active').length}
          </p>
        </div>

        <div className="panel-system p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B3B3B3] text-sm uppercase tracking-wide">Avg Accuracy</span>
            <TrendingUp className="w-5 h-5 text-[#FFC96C]" />
          </div>
          <p className="text-3xl font-bold text-[#F2F2F2]">
            {Math.round(agents.reduce((acc, a) => acc + a.metrics.accuracy, 0) / agents.length)}%
          </p>
        </div>

        <div className="panel-system p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B3B3B3] text-sm uppercase tracking-wide">Tasks Today</span>
            <Zap className="w-5 h-5 text-[#FFC96C]" />
          </div>
          <p className="text-3xl font-bold text-[#F2F2F2]">
            {agents.reduce((acc, a) => acc + a.metrics.tasksProcessed, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="space-y-6">
        {agents.map((agent) => {
          const StatusIcon = getStatusIcon(agent.status);
          const AgentIcon = agent.icon;

          return (
            <div key={agent.id} className="panel-system p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#202020] flex items-center justify-center">
                    <AgentIcon className="w-8 h-8 text-[#FFC96C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#F2F2F2]">{agent.name}</h3>
                      <span className={`flex items-center gap-1 text-sm ${getStatusColor(agent.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-[#B3B3B3] mb-2">{agent.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#B3B3B3]">
                      <span>Version {agent.version}</span>
                      <span>•</span>
                      <span>Last active: {agent.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    className="btn-system-secondary p-2"
                    title={agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                  >
                    {agent.status === 'active' ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button className="btn-system-secondary p-2" title="Restart Agent">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className="btn-system-secondary p-2" title="Configure Agent">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0C0C0C] rounded-lg p-4">
                  <p className="text-[#B3B3B3] text-sm mb-1">Tasks Processed</p>
                  <p className="text-2xl font-bold text-[#F2F2F2]">
                    {agent.metrics.tasksProcessed.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#0C0C0C] rounded-lg p-4">
                  <p className="text-[#B3B3B3] text-sm mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-[#F2F2F2]">
                    {agent.metrics.accuracy}%
                  </p>
                </div>
                <div className="bg-[#0C0C0C] rounded-lg p-4">
                  <p className="text-[#B3B3B3] text-sm mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-[#F2F2F2]">
                    {agent.metrics.avgResponseTime}
                  </p>
                </div>
                <div className="bg-[#0C0C0C] rounded-lg p-4">
                  <p className="text-[#B3B3B3] text-sm mb-1">Uptime</p>
                  <p className="text-2xl font-bold text-[#F2F2F2]">
                    {agent.metrics.uptime}%
                  </p>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-[#B3B3B3] text-sm mb-3 uppercase tracking-wide">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#0C0C0C] text-[#F2F2F2] text-sm rounded-full border border-[#202020]"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Activity Log */}
      <div className="panel-system p-6">
        <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          RECENT ACTIVITY
        </h3>
        <div className="space-y-3">
          {[
            { agent: 'Operations Assistant', action: 'Generated meeting summary', time: '2 min ago' },
            { agent: 'Strategic Advisor', action: 'Completed initiative analysis', time: '5 min ago' },
            { agent: 'Engagement Analyst', action: 'Updated participation metrics', time: '8 min ago' },
            { agent: 'Operations Assistant', action: 'Automated task assignment', time: '12 min ago' },
            { agent: 'Strategic Advisor', action: 'Risk assessment completed', time: '15 min ago' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#202020] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFC96C]"></div>
                <div>
                  <p className="text-[#F2F2F2]">{log.action}</p>
                  <p className="text-[#B3B3B3] text-sm">{log.agent}</p>
                </div>
              </div>
              <span className="text-[#B3B3B3] text-sm">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
