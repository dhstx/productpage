import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Sparkles, ChevronDown, Bot, Clock } from 'lucide-react';
import ChatTools from './chat/ChatTools';
import { agents as agentData } from '../lib/agents-enhanced';
import { sendMessage as sendMessageAPI, getSession } from '../lib/api/agentClient';
import MessageBubble from './MessageBubble';
import ConversationHistory from './ConversationHistory';
import { getAgentColor } from './ui/agentThemes';
import UpfadeOnOpen from './UpfadeOnOpen';

// Timing controls for the hero typewriter greeting
const TYPEWRITER_CHAR_MS = 61;
const TYPEWRITER_PAUSE_MS = 650; // shorter pause per new spec

export default function AIChatInterface({ initialAgent = 'Commander', onAgentChange }) {
  const [typingDone, setTypingDone] = useState(false);
  const [chatboxMounted, setChatboxMounted] = useState(false);
  const [chatboxVisible, setChatboxVisible] = useState(false);
  const [chipsVisible, setChipsVisible] = useState([false, false, false, false]);
  const [h1Visible, setH1Visible] = useState(false);
  const [h1Class, setH1Class] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  // Get all agents from the enhanced agents library
  const agents = agentData.map(agent => ({
    id: agent.id,
    name: agent.name,
    color: agent.color,
    icon: agent.icon,
    domain: agent.domain
  }));

  // Restrict UI to hero agents (UI only)
  const allowedSet = new Set(['Chief of Staff', 'Commander', 'Connector', 'Conductor']);
  const menuAgents = agents.filter(a => allowedSet.has(a.name));

  const slugifyAgent = (name) => name.toLowerCase().replace(/\s+/g, '-');

  // Prefer: props/url/localStorage -> Chief of Staff -> fallback (Commander)
  const deriveInitialSelectedAgent = () => {
    try {
      if (typeof window !== 'undefined') {
        // 1) URL param agent=slug or exact name/key
        const urlAgent = new URLSearchParams(window.location.search).get('agent');
        if (urlAgent) {
          const matched = (agents || []).find(a =>
            (a.name && a.name.toLowerCase() === urlAgent.toLowerCase()) ||
            (a.key && a.key.toLowerCase() === urlAgent.toLowerCase()) ||
            (a.id && a.id.toLowerCase() === urlAgent.toLowerCase()) ||
            (a.name && a.name.toLowerCase().replace(/\s+/g,'-') === urlAgent.toLowerCase())
          );
          if (matched) return matched.name;
        }

        // 2) localStorage
        const stored = localStorage.getItem('dhstx_selected_agent');
        if (stored) {
          const matched = (agents || []).find(a => a.name === stored);
          if (matched) return matched.name;
        }

        // 3) Prefer an agent named exactly "Chief of Staff" or a close match
        const chief = (agents || []).find(a =>
          (a.name && a.name.toLowerCase() === 'chief of staff') ||
          (a.name && a.name.toLowerCase().includes('chief of staff')) ||
          (a.key && a.key.toLowerCase().includes('chief')) ||
          (a.id && a.id.toLowerCase().includes('chief'))
        );
        if (chief) return chief.name;
      }
    } catch (err) {
      console.warn('deriveInitialSelectedAgent error', err);
    }
    // preserve existing fallback (Commander)
    return 'Commander';
  };

  // ensure dropdown initial value matches the typewriter to avoid flicker
  const [selectedAgent, setSelectedAgent] = useState(deriveInitialSelectedAgent);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  // removed rotating auxiliary label phrases per updated hero spec
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const chatboxRootRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef('Commander');
  const hasPlayedRef = useRef(false);
  const hasEnteredViewportRef = useRef(false);
  const titleRef = useRef(null);
  const subheadRef = useRef(null);
  const helloPrefixRef = useRef(null);

  // Sync ref to initial state ASAP (before any animation begins)
  useEffect(() => {
    activeAgentRef.current = selectedAgent;
    // Persist the initial value if none stored
    try {
      if (typeof window !== 'undefined') {
        const existing = window.localStorage.getItem('dhstx_selected_agent');
        if (!existing) window.localStorage.setItem('dhstx_selected_agent', selectedAgent);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAgentSelect = (name) => {
    setSelectedAgent(name);
    setShowAgentMenu(false);
    activeAgentRef.current = name;
    try { onAgentChange?.(name); } catch {}
    try { if (typeof window !== 'undefined') window.localStorage.setItem('dhstx_selected_agent', name); } catch {}

    // Update URL query param
    try {
      setSearchParams({ agent: slugifyAgent(name) }, { replace: true });
    } catch {
      // Fallback: ignore if router context not ready
    }

    // Abort and restart typewriter if mid-animation
    if (isAnimatingRef.current && !hasPlayedRef.current) {
      abortAndRestartTyping();
    }
  };

  // (Removed) rotating agent phrases under hero to eliminate purple label

  const currentAgent = agents.find((agent) => agent.name === selectedAgent) || menuAgents[0];
  const currentAgentColor = currentAgent ? getAgentColor(currentAgent.name, currentAgent.color) : '#FFC96C';

  const clearAnimationTimers = () => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const abortAndRestartTyping = () => {
    clearAnimationTimers();
    isAnimatingRef.current = false;
    hasPlayedRef.current = false;
    setTypingDone(false);
    setTypedText('');
    // Ensure the ref reflects the latest selection
    activeAgentRef.current = selectedAgent;
    // Only restart if the hero is in view
    if (hasEnteredViewportRef.current) {
      startTypingAnimation();
    }
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
      setTypedText(`Welcome. Confer with your ${activeAgentRef.current}.`);
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
      return;
    }

    // Three-phase typewriter: "Welcome." then " Confer with your " then "{Agent}."
    isAnimatingRef.current = true;
    setTypedText('');

    const greetingPart = 'Welcome.';
    const conferPart = ' Confer with your ';
    const agentPart = `${activeAgentRef.current}.`;
    // Slow typewriter by 15% (UI-only)
    const typingSpeed = Math.round(TYPEWRITER_CHAR_MS * 1.15);
    const pauseDuration = TYPEWRITER_PAUSE_MS;
    let delay = 0;
    let output = '';

    // Type "Welcome."
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

    // Type " Confer with your "
    conferPart.split('').forEach((ch) => {
      delay += typingSpeed;
      const id = setTimeout(() => {
        output += ch;
        setTypedText(output);
      }, delay);
      timeoutsRef.current.push(id);
    });

    // Type "{Agent}."
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
      setTypedText(`Welcome. Confer with your ${activeAgentRef.current}.`);
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
          hasEnteredViewportRef.current = true;
          // Ensure the agent used by the typewriter matches current selection
          activeAgentRef.current = selectedAgent;
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
  }, [selectedAgent]);

  // Keep typewriter phrase reactive to selected agent
  // - If animation already completed, just swap the agent name in-place
  // - If animation is in-progress, abort and restart cleanly with the new agent
  useEffect(() => {
    activeAgentRef.current = selectedAgent;
    if (hasPlayedRef.current) {
      setTypedText(`Welcome. Confer with your ${selectedAgent}.`);
    } else if (isAnimatingRef.current) {
      abortAndRestartTyping();
    }
  }, [selectedAgent]);

  // Computed-size adjustments (UI-only)
  // - Typewriter H1: 50% of computed size (run once on mount)
  useEffect(() => {
    const root = sectionRef.current || (typeof document !== 'undefined' ? document.querySelector('.chat-hero') : null);
    if (!root) return;
    const typeEl = titleRef.current || root.querySelector('h1');
    if (typeEl) {
      const tfs = parseFloat(getComputedStyle(typeEl).fontSize || '0');
      if (!Number.isNaN(tfs) && tfs > 0) typeEl.style.fontSize = `${Math.round(tfs * 0.5)}px`;
    }
  }, []);

  // Removed font-size mutation on reveal to avoid layout shifts

  // Orchestrate chatbox mount ? fade, then chips ? H1 reveal
  useEffect(() => {
    if (!typingDone) return;
    setChatboxMounted(true);
    const t = setTimeout(() => setChatboxVisible(true), 120);
    return () => clearTimeout(t);
  }, [typingDone]);

  useEffect(() => {
    if (!chatboxVisible) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setChipsVisible([true, true, true, true]);
      setH1Visible(true);
      return;
    }

    // Plug-and-play chips: 50% slower up-fade
    const fadeDuration = 630;
    const base = fadeDuration + 80;
    const timers = [0, 1, 2, 3].map((i) =>
      setTimeout(
        () =>
          setChipsVisible((prev) => {
            const copy = [...prev];
            copy[i] = true;
            return copy;
          }),
        base + i * 210
      )
    );

    const totalChipsTime = base + 4 * 210 + 210;
    const h1Timer = setTimeout(() => setH1Visible(true), totalChipsTime + 120);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(h1Timer);
    };
  }, [chatboxVisible]);

  // H1 glitch + left?right reveal (run concurrently)
  useEffect(() => {
    if (!h1Visible) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setH1Class('show');
      return;
    }
    // Begin concurrent glitch + leftReveal animations (15% slower via CSS)
    setH1Class('h1-visible');
    return () => {};
  }, [h1Visible]);

  // Ensure chatbox appear animation only affects opacity/transform
  useEffect(() => {
    if (!chatboxMounted) return;
    const el = chatboxRootRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add('is-ready'));
  }, [chatboxMounted]);

  // Optional: one-time measure to tighten reserved space (runs after first paint)
  useEffect(() => {
    if (!chatboxMounted) return;
    const slot = document.querySelector('.public-chatbox-slot');
    const el = chatboxRootRef.current;
    if (!slot || !el) return;
    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      if (h > 0) slot.style.setProperty('--public-chatbox-min-h', `${Math.max(600, h)}px`);
    };
    setTimeout(update, 0);
  }, [chatboxMounted]);

  // D) Title-case utility for agent info line
  const toTitleCase = (s) => s
    .split(' ')
    .map(w => (w.length ? (w[0].toUpperCase() + w.slice(1).toLowerCase()) : w))
    .join(' ');

  // Derive typed segments: prefix ("Welcome. Confer with your "), agent name (colored), and suffix (e.g., '.')
  const prefixText = 'Welcome. Confer with your ';
  const typedPrefix = typedText.slice(0, Math.min(typedText.length, prefixText.length));
  const restText = typedText.length > prefixText.length ? typedText.slice(prefixText.length) : '';
  const dotIndex = restText.indexOf('.')
  const typedAgentName = dotIndex >= 0 ? restText.slice(0, dotIndex) : restText;
  const typedSuffix = dotIndex >= 0 ? restText.slice(dotIndex) : '';

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
          <div
            ref={subheadRef}
            className={`syntek-h1 mb-2 text-[#F2F2F2] text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold tracking-tight uppercase ${h1Class}`}
          >
            SYNTEK AUTOMATIONS
          </div>
          <h1
            ref={titleRef}
            className="mb-3 font-bold uppercase tracking-tight text-[#F2F2F2] text-[clamp(1.25rem,4.5vw,1.75rem)]"
          >
            {/* Centered typewriter */}
            <div className="w-full text-center">
              <span
                ref={helloPrefixRef}
                id="hero-typed"
                aria-live="polite"
                className="inline-block text-lg md:text-2xl font-semibold text-[#B3B3B3]"
              >
                {typedPrefix}
              </span>
              <span
                className="inline-block text-lg md:text-2xl font-semibold"
                style={{ color: currentAgentColor }}
              >
                {typedAgentName}
              </span>
              <span className="inline-block text-lg md:text-2xl font-semibold text-[#B3B3B3]">
                {typedSuffix}
              </span>
              <span
                className="ml-2 inline-block h-[1em] w-[2px] animate-blink align-middle"
                style={{
                  backgroundColor: currentAgentColor,
                  opacity: typingDone ? 0 : 1,
                }}
              />
            </div>
          </h1>
          {/* Removed the small purple agent label line in hero per spec */}
        </div>

        {/* Chatbox wrapper: mounts once after typewriter completes and stays mounted */}
        {chatboxMounted && (
          <section
            ref={chatboxRootRef}
            className="public-chatbox-appear"
            aria-label="Public chatbox"
          >
          <div className={`chatbox-wrapper`}>
            {/* Conversation Controls moved: history as attached pill near input */}
            {currentSessionId && (
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
                  className="select-agent flex items-center justify-between gap-3 rounded-full border border-[#202020] bg-[#0C0C0C] px-5 py-2 text-sm text-[#F2F2F2] shadow-sm ring-1 ring-transparent hover:bg-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC96C]/50"
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
                    <span>{selectedAgent}</span>
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
                        {selectedAgent === agent.name && <span className="text-[#FFC96C]">?</span>}
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
            <UpfadeOnOpen trigger={chatboxVisible ? 'chat-visible' : 'chat-hidden'}>
              <form onSubmit={handleSubmit} className="relative">
                <button
                  type="button"
                  className="history-pill"
                  aria-pressed={showHistory}
                  aria-label={showHistory ? 'Hide history' : 'Show history'}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="history-label">{showHistory ? 'Hide History' : 'History'}</span>
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
                      placeholder="Describe what you need help with?"
                      className="w-full resize-none rounded-full bg-transparent px-4 py-3 text-[#F2F2F2] focus:outline-none"
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
            </UpfadeOnOpen>

            {/* Dynamic Suggestions (plug-n-play chips) */}
            <SuggestionsRow inputValue={message} onPick={(text) => setMessage(text)} visibleFlags={chipsVisible} />
          </div>
          </section>
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

function SuggestionsRow({ inputValue, onPick, visibleFlags = [] }) {
  const items = getSuggestions(inputValue);
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((prompt, idx) => (
        <button
          key={prompt}
          onClick={() => onPick(prompt)}
          className={`plug-chip panel-system up-fade ${visibleFlags[idx] ? 'visible' : ''} p-3 text-left text-sm text-[#B3B3B3] transition-all hover:bg-[#202020] hover:text-[#F2F2F2]`}
        >
          <Sparkles className="mb-1 inline h-3 w-3" /> {prompt}
        </button>
      ))}
    </div>
  );
}

