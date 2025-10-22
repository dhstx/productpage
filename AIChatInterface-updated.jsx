import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Sparkles, ChevronDown } from 'lucide-react';
import ChatTools from './chat/ChatTools';
import { agents as agentData } from '../lib/agents-enhanced';

// Timing controls for the hero typewriter greeting
const TYPEWRITER_CHAR_MS = 61;
const TYPEWRITER_PAUSE_MS = 1000;

export default function AIChatInterface() {
  const [typingDone, setTypingDone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  const [selectedAgent, setSelectedAgent] = useState('Orchestrator');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
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
    // Check if agent is specified in URL
    const agentParam = searchParams.get('agent');
    if (agentParam) {
      const matchedAgent = agents.find(
        a => slugifyAgent(a.name) === agentParam
      );
      if (matchedAgent) {
        setSelectedAgent(matchedAgent.name);
        activeAgentRef.current = matchedAgent.name;
      }
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Sending message to agent:', selectedAgent);
    console.log('Message:', message);

    // TODO: Connect to backend API
    // This will be implemented in Phase 3

    setMessage('');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-screen overflow-x-hidden px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        {/* Hero Greeting */}
        <div className="mb-8 text-center">
          <h1
            ref={titleRef}
            className="h1 mb-4 font-bold uppercase tracking-tight text-[#F2F2F2]"
          >
            <span ref={helloPrefixRef} id="hero-typed">
              {typedText}
            </span>
            <span
              className="ml-2 inline-block h-[1em] w-[2px] animate-blink"
              style={{
                backgroundColor: currentAgentColor,
                opacity: typingDone ? 0 : 1,
              }}
            />
          </h1>
          <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
            Select an AI agent and start your conversation
          </p>
        </div>

        {/* Agent Selector */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowAgentMenu(!showAgentMenu)}
              className="panel-system flex w-full items-center justify-between p-4 transition-all duration-300 hover:bg-[#202020]"
              style={{ borderColor: `${currentAgentColor}40` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${currentAgentColor}20` }}
                >
                  <span style={{ color: currentAgentColor }}>
                    {currentAgent?.icon || '🤖'}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#F2F2F2]">
                    {selectedAgent}
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    {agents.find(a => a.name === selectedAgent)?.domain || 'AI Agent'}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-[#B3B3B3] transition-transform ${
                  showAgentMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Agent Menu */}
            {showAgentMenu && (
              <div className="absolute z-10 mt-2 w-full panel-system max-h-96 overflow-y-auto">
                {agents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => handleAgentSelect(agent.name)}
                    className="flex w-full items-center gap-3 p-3 transition-colors hover:bg-[#202020]"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      <span style={{ color: agent.color }}>
                        {agent.icon || '🤖'}
                      </span>
                    </div>
                    <div className="text-left flex-grow">
                      <div className="text-sm font-semibold text-[#F2F2F2]">
                        {agent.name}
                      </div>
                    </div>
                    {selectedAgent === agent.name && (
                      <span className="text-[#FFC96C]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="panel-system overflow-hidden">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Ask ${selectedAgent} anything...`}
              className="w-full resize-none bg-transparent px-4 py-4 text-[#F2F2F2] placeholder-[#666] focus:outline-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-between border-t border-[#333] px-4 py-3">
              <div className="text-xs text-[#666]">
                Press Enter to send, Shift+Enter for new line
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: message.trim() ? currentAgentColor : '#333',
                }}
              >
                <ArrowUp className="h-4 w-4 text-[#1A1A1A]" />
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Prompts */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            'Help me develop a strategic plan',
            'Create a project timeline',
            'Research market trends',
            'Write code for my project',
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

        {/* Chat Tools */}
        <div className="mt-8">
          <ChatTools activeMode={activeMode} setActiveMode={setActiveMode} />
        </div>
      </div>
    </section>
  );
}

