import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Sparkles, ChevronDown, Bot } from 'lucide-react';
import ChatTools from './chat/ChatTools';
import { agents as agentData } from '../lib/agents-enhanced';
import { sendMessage as sendMessageAPI, getSession } from '../lib/api/agentClient';
import MessageBubble from './MessageBubble';
import ConversationHistory from './ConversationHistory';

// Timing controls for the hero typewriter greeting
const TYPEWRITER_CHAR_MS = 61;
const TYPEWRITER_PAUSE_MS = 1000;

export default function AIChatInterface() {
  const [typingDone, setTypingDone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  const [selectedAgent, setSelectedAgent] = useState('Commander');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef('Orchestrator');
  const hasPlayedRef = useRef(false);
  const titleRef = useRef(null);
  const helloPrefixRef = useRef(null);

  // Get all agents from the enhanced agents library
  const agents = agentData.map(agent => ({
    name: agent.name,
    color: agent.color,
    icon: agent.icon
  }));

  // Restrict UI to Commander, Connector, Conductor (UI only)
  const allowedSet = new Set(['Commander', 'Connector', 'Conductor']);
  const menuAgents = agents.filter(a => allowedSet.has(a.name));

  const slugifyAgent = (name) => name.toLowerCase().replace(/\s+/g, '-');

  const handleAgentSelect = (name) => {
    setSelectedAgent(name);
    setShowAgentMenu(false);
    activeAgentRef.current = name;

    // Update URL query param
    try {
      setSearchParams({ agent: slugifyAgent(name) }, { replace: true });
    } catch {
      // Fallback: ignore if router context not ready
    }
  };

  // Typewriter phrases for the three agents (UI only)
  const typewriterPhrases = [
    'Commander · strategic ops',
    'Connector · data + integrations',
    'Conductor · orchestration & oversight'
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % typewriterPhrases.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const currentAgent = agents.find((agent) => agent.name === selectedAgent) || menuAgents[0];
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
      setTypedText('HELLO. I AM YOUR');
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
      return;
    }

    isAnimatingRef.current = true;
    const fullText = 'HELLO. I AM YOUR';
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
    // Check if agent is specified in URL
    const agentParam = searchParams.get('agent');
    if (agentParam) {
      const matchedAgent = agents.find(
        a => slugifyAgent(a.name) === agentParam
      );
      if (matchedAgent && allowedSet.has(matchedAgent.name)) {
        setSelectedAgent(matchedAgent.name);
        activeAgentRef.current = matchedAgent.name;
        return;
      }
    }
    // Fallback ensure selected is allowed
    if (!allowedSet.has(selectedAgent)) {
      const fallback = menuAgents[0]?.name || 'Commander';
      setSelectedAgent(fallback);
      activeAgentRef.current = fallback;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTypingAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearAnimationTimers();
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setError(null);
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Send message to API
      const response = await sendMessageAPI(
        userMessage,
        selectedAgent,
        currentSessionId
      );

      // Update session ID if this is a new conversation
      if (!currentSessionId && response.data?.sessionId) {
        setCurrentSessionId(response.data.sessionId);
      }

      // Add agent response to chat
      const agentMessage = {
        id: Date.now() + 1,
        role: 'agent',
        agent: response.data?.agent || selectedAgent,
        content: response.data?.response || 'No response',
        timestamp: new Date().toISOString(),
        metadata: response.data?.metadata || {},
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setIsLoading(true);
      const sessionData = await getSession(sessionId);
      
      // Convert session messages to component format
      const loadedMessages = sessionData.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        agent: msg.agent,
        content: msg.content,
        timestamp: msg.created_at,
        metadata: msg.metadata
      }));
      
      setMessages(loadedMessages);
      setCurrentSessionId(sessionId);
      setShowHistory(false);
    } catch (err) {
      console.error('Error loading session:', err);
      setError(`Failed to load conversation: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-screen overflow-x-hidden px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        {/* Canonical Hero */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-[#F2F2F2] text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold tracking-tight uppercase">SYNTEK AUTOMATIONS</div>
          <h1
            ref={titleRef}
            className="mb-3 font-bold uppercase tracking-tight text-[#F2F2F2] text-[clamp(1.25rem,4.5vw,1.75rem)]"
          >
            <span ref={helloPrefixRef} id="hero-typed">
              {typedText}
            </span>{' '}
            <span className="text-[#FFC96C] underline decoration-[#FFC96C] underline-offset-4">STRATEGIC ADVISOR</span>
            <span
              className="ml-2 inline-block h-[1em] w-[2px] animate-blink align-middle"
              style={{
                backgroundColor: currentAgentColor,
                opacity: typingDone ? 0 : 1,
              }}
            />
          </h1>
          {/* Rotating agent phrases */}
          <div className="text-sm text-[#B3B3B3] h-5 relative">
            {typewriterPhrases.map((phrase, idx) => {
              const [agentLabel, rest] = phrase.split(' · ');
              const active = idx === phraseIndex;
              return (
                <div
                  key={phrase}
                  className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 absolute left-0 right-0'}`}
                >
                  <span className={selectedAgent === agentLabel ? 'font-semibold text-[#FFC96C]' : 'font-semibold text-[#F2F2F2]'}>
                    {agentLabel}
                  </span>
                  <span className="mx-2 text-[#666]">·</span>
                  <span>{rest}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Controls */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="panel-system px-4 py-2 text-sm font-medium text-[#F2F2F2] hover:bg-[#202020] transition-all"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          
          {currentSessionId && (
            <button
              onClick={startNewConversation}
              className="panel-system px-4 py-2 text-sm font-medium text-[#FFC96C] hover:bg-[#202020] transition-all"
            >
              New Conversation
            </button>
          )}
        </div>

        {/* Conversation History Panel */}
        {showHistory && (
          <div className="mb-6">
            <ConversationHistory 
              onSelectSession={loadSession}
              currentSessionId={currentSessionId}
            />
          </div>
        )}

        {/* Agent Selector (centered pill) */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowAgentMenu(!showAgentMenu)}
              className="flex items-center justify-between gap-3 rounded-full border border-[#202020] bg-[#0C0C0C] px-5 py-2 text-sm text-[#F2F2F2] shadow-sm ring-1 ring-transparent hover:bg-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C]/50"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}
              aria-haspopup="listbox"
              aria-expanded={showAgentMenu}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${currentAgentColor}20` }}
                >
                  <span style={{ color: currentAgentColor }}>{currentAgent?.icon || '🤖'}</span>
                </span>
                <span>Select Agent</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-[#B3B3B3] transition-transform ${showAgentMenu ? 'rotate-180' : ''}`} />
            </button>

            {showAgentMenu && (
              <div role="listbox" className="absolute left-1/2 z-10 mt-2 w-[min(20rem,90vw)] -translate-x-1/2 rounded-lg border border-[#202020] bg-[#0C0C0C] p-1 shadow-xl">
                {menuAgents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => handleAgentSelect(agent.name)}
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-[#202020]"
                    role="option"
                    aria-selected={selectedAgent === agent.name}
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      <span style={{ color: agent.color }}>{agent.icon || '🤖'}</span>
                    </span>
                    <span className="flex-1 text-sm text-[#F2F2F2]">{agent.name}</span>
                    {selectedAgent === agent.name && <span className="text-[#FFC96C]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Display */}
        {messages.length > 0 && (
          <div className="mb-6 panel-system max-h-[500px] overflow-y-auto p-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC96C]/20">
                  <Bot className="h-4 w-4 text-[#FFC96C] animate-pulse" />
                </div>
                <div className="bg-[#202020] text-[#F2F2F2] rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#FFC96C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input - canonical search bar with toggles */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="panel-system overflow-hidden p-2">
            <ChatTools
              activeMode={activeMode}
              onToggleMode={setActiveMode}
              onAttach={() => {}}
              features={{ mic: true, upload: true, modes: ['chat', 'agi'] }}
              uploadOnRight
              rightAppend={(
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: message.trim() ? currentAgentColor : '#333' }}
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4 text-[#1A1A1A]" />
                </button>
              )}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you need help with..."
                className="w-full resize-none rounded-full bg-transparent px-4 py-3 text-[#F2F2F2] placeholder-[#888] focus:outline-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </ChatTools>
          </div>
        </form>

        {/* Action Chips */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            'Analyze board engagement trends',
            'Draft meeting agenda',
            'Prioritize initiatives',
            'Generate progress report',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setMessage(prompt)}
              className="panel-system p-3 text-left text-sm text-[#B3B3B3] transition-all hover:bg-[#202020] hover:text-[#F2F2F2]"
            >
              <Sparkles className="mb-1 inline h-3 w-3" /> {prompt}
            </button>
          ))}
        </div>

        
      </div>
    </section>
  );
}

