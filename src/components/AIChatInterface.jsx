import { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Sparkles } from 'lucide-react';

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
    const typingSpeed = 95;
    const pauseDuration = 1500;
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
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
        {/* AI Greeting */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 flex justify-center items-center min-h-[4.5rem]">
            <span className="inline-block">
              <span className="text-[#B3B3B3] whitespace-pre">{displayPrefix}</span>
              <span
                className="relative inline-block whitespace-pre"
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
          <div className="flex justify-center mb-8">
            <div className="relative">
              <button
                onClick={() => setShowAgentMenu(!showAgentMenu)}
                className="px-6 py-2 bg-[#161616] border border-[#202020] rounded-full text-[#F2F2F2] text-sm font-medium hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFC96C]" />
                Select Agent
              </button>
              
              {showAgentMenu && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-[#161616] border border-[#202020] rounded-[4px] shadow-xl z-10">
                  {agents.map((agent) => (
                    <button
                      key={agent.name}
                      onClick={() => {
                        setSelectedAgent(agent.name);
                        setShowAgentMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#1A1A1A] transition-colors flex items-center gap-3 border-b border-[#202020] last:border-0"
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
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
          <p className="text-[#B3B3B3] text-xl md:text-2xl text-center mb-12">
            What would you like to do today?
          </p>
          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="panel-system p-6">
              <div className="flex items-start gap-4">
                {/* Attachment Button */}
                <button
                  type="button"
                  className="mt-2 w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center hover:bg-[#2A2A2A] transition-colors flex-shrink-0"
                  onClick={() => alert('File attachment coming soon')}
                >
                  <Paperclip className="w-5 h-5 text-[#B3B3B3]" />
                </button>

                {/* Text Input */}
                <div className="flex-grow">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you need help with..."
                    className="w-full bg-transparent text-[#F2F2F2] placeholder-[#666666] resize-none outline-none min-h-[24px] max-h-[200px]"
                    rows={1}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#202020] rounded-full text-[#B3B3B3] text-sm font-medium hover:bg-[#2A2A2A] transition-colors"
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#202020] rounded-full text-[#B3B3B3] text-sm font-medium hover:bg-[#2A2A2A] transition-colors"
                  >
                    AGI
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
                    onClick={() => alert('Voice input coming soon')}
                  >
                    <Mic className="w-5 h-5 text-[#B3B3B3]" />
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
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
                className="px-4 py-2 bg-[#161616] border border-[#202020] rounded-full text-[#B3B3B3] text-sm hover:bg-[#1A1A1A] hover:text-[#F2F2F2] hover:border-[#FFC96C] transition-colors"
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

