import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Sparkles, ChevronDown, Bot, Lock } from 'lucide-react';
import ChatTools from './chat/ChatTools';
import { agents as agentData } from '../lib/agents-enhanced';
import { sendMessage as sendMessageAPI, getSession } from '../lib/api/agentClient';
import MessageBubble from './MessageBubble';
import ConversationHistory from './ConversationHistory';
import TokenUsageDisplay from './TokenUsageDisplay';
import { filterAgentsByTier, hasAgentAccess, getUpgradeMessage } from '../lib/agentAccessControl';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context

// Timing controls for the hero typewriter greeting
const TYPEWRITER_CHAR_MS = 61;
const TYPEWRITER_PAUSE_MS = 1000;

export default function AIChatInterface() {
  const { user } = useAuth(); // Get current user from auth context
  const [typingDone, setTypingDone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  const [selectedAgent, setSelectedAgent] = useState('Orchestrator');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [tokenStats, setTokenStats] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef('Orchestrator');
  const hasPlayedRef = useRef(false);
  const titleRef = useRef(null);
  const helloPrefixRef = useRef(null);

  // Get user's subscription tier
  const userTier = user?.subscription_tier || 'anonymous';

  // Filter agents based on user's tier
  const availableAgents = filterAgentsByTier(agentData, userTier);
  const agents = availableAgents.map(agent => ({
    name: agent.name,
    id: agent.id,
    color: agent.color,
    icon: agent.icon
  }));

  // Get all agents for the menu (including locked ones)
  const allAgents = agentData.map(agent => ({
    name: agent.name,
    id: agent.id,
    color: agent.color,
    icon: agent.icon,
    locked: !hasAgentAccess(agent.id, userTier)
  }));

  const slugifyAgent = (name) => name.toLowerCase().replace(/\s+/g, '-');

  const handleAgentSelect = (agent) => {
    // Check if agent is locked
    if (agent.locked) {
      setError(getUpgradeMessage(agent.id, userTier));
      setShowUpgradeModal(true);
      return;
    }

    setSelectedAgent(agent.name);
    setShowAgentMenu(false);
    activeAgentRef.current = agent.name;

    // Update URL query param
    try {
      setSearchParams({ agent: slugifyAgent(agent.name) }, { replace: true });
    } catch {
      // Fallback: ignore if router context not ready
    }
  };

  const currentAgent = agents.find((agent) => agent.name === selectedAgent);
  const currentAgentColor = currentAgent ? currentAgent.color : '#FFC96C';

  const clearAnimationTimers = () => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const startTypingAnimation = () => {
    if (hasPlayedRef.current || isAnimatingRef.current) {
      return;
    }

    // Respect reduced motion preferences
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setTypedText(`Hello. I am your ${activeAgentRef.current}`);
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
      return;
    }

    isAnimatingRef.current = true;
    const fullText = `Hello. I am your ${activeAgentRef.current}`;
    let currentIndex = 0;

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        const timeoutId = setTimeout(typeNextChar, TYPEWRITER_CHAR_MS);
        timeoutsRef.current.push(timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          setTypingDone(true);
          hasPlayedRef.current = true;
          isAnimatingRef.current = false;
        }, TYPEWRITER_PAUSE_MS);
        timeoutsRef.current.push(timeoutId);
      }
    };

    typeNextChar();
  };

  useEffect(() => {
    startTypingAnimation();
    return () => clearAnimationTimers();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setError(null);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      // Get agent ID from selected agent name
      const agentId = currentAgent?.id || 'orchestrator';

      // Send message to API
      const response = await sendMessageAPI({
        message: userMessage,
        agentId,
        sessionId: currentSessionId
      });

      if (!response.success) {
        // Handle error responses (e.g., token limit exceeded)
        if (response.upgradeRequired) {
          setError(response.error);
          setShowUpgradeModal(true);
        } else {
          setError(response.error || 'Failed to send message');
        }
        return;
      }

      // Update session ID
      if (response.data.sessionId) {
        setCurrentSessionId(response.data.sessionId);
      }

      // Update token stats if available
      if (response.data.tokenStats) {
        setTokenStats(response.data.tokenStats);
      }

      // Add agent response to chat
      const newAgentMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        agent: response.data.agent,
        timestamp: response.data.metadata?.timestamp || new Date().toISOString(),
        usage: response.data.usage
      };
      setMessages(prev => [...prev, newAgentMessage]);

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Token Usage & Agent Selector */}
          <div className="lg:col-span-1 space-y-4">
            {/* Token Usage Display */}
            {user && userTier !== 'anonymous' && (
              <TokenUsageDisplay
                tokenStats={tokenStats}
                tier={userTier}
                onUpgrade={handleUpgrade}
              />
            )}

            {/* Agent Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Select Agent</h3>
              <div className="space-y-2">
                {allAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAgentSelect(agent)}
                    disabled={agent.locked}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      agent.name === selectedAgent
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : agent.locked
                        ? 'bg-gray-50 border border-gray-200 opacity-60 cursor-not-allowed'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </span>
                    </div>
                    {agent.locked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Upgrade CTA for free users */}
              {(userTier === 'free' || userTier === 'anonymous') && (
                <button
                  onClick={handleUpgrade}
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                >
                  Unlock All 13 Agents
                </button>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                      {currentAgent?.icon || '🎯'}
                    </div>
                    <div>
                      <h2 className="text-white font-semibold">
                        {selectedAgent}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {userTier === 'anonymous' ? '1 question remaining' : 'Ready to help'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{currentAgent?.icon || '🎯'}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {typedText}
                        </h3>
                        <p className="text-gray-600">
                          How can I assist you today?
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      agentColor={currentAgentColor}
                    />
                  ))
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Bot className="w-5 h-5 animate-pulse" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="px-6 py-3 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Upgrade Required
            </h3>
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

