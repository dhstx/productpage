import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, AlertCircle, Zap, Lock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PTHealthBar from './PTHealthBar';

const AIChatInterface = ({ agents }) => {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ptUsage, setPtUsage] = useState(null);
  const [estimatedPT, setEstimatedPT] = useState(null);
  const [throttleWarning, setThrottleWarning] = useState(null);
  const messagesEndRef = useRef(null);

  // Load PT usage on mount
  useEffect(() => {
    if (user) {
      loadPTUsage();
    }
  }, [user]);

  // Estimate PT cost when message changes
  useEffect(() => {
    if (inputMessage && selectedAgent) {
      estimatePTCost();
    } else {
      setEstimatedPT(null);
    }
  }, [inputMessage, selectedAgent]);

  const loadPTUsage = async () => {
    try {
      const response = await fetch('/api/pt/usage', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPtUsage(data);
      }
    } catch (err) {
      console.error('Failed to load Points usage:', err);
    }
  };

  const estimatePTCost = async () => {
    try {
      const response = await fetch('/api/pt/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          agent: selectedAgent?.id,
          model: selectedAgent?.model || 'claude-3-haiku-20240307'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEstimatedPT(data);
      }
    } catch (err) {
      console.error('Failed to estimate Point cost:', err);
    }
  };

  const checkThrottles = async () => {
    try {
      const response = await fetch('/api/pt/check-throttles', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.throttled) {
          setThrottleWarning(data);
          return false;
        }
        setThrottleWarning(null);
        return true;
      }
    } catch (err) {
      console.error('Failed to check throttles:', err);
    }
    return true;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isLoading) return;

    // Check if user has enough Points
    if (ptUsage && estimatedPT) {
      const availablePT = ptUsage.core_pt_remaining + (ptUsage.advanced_pt_remaining || 0);
      if (estimatedPT.estimated_pt > availablePT) {
        setError({
          type: 'insufficient_pt',
          message: `Not enough Points. Need ${estimatedPT.estimated_pt} Points, have ${availablePT} Points.`,
          action: 'upgrade'
        });
        return;
      }
    }

    // Check throttles
    const canProceed = await checkThrottles();
    if (!canProceed) {
      setError({
        type: 'throttled',
        message: throttleWarning.message,
        action: 'wait'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token || ''}`
        },
        body: JSON.stringify({
          message: inputMessage,
          agent: selectedAgent.id,
          sessionId: messages[0]?.conversation_id,
          userId: user?.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.type === 'insufficient_pt') {
          setError({
            type: 'insufficient_pt',
            message: data.error.message,
            remaining: data.error.remaining,
            required: data.error.required,
            action: 'upgrade'
          });
        } else if (data.error?.type === 'throttled') {
          setError({
            type: 'throttled',
            message: data.error.message,
            throttle_info: data.error.throttle_info,
            action: 'wait'
          });
        } else if (data.error?.type === 'tier_restriction') {
          setError({
            type: 'tier_restriction',
            message: data.error.message,
            required_tier: data.error.required_tier,
            action: 'upgrade'
          });
        } else {
          throw new Error(data.error?.message || 'Failed to send message');
        }
        
        // Remove user message on error
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        conversation_id: data.conversation_id,
        pt_consumed: data?.usage?.ptConsumed || data.pt_consumed,
        model_used: data.model || data.model_used
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update PT usage
      if (data.pt_usage) {
        setPtUsage(data.pt_usage);
      } else {
        // Reload PT usage
        await loadPTUsage();
      }

      // Show throttle warnings if any
      if (data.warnings && data.warnings.length > 0) {
        setThrottleWarning({
          type: 'warning',
          messages: data.warnings
        });
      }

    } catch (err) {
      setError({
        type: 'error',
        message: err.message || 'Failed to send message',
        action: 'retry'
      });
      
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
            
            {error.type === 'insufficient_pt' && (
              <div className="mt-2">
                <p className="text-xs text-red-700">
                  Required: {error.required} Points | Available: {error.remaining} Points
                </p>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Upgrade to get more Points →
                </button>
              </div>
            )}

            {error.type === 'throttled' && error.throttle_info && (
              <div className="mt-2 text-xs text-red-700">
                <p>Throttle: {error.throttle_info.type}</p>
                <p>Reason: {error.throttle_info.reason}</p>
                {error.throttle_info.wait_until && (
                  <p>Available again: {new Date(error.throttle_info.wait_until).toLocaleString()}</p>
                )}
              </div>
            )}

            {error.type === 'tier_restriction' && (
              <div className="mt-2">
                <p className="text-xs text-red-700">
                  This feature requires {error.required_tier} tier or higher
                </p>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Upgrade your plan →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderThrottleWarning = () => {
    if (!throttleWarning || throttleWarning.type !== 'warning') return null;

    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
          <div className="flex-1">
            {throttleWarning.messages.map((msg, idx) => (
              <p key={idx} className="text-xs text-yellow-800">{msg}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPTEstimate = () => {
    if (!estimatedPT || !inputMessage) return null;

    return (
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <Zap className="w-3 h-3" />
        <span>Estimated cost: {estimatedPT.estimated_pt} Points</span>
        {estimatedPT.model_type === 'advanced' && (
          <span className="text-purple-600">(Advanced model)</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Point Health Bar */}
      {user && ptUsage && (
        <div className="mb-4">
          <PTHealthBar
            corePTUsed={ptUsage.core_pt_used}
            corePTTotal={ptUsage.core_pt_total}
            advancedPTUsed={ptUsage.advanced_pt_used || 0}
            advancedPTTotal={ptUsage.advanced_pt_total || 0}
            tier={ptUsage.tier}
            resetDate={ptUsage.reset_date}
          />
        </div>
      )}

      {/* Agent Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Agent
        </label>
        <select
          value={selectedAgent?.id || ''}
          onChange={(e) => {
            const agent = agents.find(a => a.id === e.target.value);
            setSelectedAgent(agent);
            setMessages([]);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose an agent...</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} - {agent.description}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {renderError()}

      {/* Throttle Warning */}
      {renderThrottleWarning()}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && selectedAgent && (
          <div className="text-center text-gray-500 py-8">
            <p>Start a conversation with {selectedAgent.name}</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.pt_consumed && (
                <div className="mt-2 pt-2 border-t border-gray-300 flex items-center gap-2 text-xs opacity-75">
                  <Zap className="w-3 h-3" />
                  <span>{message.pt_consumed} PT consumed</span>
                  {message.model_used && (
                    <span className="text-xs">({message.model_used})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t pt-4">
        {renderPTEstimate()}
        
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedAgent ? "Type your message..." : "Select an agent first..."}
            disabled={!selectedAgent || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!selectedAgent || !inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Points Info */}
        {ptUsage && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>Core Points: {ptUsage.core_pt_remaining} / {ptUsage.core_pt_total}</span>
              {ptUsage.advanced_pt_total > 0 && (
                <span>Advanced Points: {ptUsage.advanced_pt_remaining} / {ptUsage.advanced_pt_total}</span>
              )}
            </div>
            <span>Resets: {new Date(ptUsage.reset_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatInterface;

