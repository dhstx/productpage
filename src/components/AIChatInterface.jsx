import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, ArrowUp, Sparkles } from 'lucide-react';

export default function AIChatInterface() {
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Strategic Advisor');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const textareaRef = useRef(null);

  const agents = [
    { name: 'Strategic Advisor', color: '#FFC96C' },
    { name: 'Engagement Analyst', color: '#8B5CF6' },
    { name: 'Operations Assistant', color: '#10B981' }
  ];

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

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
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
                    <span className={`text-sm ${selectedAgent === agent.name ? 'text-[#FFC96C]' : 'text-[#F2F2F2]'}`}>
                      {agent.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Greeting */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-[#B3B3B3]">Hey, I am </span>
            <span className="text-[#FFC96C] relative inline-block">
              {selectedAgent}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFC96C] opacity-30"></span>
            </span>
          </h2>
          <p className="text-[#B3B3B3] text-xl md:text-2xl">
            What would you like to do today?
          </p>
        </div>

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
    </section>
  );
}
