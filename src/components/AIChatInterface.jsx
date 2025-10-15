import { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Sparkles } from 'lucide-react';

// Timing controls for the hero typewriter greeting
// Typing timing controls
// Reduce typing speed (increase delay) by 20% for slower effect
const TYPEWRITER_CHAR_MS = Math.round(35 * 1.2);      // ms per character
const TYPEWRITER_PAUSE_MS = 188;    // pause between "Hello." and agent part

export default function AIChatInterface() {
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Strategic Advisor');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const textareaRef = useRef(null);
  const sectionRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const activeAgentRef = useRef('Strategic Advisor');
  const hasPlayedRef = useRef(false);

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
        {/* AI Greeting */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 flex min-h-[4.75rem] items-center justify-center font-bold leading-tight text-[clamp(1.45rem,6.5vw,2.5rem)]">
            <span className="inline-flex flex-wrap justify-center gap-1 text-balance">
              <span className="whitespace-pre text-[#B3B3B3]">{displayPrefix}</span>
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
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: showContent ? 'auto' : 'none'
          }}
        >
          {/* Agent Selector */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex w-full max-w-xs flex-col items-center gap-2">
              <button
                onClick={() => setShowAgentMenu(!showAgentMenu)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#202020] bg-[#161616] px-5 py-2 text-sm font-medium text-[#F2F2F2] transition-colors hover:bg-[#1A1A1A]"
              >
                <Sparkles className="w-4 h-4 text-[#FFC96C]" />
                Select Agent
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
              <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
                {/* Attachment Button */}
                <button
                  type="button"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#202020] transition-colors hover:bg-[#2A2A2A]"
                  onClick={() => alert('File attachment coming soon')}
                >
                  <Paperclip className="w-5 h-5 text-[#B3B3B3]" />
                </button>

                {/* Text Input */}
                <div className="min-w-0 flex-1">
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
                </div>

                {/* Action Buttons */}
                <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
                  <button
                    type="button"
                    className="flex-1 rounded-full border border-transparent bg-[#202020] px-4 py-2 text-center text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-[#2A2A2A] sm:flex-none"
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full border border-transparent bg-[#202020] px-4 py-2 text-center text-sm font-medium text-[#B3B3B3] transition-colors hover:bg-[#2A2A2A] sm:flex-none"
                  >
                    AGI
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] transition-colors hover:bg-[#2A2A2A]"
                    onClick={() => alert('Voice input coming soon')}
                  >
                    <Mic className="w-5 h-5 text-[#B3B3B3]" />
                  </button>
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
                </div>
              </div>
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