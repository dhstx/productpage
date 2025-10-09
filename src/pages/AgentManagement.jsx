import { useState } from 'react';
import { Bot, Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Settings, Play, Pause, RefreshCw, ChevronDown, Users } from 'lucide-react';
import { agents as agentData, getAgentStats } from '../lib/agents';

export default function AgentManagement() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [agentInput, setAgentInput] = useState('');
  
  const [agents, setAgents] = useState(agentData);

  // Agent teams configuration
  const agentTeams = [
    { name: 'All Teams', agents: [] },
    { name: 'Strategic Team', agents: ['Strategic Advisor', 'Financial Analyst'] },
    { name: 'Operations Team', agents: ['Operations Assistant', 'Task Manager'] },
    { name: 'Engagement Team', agents: ['Engagement Analyst', 'Communication Specialist'] },
    { name: 'Analytics Team', agents: ['Data Analyst', 'Performance Monitor'] }
  ];

  const handlePauseAgent = (agent) => {
    setSelectedAgent(agent);
    setConfirmAction('pause');
    setShowConfirmModal(true);
  };

  const handleRestartAgent = (agent) => {
    setSelectedAgent(agent);
    setConfirmAction('restart');
    setShowConfirmModal(true);
  };

  const handleConfigureAgent = (agent) => {
    setSelectedAgent(agent);
    setShowConfigModal(true);
  };

  const confirmAgentAction = () => {
    if (!selectedAgent) {return;}
    
    if (confirmAction === 'pause') {
      setAgents(agents.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, status: 'paused' }
          : agent
      ));
    } else if (confirmAction === 'restart') {
      setAgents(agents.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, status: 'active', lastActive: 'Just now' }
          : agent
      ));
    }
    
    setShowConfirmModal(false);
    setSelectedAgent(null);
    setConfirmAction(null);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-500' : 'text-yellow-500';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? CheckCircle : AlertCircle;
  };

  const handleAgentSubmit = (e) => {
    e.preventDefault();
    if (agentInput.trim()) {
      console.log('Agent input:', agentInput);
      // Handle agent interaction here
      setAgentInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          AGENT MANAGEMENT
        </h1>
        <p className="text-[#B3B3B3]">
          Monitor and configure your AI agents
        </p>
      </div>

      {/* Compact Stats Bar - 4 columns */}
      <div className="grid grid-cols-4 gap-4">
        {/* Stat 1 - Total Agents */}
        <div className="panel-system p-4">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Stats</p>
            <p className="text-2xl font-bold text-[#F2F2F2]">{agents.length}</p>
          </div>
        </div>

        {/* Stat 2 - Active Agents */}
        <div className="panel-system p-4">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Stats</p>
            <p className="text-2xl font-bold text-[#F2F2F2]">
              {agents.filter(a => a.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Stat 3 - Avg Accuracy */}
        <div className="panel-system p-4">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Stats</p>
            <p className="text-2xl font-bold text-[#F2F2F2]">
              {Math.round(agents.reduce((acc, a) => acc + a.accuracy, 0) / agents.length)}%
            </p>
          </div>
        </div>

        {/* Stat 4 - Agent Teams Dropdown */}
        <div className="panel-system p-4">
          <div className="relative">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1 text-center">Stats</p>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] text-sm px-2 py-1 focus:outline-none focus:border-[#FFC96C] appearance-none cursor-pointer"
            >
              {agentTeams.map((team, index) => (
                <option key={index} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-8 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Left Panel + Agent Text Box */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Agent List */}
        <div className="col-span-3 space-y-4">
          <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">Agent</h3>
          
          {agents.map((agent) => {
            const StatusIcon = getStatusIcon(agent.status);
            
            return (
              <div
                key={agent.id}
                className="panel-system p-4 cursor-pointer hover:bg-[#202020] transition-colors"
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#202020] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-[#FFC96C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#F2F2F2] truncate">{agent.name}</h4>
                    </div>
                    <p className="text-[#B3B3B3] text-xs mb-2 line-clamp-2">{agent.description}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {agent.status}
                      </span>
                      <span className="text-[#B3B3B3]">• v{agent.version}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content - Agent Text Box */}
        <div className="col-span-9">
          <div className="panel-system p-6 h-full min-h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-center">
              Agent Text Box
            </h3>
            
            {/* Selected Agent Info */}
            {selectedAgent ? (
              <div className="mb-6 panel-system p-4 bg-[#0C0C0C]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#202020] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-[#FFC96C]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#F2F2F2] mb-1">{selectedAgent.name}</h4>
                      <p className="text-[#B3B3B3] text-sm mb-3">{selectedAgent.description}</p>
                      
                      {/* Agent Metrics */}
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <p className="text-[#B3B3B3] text-xs">Tasks</p>
                          <p className="text-lg font-bold text-[#F2F2F2]">{agent.tasks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[#B3B3B3] text-xs">Accuracy</p>
                          <p className="text-lg font-bold text-[#F2F2F2]">{selectedAgent.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-[#B3B3B3] text-xs">Response</p>
                          <p className="text-lg font-bold text-[#F2F2F2]">{selectedAgent.responseTime}s</p>
                        </div>
                        <div>
                          <p className="text-[#B3B3B3] text-xs">Uptime</p>
                          <p className="text-lg font-bold text-[#F2F2F2]">{selectedAgent.uptime}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectedAgent.status === 'active' ? handlePauseAgent(selectedAgent) : handleRestartAgent(selectedAgent)}
                      className="btn-system-secondary p-2"
                      title={selectedAgent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                    >
                      {selectedAgent.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleRestartAgent(selectedAgent)}
                      className="btn-system-secondary p-2" 
                      title="Restart Agent"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleConfigureAgent(selectedAgent)}
                      className="btn-system-secondary p-2" 
                      title="Configure Agent"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 panel-system p-8 bg-[#0C0C0C] text-center">
                <Bot className="w-12 h-12 text-[#FFC96C] mx-auto mb-3" />
                <p className="text-[#B3B3B3]">Select an agent from the left panel to interact</p>
              </div>
            )}

            {/* Conversation Area */}
            <div className="flex-1 bg-[#0C0C0C] rounded-[2px] p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                {selectedAgent ? (
                  <>
                    <div className="text-[#B3B3B3] text-sm">
                      <p className="mb-2">
                        <span className="text-[#FFC96C] font-semibold">{selectedAgent.name}:</span> Hello! I'm ready to assist you with {selectedAgent.capabilities[0].toLowerCase()}.
                      </p>
                      <p className="text-xs text-[#808080]">
                        Type your message below to interact with this agent.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-[#808080] text-sm text-center py-8">
                    No agent selected. Choose an agent from the left panel to start.
                  </p>
                )}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleAgentSubmit} className="flex gap-3">
              <textarea
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : "Select an agent to start messaging..."}
                disabled={!selectedAgent}
                className="flex-1 px-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] placeholder-[#808080] focus:outline-none focus:border-[#FFC96C] transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
              />
              <button
                type="submit"
                disabled={!selectedAgent || !agentInput.trim()}
                className="btn-system px-6 self-end disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="panel-system p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              Confirm Action
            </h3>
            <p className="text-[#B3B3B3] mb-6">
              Are you sure you want to {confirmAction} <span className="text-[#FFC96C]">{selectedAgent.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmAgentAction}
                className="flex-1 btn-system"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedAgent(null);
                  setConfirmAction(null);
                }}
                className="flex-1 btn-system-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="panel-system p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              Configure {selectedAgent.name}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Agent Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedAgent.name}
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Description
                </label>
                <textarea
                  defaultValue={selectedAgent.description}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Response Time Threshold (seconds)
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  step="0.1"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Capabilities
                </label>
                <div className="space-y-2">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-[#202020] bg-[#0C0C0C] text-[#FFC96C] focus:ring-[#FFC96C]"
                      />
                      <span className="text-[#B3B3B3]">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    alert('Configuration saved!');
                    setShowConfigModal(false);
                    setSelectedAgent(null);
                  }}
                  className="flex-1 btn-system"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedAgent(null);
                  }}
                  className="flex-1 btn-system-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

