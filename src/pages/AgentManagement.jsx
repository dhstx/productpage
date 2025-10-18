import { useState, useEffect, useRef } from 'react';
import UpfadeOnMount from '../components/UpfadeOnMount';
import { Link } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import { Bot, Zap, AlertCircle, CheckCircle, ChevronDown, Cog, ArrowUp } from 'lucide-react';
import { agents as agentData, getAgentStats } from '../lib/agents';
import { getCurrentUser, hasFeature } from '../lib/auth';
import ChatTools from '../components/chat/ChatTools';

export default function AgentManagement() {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [activeMode, setActiveMode] = useState('chat');
  const [configAgent, setConfigAgent] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCustomTeamModal, setShowCustomTeamModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [agentInput, setAgentInput] = useState('');
  const [customTeamName, setCustomTeamName] = useState('');
  const [customTeams, setCustomTeams] = useState([]);
  const lastValidTeamRef = useRef('All Teams');
  const configTriggerRef = useRef(null);
  const configModalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  const [agents, setAgents] = useState(agentData);
  const user = getCurrentUser();
  const hasPortalAccess = hasFeature('portal');

  // Watch for Custom... selection
  useEffect(() => {
    if (selectedTeam === 'Custom...') {
      setShowCustomTeamModal(true);
      setTimeout(() => {
        setSelectedTeam(lastValidTeamRef.current);
      }, 0);
    } else if (selectedTeam !== 'Custom...') {
      lastValidTeamRef.current = selectedTeam;
    }
  }, [selectedTeam]);

  // Agent teams configuration
  const defaultTeams = [
    { name: 'All Teams', agents: [] },
    { name: 'Strategic Team', agents: ['Strategic Advisor', 'Financial Analyst'] },
    { name: 'Operations Team', agents: ['Operations Assistant', 'Task Manager'] },
    { name: 'Engagement Team', agents: ['Engagement Analyst', 'Communication Specialist'] },
    { name: 'Analytics Team', agents: ['Data Analyst', 'Performance Monitor'] }
  ];

  const agentTeams = [...defaultTeams, ...customTeams, { name: 'Custom...', agents: [] }];

  const handleTeamChange = (teamName) => {
    setSelectedTeam(teamName);
  };

  const handleCreateCustomTeam = () => {
    if (customTeamName.trim()) {
      setCustomTeams([...customTeams, { name: customTeamName, agents: [] }]);
      setSelectedTeam(customTeamName);
      setCustomTeamName('');
      setShowCustomTeamModal(false);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id);
      if (isSelected) {
        return prev.filter(a => a.id !== agent.id);
      } else {
        // Check if user is non-admin and already has 1 agent selected
        if (user?.role !== 'admin' && prev.length >= 1) {
          alert('⚠️ User Plan Limit\n\nYour current plan allows only 1 active agent at a time.\n\nPlease deselect the current agent or upgrade your plan to use multiple agents.');
          return prev;
        }
        return [...prev, agent];
      }
    });
  };

  const handleRemoveAgent = (agentId) => {
    setSelectedAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const handlePauseAgent = (agent) => {
    setConfigAgent(agent);
    setConfirmAction('pause');
    setShowConfirmModal(true);
  };

  const handleRestartAgent = (agent) => {
    setConfigAgent(agent);
    setConfirmAction('restart');
    setShowConfirmModal(true);
  };

  const handleConfigureAgent = (agent, e) => {
    e.stopPropagation();
    configTriggerRef.current = e.currentTarget;
    setConfigAgent(agent);
    setShowConfigModal(true);
  };

  const closeConfigModal = () => {
    setShowConfigModal(false);
    setConfigAgent(null);
    // restore focus to the cog button that opened the modal
    const toFocus = configTriggerRef.current || previousFocusRef.current;
    if (toFocus && typeof toFocus.focus === 'function') {
      setTimeout(() => toFocus.focus(), 0);
    }
  };

  // Focus trap and Escape handling for the configuration modal
  useEffect(() => {
    if (!showConfigModal) return;

    previousFocusRef.current = document.activeElement;

    const modalEl = configModalRef.current;
    if (!modalEl) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const focusFirstElement = () => {
      const focusables = modalEl.querySelectorAll(focusableSelectors);
      if (focusables.length > 0) {
        /** @type {HTMLElement} */
        const first = focusables[0];
        first.focus();
      } else {
        modalEl.focus();
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeConfigModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(modalEl.querySelectorAll(focusableSelectors)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement
        );
        if (focusables.length === 0) {
          e.preventDefault();
          modalEl.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    // Focus the first focusable element when opened
    setTimeout(focusFirstElement, 0);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showConfigModal]);

  const confirmAgentAction = () => {
    if (!configAgent) return;
    
    if (confirmAction === 'pause') {
      setAgents(agents.map(agent => 
        agent.id === configAgent.id 
          ? { ...agent, status: 'paused' }
          : agent
      ));
    } else if (confirmAction === 'restart') {
      setAgents(agents.map(agent => 
        agent.id === configAgent.id 
          ? { ...agent, status: 'active', lastActive: 'Just now' }
          : agent
      ));
    }
    
    setShowConfirmModal(false);
    setConfigAgent(null);
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
      setAgentInput('');
    }
  };

  const getSuggestedPrompts = (agent) => {
    // Return agent-specific prompts based on agent name/type
    const promptMap = {
      'Master Coordinator': [
        'Coordinate all agents to analyze our quarterly performance',
        'Route my request to the most appropriate specialist agent',
        'Show me the status of all active agent tasks'
      ],
      'Content Creation Orchestrator': [
        'Create a comprehensive content strategy for Q4',
        'Generate a blog post about AI automation trends',
        'Optimize this content for SEO and engagement'
      ],
      'AI Video Generation Specialist': [
        'Generate a 30-second promotional video using Veo3',
        'Create viral video content for social media',
        'Optimize this video for Instagram Reels format'
      ],
      'Marketing Automation Hub': [
        'Set up an automated email campaign for new leads',
        'Analyze the performance of our recent marketing campaigns',
        'Create a multi-channel marketing strategy'
      ],
      'Strategic Advisor': [
        'Analyze our competitive positioning in the market',
        'Provide strategic recommendations for growth',
        'Evaluate potential partnership opportunities'
      ],
      'Financial Analyst': [
        'Analyze quarterly revenue trends and projections',
        'Generate a financial performance report',
        'Identify cost optimization opportunities'
      ],
      'Operations Assistant': [
        'Optimize our workflow processes',
        'Generate operational efficiency reports',
        'Identify bottlenecks in current operations'
      ],
      'Task Manager': [
        'Prioritize my tasks for this week',
        'Create a project timeline with milestones',
        'Track progress on all active initiatives'
      ],
      'Engagement Analyst': [
        'Analyze member engagement patterns',
        'Identify strategies to improve participation',
        'Generate an engagement metrics report'
      ],
      'Communication Specialist': [
        'Draft a professional announcement email',
        'Create communication templates for the team',
        'Improve the clarity of this message'
      ],
      'Data Analyst': [
        'Analyze this dataset and provide insights',
        'Create visualizations for our key metrics',
        'Identify trends in our performance data'
      ],
      'Performance Monitor': [
        'Monitor system performance and uptime',
        'Generate a performance optimization report',
        'Alert me to any performance anomalies'
      ]
    };

    return promptMap[agent.name] || [
      `Help me with ${agent.capabilities[0]?.toLowerCase() || 'my task'}`,
      `Provide insights on ${agent.capabilities[1]?.toLowerCase() || 'this topic'}`,
      `Analyze and optimize ${agent.capabilities[2]?.toLowerCase() || 'this process'}`
    ];
  };

  return (
    <>
      <BackArrow />
      <UpfadeOnMount>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          DASHBOARD
        </h1>
        <p className="text-[#B3B3B3]">
          Monitor and configure your AI agents
        </p>
      </div>

      {/* Upgrade Notice for Free Users */}


      {/* User Limits Notice - Only show for non-admin users */}
      {user?.role !== 'admin' && (
        <div className="panel-system p-4 border border-[#FFC96C]/30 bg-[#FFC96C]/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#FFC96C] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[#F2F2F2] font-bold text-sm mb-1">User Plan Limits</h3>
                <p className="text-[#B3B3B3] text-sm">
                  Your current plan allows: <span className="text-[#FFC96C] font-semibold">1 Agent</span>, <span className="text-[#FFC96C] font-semibold">10 Workflows</span>, <span className="text-[#FFC96C] font-semibold">1 Team License</span>, and <span className="text-[#FFC96C] font-semibold">20 Connections</span>.
                </p>
              </div>
            </div>
            <Link 
              to="/settings"
              className="btn-system text-sm"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      )}

      {/* Compact Stats Bar - 4 columns with named stats and reduced height */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="panel-system p-3">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Total Agents</p>
            <p className="text-xl font-bold text-[#F2F2F2]">{agents.length}</p>
          </div>
        </div>

        <div className="panel-system p-3">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Active Agents</p>
            <p className="text-xl font-bold text-[#F2F2F2]">
              {agents.filter(a => a.status === 'active').length}
            </p>
          </div>
        </div>

        <div className="panel-system p-3">
          <div className="text-center">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-wide mb-1">Avg Accuracy</p>
            <p className="text-xl font-bold text-[#F2F2F2]">
              {Math.round(agents.reduce((acc, a) => acc + a.accuracy, 0) / agents.length)}%
            </p>
          </div>
        </div>

        <div className="panel-system p-3">
          <div className="relative flex items-center justify-center">
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] text-sm px-3 py-2 focus:outline-none focus:border-[#FFC96C] appearance-none cursor-pointer"
            >
              {agentTeams.map((team, index) => (
                <option key={index} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-4 h-4 text-[#B3B3B3] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Text Box first on mobile, agents below */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Agent List (shown below on mobile as a tile grid) */}
        <div className="md:col-span-3 col-span-12 md:order-1 order-2 md:block grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-0 md:space-y-4">
          <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight md:text-left text-center col-span-full">Agent</h3>

          {agents.map((agent) => {
            const StatusIcon = getStatusIcon(agent.status);
            const isSelected = selectedAgents.some(a => a.id === agent.id);
            
            return (
              <div
                key={agent.id}
                className={`panel-system p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#FFC96C]/10 border-[#FFC96C] ring-2 ring-[#FFC96C]/50' 
                    : 'hover:bg-[#202020] border-transparent'
                }`}
                onClick={() => handleAgentSelect(agent)}
              >
                <div className="flex items-start gap-3">
                  {/* Left column: icon with settings stacked below on mobile */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-[#202020] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#FFC96C]" />
                    </div>
                    <button
                      onClick={(e) => handleConfigureAgent(agent, e)}
                      className="text-[#B3B3B3] hover:text-[#FFC96C] transition-colors p-1 rounded md:hidden"
                      title="Configure Agent"
                    >
                      <Cog className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Agent name - allow wrapping on mobile for readability */}
                    <div className="mb-1 flex items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#F2F2F2] leading-snug break-words line-clamp-2 md:line-clamp-none">
                        {agent.name}
                      </h4>
                      {/* Desktop settings button to the right */}
                      <button
                        onClick={(e) => handleConfigureAgent(agent, e)}
                        className="ml-auto hidden md:block text-[#B3B3B3] hover:text-[#FFC96C] transition-colors p-1"
                        title="Configure Agent"
                      >
                        <Cog className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs mb-1">
                      <span className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {agent.status}
                      </span>
                      <span className="text-[#B3B3B3]">• v{agent.version}</span>
                    </div>
                    <p className="text-[#B3B3B3] text-xs mt-1 hidden sm:block md:mt-2 md:block md:line-clamp-none line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content - Agent Chat Box */}
        <div className="md:col-span-9 col-span-12 md:order-2 order-1">
          <div className="panel-system p-6 flex flex-col mx-auto w-full max-w-2xl md:max-w-none md:mx-0 md:h-[calc(100vh-280px)]">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-center">
              Agent Chat Box
            </h3>
            
            {/* Selected Agents - Display as chips with X button */}
            {selectedAgents.length > 0 ? (
              <div className="mb-4 panel-system p-4 bg-[#0C0C0C]">
                <div className="flex flex-wrap gap-2">
                  {selectedAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-2 bg-[#202020] border border-[#FFC96C]/30 rounded-lg px-3 py-2 group hover:border-[#FFC96C] transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-[#0C0C0C] flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#FFC96C]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#F2F2F2] truncate">{agent.name}</span>
                        <span className="text-xs text-[#B3B3B3]">v{agent.version}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAgent(agent.id)}
                        className="ml-2 text-[#B3B3B3] hover:text-[#F2F2F2] transition-colors flex-shrink-0"
                        title="Remove agent"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-[#B3B3B3]">
                  {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            ) : (
              <div className="mb-4 panel-system p-6 bg-[#0C0C0C] text-center">
                <Bot className="w-12 h-12 text-[#FFC96C] mx-auto mb-3" />
                <p className="text-[#B3B3B3]">Select agents from the left panel to interact</p>
              </div>
            )}

            {/* Conversation Area */}
            <div className="flex-1 bg-[#0C0C0C] rounded-[2px] p-4 mb-4 overflow-y-auto min-h-[120px]">
              <div className="space-y-4">
                {selectedAgents.length > 0 ? (
                  <>
                    <div className="text-[#B3B3B3] text-sm space-y-3">
                      {selectedAgents.map((agent, index) => (
                        <p key={agent.id} className="mb-2">
                          <span className="text-[#FFC96C] font-semibold">{agent.name}:</span> Hello! I'm ready to assist you with {agent.capabilities[0].toLowerCase()}.
                        </p>
                      ))}
                      <p className="text-xs text-[#808080] mt-4">
                        Type your message below to interact with {selectedAgents.length === 1 ? 'this agent' : `all ${selectedAgents.length} agents`}.
                      </p>
      </div>
      </UpfadeOnMount>
                  </>
                ) : (
                  <p className="text-[#808080] text-sm text-center py-4">
                    No agents selected. Choose agents from the left panel to start.
                  </p>
                )}
              </div>
            </div>

            {/* Input Area with shared ChatTools */}
            <form onSubmit={handleAgentSubmit} className="flex flex-col gap-3 md:flex-row">
              <div className="w-full">
                <div className="panel-system flex flex-col gap-4 p-4 sm:p-6">
                  <ChatTools
                    onAttach={() => alert('File attachment coming soon')}
                    onToggleMode={(mode) => setActiveMode(mode)}
                    activeMode={activeMode}
                    onMicStart={() => alert('Voice input coming soon')}
                    disabled={selectedAgents.length === 0}
                    features={{ mic: true, upload: true, modes: ['chat', 'agi'] }}
                    rightAppend={(
                      <button
                        type="submit"
                        disabled={selectedAgents.length === 0 || !agentInput.trim()}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          selectedAgents.length > 0 && agentInput.trim()
                            ? 'bg-[#FFC96C] hover:bg-[#FFD700]'
                            : 'bg-[#202020] cursor-not-allowed'
                        }`}
                        aria-label="Send"
                      >
                        <ArrowUp className={`w-5 h-5 ${selectedAgents.length > 0 && agentInput.trim() ? 'text-[#0C0C0C]' : 'text-[#666666]'}`} />
                      </button>
                    )}
                  >
                    <textarea
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      placeholder={
                        selectedAgents.length === 0 
                          ? "Select agents to start messaging..." 
                          : selectedAgents.length === 1 
                            ? `Message ${selectedAgents[0].name}...` 
                            : `Message ${selectedAgents.length} agents...`
                      }
                      disabled={selectedAgents.length === 0}
                      className="max-h-[40vh] min-h-[24px] w-full resize-none bg-transparent text-sm text-[#F2F2F2] placeholder-[#666666] outline-none sm:text-base"
                      rows={1}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                      }}
                    />
                  </ChatTools>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Team Modal */}
      {showCustomTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="panel-system p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              Create Custom Team
            </h3>
            <p className="text-[#B3B3B3] mb-4 text-sm">
              Enter a name for your custom agent team.
            </p>
            <input
              type="text"
              value={customTeamName}
              onChange={(e) => setCustomTeamName(e.target.value)}
              placeholder="Team name..."
              className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] placeholder-[#808080] focus:outline-none focus:border-[#FFC96C] transition-colors mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateCustomTeam}
                disabled={!customTeamName.trim()}
                className="flex-1 btn-system disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Team
              </button>
              <button
                onClick={() => {
                  setShowCustomTeamModal(false);
                  setCustomTeamName('');
                }}
                className="flex-1 btn-system-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && configAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="panel-system p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              {confirmAction === 'pause' ? 'Pause Agent' : 'Restart Agent'}
            </h3>
            <p className="text-[#B3B3B3] mb-6">
              {confirmAction === 'pause' 
                ? `Are you sure you want to pause ${configAgent.name}? It will stop processing requests.`
                : `Are you sure you want to restart ${configAgent.name}? It will resume processing requests.`
              }
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
                  setConfigAgent(null);
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

      {/* Configuration Modal with Suggested Prompts */}
      {showConfigModal && configAgent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeConfigModal();
            }
          }}
        >
          <div
            ref={configModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="configure-agent-title"
            tabIndex={-1}
            className="panel-system relative w-[90vw] sm:w-full sm:max-w-2xl max-h-[75vh] sm:max-h-none my-8 p-6 sm:p-8 overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <button
              onClick={closeConfigModal}
              aria-label="Close settings"
              className="absolute right-2 top-2 h-11 w-11 rounded-full text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#202020] flex items-center justify-center"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 id="configure-agent-title" className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
              CONFIGURE AGENT
            </h3>
            <p className="text-[#B3B3B3] mb-6 text-sm">
              {configAgent.name} • v{configAgent.version}
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Agent Name
                </label>
                <input
                  type="text"
                  defaultValue={configAgent.name}
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Description
                </label>
                <textarea
                  defaultValue={configAgent.description}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                  Capabilities
                </label>
                <div className="space-y-2">
                  {configAgent.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 bg-[#0C0C0C] border border-[#202020] rounded text-[#FFC96C] focus:ring-[#FFC96C]"
                      />
                      <span className="text-[#F2F2F2] text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#F2F2F2] text-sm font-medium mb-3 uppercase tracking-tight">
                  Suggested Prompts for {configAgent.name}
                </label>
                <div className="space-y-2">
                  {getSuggestedPrompts(configAgent).map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Use prompt: ${prompt}`}
                      onClick={() => {
                        setAgentInput(prompt);
                        closeConfigModal();
                      }}
                      className="w-full text-left panel-system p-3 bg-[#0C0C0C] border border-[#202020] hover:border-[#FFC96C] hover:bg-[#1A1A1A]"
                    >
                      <span className="text-[#F2F2F2] text-sm">{prompt}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[#808080] text-xs mt-2">
                  These prompts are optimized for {configAgent.name}'s capabilities.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={closeConfigModal}
                className="flex-1 btn-system"
              >
                Save Changes
              </button>
              <button
                onClick={closeConfigModal}
                className="flex-1 btn-system-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

