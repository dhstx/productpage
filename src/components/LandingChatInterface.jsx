'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
const DEFAULT_AGENT_ID = 'commander';
const ALLOWED_AGENT_IDS = ['commander', 'connector', 'conductor'];
const GREETING_PART = 'Welcome, Commander.';
const CONFER_PART = ' Confer with your ';
const slugifyAgentName = (value) => value.toLowerCase().replace(/\s+/g, '-');

export default function AIChatInterface({ initialAgent = DEFAULT_AGENT_ID, onAgentChange }) {
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
  const agents = useMemo(
    () =>
      agentData.map(agent => ({
        id: agent.id,
        name: agent.name,
        color: agent.color,
        icon: agent.icon,
        domain: agent.domain
      })),
    []
  );

  const agentsById = useMemo(() => {
    const map = new Map();
    agents.forEach(agent => {
      map.set(agent.id, agent);
    });
    return map;
  }, [agents]);

  const agentsByName = useMemo(() => {
    const map = new Map();
    agents.forEach(agent => {
      map.set(agent.name.toLowerCase(), agent);
    });
    return map;
  }, [agents]);

  const allowedIdSet = useMemo(() => new Set(ALLOWED_AGENT_IDS), []);
  const menuAgents = useMemo(
    () => agents.filter(agent => allowedIdSet.has(agent.id)),
    [agents, allowedIdSet]
  );

  const resolveAgentId = useCallback((value) => {
    if (!value) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    const normalized = raw.toLowerCase();
    if (agentsById.has(normalized)) return normalized;
    const byName = agentsByName.get(normalized);
    if (byName) return byName.id;
    const bySlug = agents.find(agent => slugifyAgentName(agent.name) === normalized);
    if (bySlug) return bySlug.id;
    return null;
  }, [agents, agentsById, agentsByName]);

  const safeResolveAllowedId = useCallback((value) => {
    const resolved = resolveAgentId(value);
    return resolved && allowedIdSet.has(resolved) ? resolved : null;
  }, [allowedIdSet, resolveAgentId]);

  // Derive initial selected agent synchronously: props > URL > localStorage > default
  const deriveInitialSelectedAgentId = () => {
    try {
      if (typeof window !== 'undefined') {
        const qp = new URLSearchParams(window.location.search);
        const agentParam = qp.get('agent');
        const fromQuery = safeResolveAllowedId(agentParam);
        if (fromQuery) return fromQuery;

        const storedId = safeResolveAllowedId(window.localStorage.getItem('selectedAgentId'));
        if (storedId) return storedId;

        const legacyStored = safeResolveAllowedId(window.localStorage.getItem('selectedAgent'));
        if (legacyStored) return legacyStored;
      }
    } catch {}

    const fromProp = safeResolveAllowedId(initialAgent);
    if (fromProp) return fromProp;
    return DEFAULT_AGENT_ID;
  };

  // ensure dropdown initial value matches the typewriter to avoid flicker
  const [selectedAgentId, setSelectedAgentId] = useState(deriveInitialSelectedAgentId);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  // removed rotating auxiliary label phrases per updated hero spec
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const selectedAgent = useMemo(
    () =>
      agentsById.get(selectedAgentId) ||
      menuAgents[0] ||
      agentsById.get(DEFAULT_AGENT_ID),
    [agentsById, selectedAgentId, menuAgents]
  );
  const selectedAgentName = selectedAgent?.name ?? agentsById.get(DEFAULT_AGENT_ID)?.name ?? 'Chief of Staff';
  const currentAgentColor = selectedAgent ? getAgentColor(selectedAgent.name, selectedAgent.color) : '#FFC96C';

  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const chatboxRootRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef(selectedAgentName);
  const hasPlayedRef = useRef(false);
  const hasEnteredViewportRef = useRef(false);
  const titleRef = useRef(null);
  const subheadRef = useRef(null);
  const helloPrefixRef = useRef(null);

  // Sync ref to initial state ASAP (before any animation begins)
  useEffect(() => {
    activeAgentRef.current = selectedAgentName;
    // Persist the initial value if none stored
    try {
      if (typeof window !== 'undefined') {
        const existingId = window.localStorage.getItem('selectedAgentId');
        if (!existingId) {
          window.localStorage.setItem('selectedAgentId', selectedAgentId);
        }
        window.localStorage.setItem('selectedAgent', selectedAgentName);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAgentSelect = (agentId) => {
    const resolvedId = safeResolveAllowedId(agentId) ?? DEFAULT_AGENT_ID;
    const nextAgent = agentsById.get(resolvedId) || agentsById.get(DEFAULT_AGENT_ID);
    const nextName = nextAgent?.name ?? selectedAgentName;

    setSelectedAgentId(resolvedId);
    setShowAgentMenu(false);
    activeAgentRef.current = nextName;
    try { onAgentChange?.(nextName); } catch {}
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('selectedAgentId', resolvedId);
        window.localStorage.setItem('selectedAgent', nextName);
      }
    } catch {}

    // Update URL query param
    try {
      setSearchParams({ agent: resolvedId }, { replace: true });
    } catch {
      // Fallback: ignore if router context not ready
    }

    // Abort and restart typewriter if mid-animation
    if (isAnimatingRef.current && !hasPlayedRef.current) {
      abortAndRestartTyping();
    }
  };
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
    activeAgentRef.current = selectedAgentName;
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
      setTypedText(`${GREETING_PART}${CONFER_PART}${activeAgentRef.current}.`);
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
      return;
    }

    // Three-phase typewriter: greeting, confer directive, then agent name
    isAnimatingRef.current = true;
    setTypedText('');

    const greetingPart = GREETING_PART;
    const conferPart = CONFER_PART;
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
      setTypedText(`${GREETING_PART}${CONFER_PART}${activeAgentRef.current}.`);
      hasPlayedRef.current = true;
      isAnimatingRef.current = false;
      setTypingDone(true);
    }, delay + typingSpeed);
    timeoutsRef.current.push(completionId);
  };

  useEffect(() => {
    const agentParam = searchParams.get('agent');
    const fromQuery = safeResolveAllowedId(agentParam);
    if (fromQuery) {
      setSelectedAgentId(fromQuery);
      const name = agentsById.get(fromQuery)?.name;
      if (name) {
        activeAgentRef.current = name;
      }
      return;
    }

    if (!allowedIdSet.has(selectedAgentId)) {
      const fallbackId = menuAgents[0]?.id || DEFAULT_AGENT_ID;
      setSelectedAgentId(fallbackId);
      const fallbackName = agentsById.get(fallbackId)?.name;
      if (fallbackName) {
        activeAgentRef.current = fallbackName;
      }
    }
  }, [agentsById, allowedIdSet, menuAgents, safeResolveAllowedId, searchParams, selectedAgentId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEnteredViewportRef.current = true;
          // Ensure the agent used by the typewriter matches current selection
          activeAgentRef.current = selectedAgentName;
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
  }, [selectedAgentName]);

  // Keep typewriter phrase reactive to selected agent
  // - If animation already completed, just swap the agent name in-place
  // - If animation is in-progress, abort and restart cleanly with the new agent
  useEffect(() => {
    const name = selectedAgentName;
    activeAgentRef.current = name;
    if (hasPlayedRef.current) {
      setTypedText(`${GREETING_PART}${CONFER_PART}${name}.`);
    } else if (isAnimatingRef.current) {
      abortAndRestartTyping();
    }
  }, [selectedAgentName]);

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

  // Derive typed segments: prefix ("Welcome, Commander. Confer with your "), agent name (colored), and suffix (e.g., '.')
  const prefixText = `${GREETING_PART}${CONFER_PART}`;
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
      const targetAgentId = selectedAgentId || DEFAULT_AGENT_ID;
      const response = await sendMessageAPI(
        userMessage,
        targetAgentId,
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
        agent: response.data?.agent || selectedAgentName,
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
            <span
              ref={helloPrefixRef}
              id="hero-typed"
              aria-live="polite"
              className="inline-flex flex-wrap items-baseline gap-1"
            >
              <span className="whitespace-pre text-[#B3B3B3]">{typedPrefix}</span>
              <span className="underline underline-offset-4" style={{ color: currentAgentColor, textDecorationColor: currentAgentColor }}>
                {typedAgentName}
              </span>
              <span className="whitespace-pre text-[#B3B3B3]">{typedSuffix}</span>
            </span>
            <span
              className="ml-2 inline-block h-[1em] w-[2px] animate-blink align-middle"
              style={{
                backgroundColor: currentAgentColor,
                opacity: typingDone ? 0 : 1,
              }}
            />
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
                    <span>{selectedAgentName}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-[#B3B3B3] transition-transform ${showAgentMenu ? 'rotate-180' : ''}`} />
                </button>

                {showAgentMenu && (
                  <div role="listbox" className="absolute left-1/2 z-10 mt-2 w-[min(20rem,90vw)] -translate-x-1/2 rounded-lg border border-[#202020] bg-[#0C0C0C] p-1 shadow-xl">
                    {menuAgents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => handleAgentSelect(agent.id)}
                        className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-[#202020]"
                        role="option"
                        aria-selected={selectedAgentId === agent.id}
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
                        {selectedAgentId === agent.id && <span className="text-[#FFC96C]">?</span>}
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

