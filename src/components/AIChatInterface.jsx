import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Sparkles, ChevronDown, Bot } from 'lucide-react';
import ChatTools from './chat/ChatTools';
import { agents as agentData } from '../lib/agents-enhanced';
import { sendMessage as sendMessageAPI, getSession } from '../lib/api/agentClient';
import MessageBubble from './MessageBubble';
import ConversationHistory from './ConversationHistory';
import { getAgentColor } from './ui/agentThemes';

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
  const activeAgentRef = useRef('Commander');
  const hasPlayedRef = useRef(false);
  const titleRef = useRef(null);
  const helloPrefixRef = useRef(null);

  // Get all agents from the enhanced agents library
  const agents = agentData.map(agent => ({
    id: agent.id,
    name: agent.name,
    color: agent.color,
    icon: agent.icon,
    domain: agent.domain
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
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // no rotation under reduced motion
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % typewriterPhrases.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const currentAgent = agents.find((agent) => agent.name === selectedAgent) || menuAgents[0];
  const currentAgentColor = currentAgent ? getAgentColor(currentAgent.name, currentAgent.color) : '#FFC96C';

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

    // Two-phase typewriter: "Hello." then " I am your {Agent}"
    isAnimatingRef.current = true;
    setTypedText('');

    const greetingPart = 'Hello.';
    const agentPart = ` I am your ${activeAgentRef.current}`;
    const typingSpeed = TYPEWRITER_CHAR_MS;
    const pauseDuration = TYPEWRITER_PAUSE_MS;
    let delay = 0;
    let output = '';

    // Type "Hello."
    greetingPart.split('').forEach((ch) => {
      delay += typingSpeed;
      const id = setTimeout(() => {
        output += ch;
        setTypedText(output);
      }, delay);
      timeoutsRef.current.push(id);
    });

    // Pause
    delay += pauseDuration;

    // Type " I am your {Agent}"
    agentPart.split('').forEach((ch) => {
      delay += typingSpeed;
      const id = setTimeout(() => {
        output += ch;
        setTypedText(output);
      }, delay);
      timeoutsRef.current.push(id);
    });

    // Completion
    const completionId = setTimeout(() => {
      setTypedText(`Hello. I am your ${activeAgentRef.current}`);
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
    }, delay + typingSpeed);
    timeoutsRef.current.push(completionId);
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

  // Keep typed agent label in sync when user changes selection after animation
  useEffect(() => {
    activeAgentRef.current = selectedAgent;
    if (hasPlayedRef.current) {
      setTypedText(`Hello. I am your ${selectedAgent}`);
    }
  }, [selectedAgent]);

  // B) Reduce typewriter subheading font-size by 20% multiplicatively
  useEffect(() => {
    const root = sectionRef.current || document.querySelector('.chat-hero');
    if (!root) return;
    const elSub = root.querySelector('.subhead');
    if (elSub) {
      const fs = parseFloat(getComputedStyle(elSub).fontSize || '0');
      if (!Number.isNaN(fs) && fs > 0) {
        elSub.style.fontSize = `${Math.round(fs * 0.8)}px`;
      }
    }
  }, []);

  // D) Title-case utility for agent info line
  const toTitleCase = (s) => s
    .split(' ')
    .map(w => (w.length ? (w[0].toUpperCase() + w.slice(1).toLowerCase()) : w))
    .join(' ');

  // Derive typed prefix vs. agent portion for colored styling
  const prefixText = 'Hello. I am your ';
  const typedPrefix = typedText.slice(0, Math.min(typedText.length, prefixText.length));
  const typedAgentText = typedText.length > prefixText.length ? typedText.slice(prefixText.length) : '';

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
      const selectedAgentId = agents.find(a => a.name === selectedAgent)?.id || 'commander';
      const response = await sendMessageAPI(
        userMessage,
        selectedAgentId,
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
      className="chat-hero relative w-full max-w-screen overflow-x-hidden px-4 py-16 sm:px-6"
      aria-label="Chat hero"
    >
      <div className="mx-auto max-w-4xl">
        {/* Canonical Hero */}
        <div className="mb-6 text-center">
          <div className="subhead mb-2 text-[#F2F2F2] text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold tracking-tight uppercase">SYNTEK AUTOMATIONS</div>
          <h1
            ref={titleRef}
            className="mb-3 font-bold uppercase tracking-tight text-[#F2F2F2] text-[clamp(1.25rem,4.5vw,1.75rem)]"
          >
            <span ref={helloPrefixRef} id="hero-typed" className="inline-flex flex-wrap items-baseline gap-1">
              <span className="whitespace-pre text-[#B3B3B3]">{typedPrefix}</span>
              <span
                className="underline underline-offset-4"
                style={{ color: currentAgentColor, textDecorationColor: currentAgentColor }}
              >
                {typedAgentText}
              </span>
            </span>
            <span
              className="ml-2 inline-block h-[1em] w-[2px] animate-blink align-middle"
              style={{
                backgroundColor: currentAgentColor,
                opacity: typingDone ? 0 : 1,
              }}
            />
          </h1>
          {/* Rotating agent phrases (normalized formatting) */}
          <div className="text-sm text-[#B3B3B3] h-5 relative">
            {typewriterPhrases.map((phrase, idx) => {
              const [agentLabelRaw, infoRaw = ''] = phrase.split(' · ');
              const agentLabel = agentLabelRaw?.trim();
              const active = idx === phraseIndex;
              const themeHex = getAgentColor(agentLabel, currentAgentColor);
              const fixedInfo = toTitleCase((infoRaw || '').replace(/\s*&\s*/g, ' + '));
              return (
                <div
                  key={phrase}
                  className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 absolute left-0 right-0'}`}
                >
                  <span className={'font-semibold'} style={{ color: themeHex }}>{agentLabel}</span>
                  <span className="mx-2 text-[#666]">·</span>
                  <span className="text-[#B3B3B3]">{fixedInfo}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Controls moved: history as attached pill near input */}
        {typingDone && currentSessionId && (
          <div className="mb-6">
            <button
              onClick={startNewConversation}
              className="panel-system px-4 py-2 text-sm font-medium text-[#FFC96C] hover:bg-[#202020] transition-all"
            >
              New Conversation
            </button>
          </div>
        )}

        {/* Conversation History Panel */}
        {typingDone && showHistory && (
          <div className="mb-6">
            <ConversationHistory 
              onSelectSession={loadSession}
              currentSessionId={currentSessionId}
            />
          </div>
        )}

        {/* Agent Selector (centered pill) */}
        {typingDone && (
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
                  aria-hidden="true"
                  className="agent-dot"
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '9999px',
                    backgroundColor: currentAgentColor,
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.2)'
                  }}
                />
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
                      aria-hidden="true"
                      className="agent-dot"
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '9999px',
                        marginLeft: '2px',
                        backgroundColor: getAgentColor(agent.name, agent.color),
                        boxShadow: '0 0 0 2px rgba(0,0,0,0.2)'
                      }}
                    />
                    <span className="flex-1 text-sm text-[#F2F2F2]">{agent.name}</span>
                    {selectedAgent === agent.name && <span className="text-[#FFC96C]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Messages Display */}
        {typingDone && messages.length > 0 && (
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
        {typingDone && (
        <form onSubmit={handleSubmit} className="relative">
          <button
            type="button"
            className="history-pill"
            aria-pressed={showHistory}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
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
        )}

        {/* Dynamic Suggestions */}
        {typingDone && (
          <SuggestionsRow inputValue={message} onPick={(text) => setMessage(text)} />
        )}

        
      </div>
    </section>
  );
}

// ---- Suggestions Row (UI-only) -----------------------------------------
const defaultSuggestions = [
  'Draft a meeting agenda',
  'Summarize board engagement',
  'Prioritize initiatives',
  'Generate a progress report',
];

const suggestionBuckets = [
  { keys: ['agenda','meeting','minutes'], suggestions: ['Draft a meeting agenda', 'Create talking points', 'Suggest attendees & times'] },
  { keys: ['board','engagement','boardmember','board meeting'], suggestions: ['Summarize board engagement', 'Highlight low-engagement members', 'Trend analysis of engagement'] },
  { keys: ['priorit','initiative','roadmap','backlog'], suggestions: ['Prioritize initiatives', 'Rank initiatives by impact/effort', 'Create 90-day roadmap'] },
  { keys: ['progress','status','report','update'], suggestions: ['Generate progress report', 'Create executive summary', 'List outstanding blockers & owners'] }
];

function getSuggestions(input) {
  if (!input || input.trim().length < 2) return defaultSuggestions;
  const t = input.toLowerCase();
  const matches = [];
  suggestionBuckets.forEach(b => {
    if (b.keys.some(k => t.includes(k))) matches.push(...b.suggestions);
  });
  const uniq = [...new Set(matches)];
  if (uniq.length) return uniq.slice(0,4);
  return [
    `Draft a short brief about "${input}"`,
    `Summarize "${input}"`,
    `Make a to-do list from "${input}"`,
    'Refine my request',
  ];
}

function SuggestionsRow({ inputValue, onPick }) {
  const items = getSuggestions(inputValue);
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onPick(prompt)}
          className="panel-system p-3 text-left text-sm text-[#B3B3B3] transition-all hover:bg-[#202020] hover:text-[#F2F2F2]"
        >
          <Sparkles className="mb-1 inline h-3 w-3" /> {prompt}
        </button>
      ))}
    </div>
  );
}

