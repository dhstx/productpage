import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }]);
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or email support@inboxpass.org.',
        timestamp: new Date(),
      }]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: "👋 Hi! I'm your InboxPass Assistant. I can help you fix email deliverability issues and ensure compliance with Gmail and Microsoft's 2025 requirements.\n\n**Quick answers:**\n💰 $29 one-time (no subscription)\n🆓 Free domain scan available\n⏱️ 5-minute setup\n✅ 30-day money-back guarantee\n\nHow can I help you today?",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');

    sendMessageMutation.mutate({
      message: messageContent,
      conversationId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStarterClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => {
      if (!sendMessageMutation.isPending) {
        handleSendMessage();
      }
    }, 100);
  };

  const starterSuggestions = [
    { title: "How does it work?", prompt: "How does InboxPass work and what do I get for $29?" },
    { title: "Why spam folder?", prompt: "Why are my emails going to spam?" },
    { title: "Is it technical?", prompt: "Do I need technical knowledge to set this up?" },
    { title: "Gmail requirements", prompt: "What are Gmail's 2025 email requirements?" },
  ];

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-14 h-14 rounded-full",
              "bg-gradient-to-br from-blue-500 to-blue-600",
              "hover:from-blue-600 hover:to-blue-700",
              "shadow-lg hover:shadow-xl",
              "flex items-center justify-center",
              "transition-all duration-300",
              "group"
            )}
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]",
              "bg-white dark:bg-gray-900",
              "rounded-2xl shadow-2xl",
              "border border-gray-200 dark:border-gray-800",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">InboxPass Assistant</h3>
                  <p className="text-blue-100 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-inherit">
                      {message.role === 'assistant' ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Starter Suggestions (only show if no user messages yet) */}
              {messages.length === 1 && messages[0].role === 'assistant' && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-1">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {starterSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStarterClick(suggestion.prompt)}
                        disabled={sendMessageMutation.isPending}
                        className={cn(
                          "text-xs px-3 py-2 rounded-lg",
                          "bg-white dark:bg-gray-800",
                          "border border-gray-200 dark:border-gray-700",
                          "hover:border-blue-500 dark:hover:border-blue-500",
                          "transition-all duration-200",
                          "text-left text-gray-700 dark:text-gray-300",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {suggestion.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sendMessageMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={sendMessageMutation.isPending}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl",
                    "bg-gray-100 dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "text-sm text-gray-900 dark:text-gray-100",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sendMessageMutation.isPending}
                  className={cn(
                    "px-4 py-2.5 rounded-xl",
                    "bg-blue-500 hover:bg-blue-600",
                    "text-white",
                    "transition-colors duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center"
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

