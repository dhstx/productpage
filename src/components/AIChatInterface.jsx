import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import ChatTools from './chat/ChatTools';

// Timing controls for the hero typewriter greeting
// Typing timing controls
// Reduce typing speed (increase delay) by ~25% for slower effect
const TYPEWRITER_CHAR_MS = Math.round(35 * 1.25);      // ms per character
const TYPEWRITER_PAUSE_MS = 188;    // pause between "Hello." and agent part

export default function AIChatInterface() {
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('chat');
  const [selectedAgent, setSelectedAgent] = useState('Strategic Advisor');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef('Strategic Advisor');
  const hasPlayedRef = useRef(false);
  const titleRef = useRef(null);
  const notifiedRef = useRef(false);
  const helloPrefixRef = useRef(null);

  const agents = [
    { name: 'Strategic Advisor', color: '#FFC96C' },
    { name: 'Engagement Analyst', color: '#8B5CF6' },
    { name: 'Operations Assistant', color: '#10B981' }
  ];

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

    isAnimatingRef.current = true;
    setShowContent(false);
    setTypedText('');

    const greetingPart = 'Hello.';
    const agentPart = ` I am your ${activeAgentRef.current}`;
    const typingSpeed = TYPEWRITER_CHAR_MS;
    const pauseDuration = TYPEWRITER_PAUSE_MS;
    let delay = 0;
    let currentOutput = '';

    greetingPart.split('').forEach((character) => {
      delay += typingSpeed;
      const timeoutId = setTimeout(() => {
        currentOutput += character;
        setTypedText(currentOutput);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    });

    delay += pauseDuration;

    agentPart.split('').forEach((character) => {
      delay += typingSpeed;
      const timeoutId = setTimeout(() => {
        currentOutput += character;
        setTypedText(currentOutput);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    });

    const completionTimeout = setTimeout(() => {
      setTypedText(`Hello. I am your ${activeAgentRef.current}`);
      hasPlayedRef.current = true;
      setShowContent(true);
      isAnimatingRef.current = false;
      // Fallback timer in case transitionend isn't supported
      const fallbackNotify = setTimeout(() => {
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          window.dispatchEvent(new CustomEvent('chatbox-animation-complete', { detail: { source: 'AIChatInterface', via: 'fallbackTimer' } }));
        }
      }, 1200);
      timeoutsRef.current.push(fallbackNotify);
    }, delay + typingSpeed);

    timeoutsRef.current.push(completionTimeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert(`Message sent to ${selectedAgent}: ${message}`);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  useEffect(() => {
    activeAgentRef.current = selectedAgent;
    if (hasPlayedRef.current) {
      setTypedText(`Hello. I am your ${selectedAgent}`);
      setShowContent(true);
    }
  }, [selectedAgent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTypingAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionElement = sectionRef.current;
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      observer.disconnect();
      clearAnimationTimers();
    };
  }, []);

  // One-time entrance animation for the SYNTEK AUTOMATIONS title
  useEffect(() => {
    function playSyntekTitleAnimation() {
      if (typeof window !== 'undefined' && window.__syntekTitlePlayed) return;
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const titleEl = titleRef.current;
      if (!titleEl) return;

      // Set final title color to white (overrides previous gray)
      const targetColor = '#FFFFFF';
      titleEl.style.setProperty('--hello-gray', targetColor);

      if (reduceMotion) {
        // Respect reduced motion: set final state instantly
        titleEl.style.color = targetColor;
        titleEl.style.clipPath = 'inset(0 0 0 0)';
        window.__syntekTitlePlayed = true;
        return;
      }

      // Ensure initial state before starting animation (tokenized with dark fallback)
      titleEl.style.color = 'var(--text, var(--foreground))';
      titleEl.style.clipPath = 'inset(0 100% 0 0)';
      titleEl.style.filter = 'none';

      const animation = titleEl.animate(
        [
          // Neon pre-flicker
          {
            color: 'var(--text, var(--foreground))',
            clipPath: 'inset(0 100% 0 0)',
            textShadow: '0 0 0 rgba(255,201,108,0)',
            filter: 'brightness(0.6)'
          },
          {
            color: 'var(--text, var(--foreground))',
            clipPath: 'inset(0 90% 0 0)',
            textShadow: '0 0 10px rgba(255,201,108,0.6), 0 0 20px rgba(255,201,108,0.35)',
            filter: 'brightness(1.25)',
            offset: 0.12
          },
          {
            color: 'var(--text, var(--foreground))',
            clipPath: 'inset(0 80% 0 0)',
            textShadow: '0 0 4px rgba(255,201,108,0.25)',
            filter: 'brightness(0.9)',
            offset: 0.22
          },
          // Left-to-right reveal with color tween
          {
            color: 'var(--hello-gray)',
            clipPath: 'inset(0 0 0 0)',
            textShadow: '2px 0 10px rgba(0,0,0,0.35)',
            filter: 'none',
            offset: 0.85
          },
          // Final short flicker
          {
            color: 'var(--hello-gray)',
            clipPath: 'inset(0 0 0 0)',
            textShadow: '0 0 12px rgba(255,201,108,0.4)',
            filter: 'brightness(1.05)',
            offset: 0.93
          },
          // Added extra quick flicker to increase count by ~50%
          {
            color: 'var(--hello-gray)',
            clipPath: 'inset(0 0 0 0)',
            textShadow: '0 0 0 rgba(0,0,0,0)',
            filter: 'none',
            offset: 0.965
          },
          {
            color: 'var(--hello-gray)',
            clipPath: 'inset(0 0 0 0)',
            textShadow: '0 0 12px rgba(255,201,108,0.4)',
            filter: 'brightness(1.05)',
            offset: 0.985
          },
          {
            color: 'var(--hello-gray)',
            clipPath: 'inset(0 0 0 0)',
            textShadow: '0 0 0 rgba(0,0,0,0)',
            filter: 'none',
            offset: 1
          }
        ],
        {
          duration: 5950,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        }
      );

      animation.finished.finally(() => {
        window.__syntekTitlePlayed = true;
      });
    }

    function onChatboxComplete() {
      playSyntekTitleAnimation();
    }

    window.addEventListener('chatbox-animation-complete', onChatboxComplete);
    return () => {
      window.removeEventListener('chatbox-animation-complete', onChatboxComplete);
    };
  }, []);

  // If animation already played earlier in the session (route transition), set final state
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;
    if (typeof window !== 'undefined' && window.__syntekTitlePlayed) {
      const targetColor = '#FFFFFF';
      titleEl.style.setProperty('--hello-gray', targetColor);
      titleEl.style.color = targetColor;
      titleEl.style.clipPath = 'inset(0 0 0 0)';
      titleEl.style.textShadow = 'none';
      titleEl.style.filter = 'none';
    }
  }, []);

  const prefixText = 'Hello. I am your ';
  const typedPrefix = typedText.slice(0, Math.min(typedText.length, prefixText.length));
  const typedAgentText = typedText.length > prefixText.length ? typedText.slice(prefixText.length) : '';
  const displayPrefix = typedPrefix;
  const displayAgent = typedAgentText;

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-screen overflow-x-hidden min-w-0 px-4 py-16 pb-safe sm:px-6"
      style={{ marginTop: '2in', marginBottom: '2in' }}
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Title that animates after Chatbox appears */}
      <h1
          id="syntek-title"
          ref={titleRef}
          className="text-center font-bold leading-tight uppercase tracking-tight overflow-wrap-anywhere mx-auto mt-12 mb-12"
        style={{ fontSize: 'clamp(1.85rem, 3.5vw + 1rem, 3.25rem)', color: 'var(--text, var(--foreground))', clipPath: 'inset(0 100% 0 0)' }}
        >
          SYNTEK AUTOMATIONS
        </h1>
        {/* AI Greeting */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 flex min-h-[4.75rem] items-center justify-center font-bold leading-tight text-[clamp(1.45rem,6.5vw,2.5rem)]">
            <span className="inline-flex flex-wrap justify-center gap-1 text-balance">
              <span className="whitespace-pre text-[#B3B3B3]" ref={helloPrefixRef}>{displayPrefix}</span>
              <span
                className="relative inline-block max-w-full whitespace-pre break-words"
                style={{ color: currentAgentColor }}
              >
                {displayAgent}
                <span
                  className="absolute bottom-0 left-0 w-full h-1 opacity-30"
                  style={{ backgroundColor: currentAgentColor, opacity: displayAgent ? 0.3 : 0 }}
                ></span>
              </span>
            </span>
          </h2>
        </div>

        <div
          ref={contentRef}
          className={`reveal-up ${showContent ? 'reveal-show' : ''}`}
          onTransitionEnd={(e) => {
            if (!showContent) return;
            if (notifiedRef.current) return;
            if (e.propertyName !== 'opacity' && e.propertyName !== 'transform') return;
            notifiedRef.current = true;
            window.dispatchEvent(new CustomEvent('chatbox-animation-complete', { detail: { source: 'AIChatInterface', via: 'transitionEnd' } }));
          }}
          style={{ pointerEvents: showContent ? 'auto' : 'none' }}
        >
          {/* Agent Selector */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex w-full max-w-xs flex-col items-center gap-2">
              <button
                onClick={() => setShowAgentMenu(!showAgentMenu)}
                className="agent-select__trigger flex w-full items-center justify-center gap-2 rounded-full border border-[#202020] bg-[#161616] px-5 py-2 text-sm font-medium text-[#F2F2F2] transition-colors hover:bg-[#1A1A1A]"
                aria-haspopup="listbox"
                aria-expanded={showAgentMenu}
              >
                <Sparkles className="agent-select__icon w-4 h-4 text-[#FFC96C]" />
                <span className="agent-select__placeholder">Select Agent</span>
              </button>

              {showAgentMenu && (
                <div className="z-10 mt-2 w-full rounded-[4px] border border-[#202020] bg-[#161616] shadow-xl md:absolute md:left-1/2 md:top-full md:w-64 md:-translate-x-1/2">
                  {agents.map((agent) => (
                    <button
                      key={agent.name}
                      onClick={() => {
                        setSelectedAgent(agent.name);
                        setShowAgentMenu(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-[#202020] px-4 py-3 text-left transition-colors hover:bg-[#1A1A1A] last:border-0"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: agent.color }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: selectedAgent === agent.name ? agent.color : '#F2F2F2' }}
                      >
                        {agent.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subtitle */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-[clamp(1rem,4vw,1.5rem)] text-[#B3B3B3] text-pretty">
            What would you like to do today?
          </p>
          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="panel-system flex flex-col gap-4 p-4 sm:p-6">
              <ChatTools
                onAttach={() => alert('File attachment coming soon')}
                onToggleMode={(mode) => setActiveMode(mode)}
                activeMode={activeMode}
                onMicStart={() => alert('Voice input coming soon')}
                disabled={false}
                features={{ mic: true, upload: true, modes: ['chat', 'agi'] }}
                rightAppend={(
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      message.trim()
                        ? 'bg-[#FFC96C] hover:bg-[#FFD700]'
                        : 'bg-[#202020] cursor-not-allowed'
                    }`}
                  >
                    <ArrowUp className={`w-5 h-5 ${message.trim() ? 'text-[#0C0C0C]' : 'text-[#666666]'}`} />
                  </button>
                )}
              >
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => sectionRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
                  placeholder="Describe what you need help with..."
                  aria-label="Message input"
                  enterKeyHint="send"
                  inputMode="text"
                  autoCorrect="on"
                  autoComplete="on"
                  spellCheck={true}
                  className="max-h-[40vh] min-h-[24px] w-full resize-none bg-transparent text-sm text-[#F2F2F2] placeholder-[#666666] outline-none sm:text-base"
                  rows={1}
                />
              </ChatTools>
            </div>
          </form>

          {/* Suggested Prompts */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              'Analyze board engagement trends',
              'Draft meeting agenda',
              'Prioritize initiatives',
              'Generate progress report'
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setMessage(prompt)}
                className="w-full rounded-full border border-[#202020] bg-[#161616] px-4 py-2 text-sm text-[#B3B3B3] transition-colors hover:border-[#FFC96C] hover:bg-[#1A1A1A] hover:text-[#F2F2F2] sm:w-auto"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}