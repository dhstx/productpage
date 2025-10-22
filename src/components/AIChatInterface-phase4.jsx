// Add to imports at the top
import ConversationHistory from './ConversationHistory';
import { getSession } from '../lib/api/agentClient';

// Add new state variables (after existing state)
const [showHistory, setShowHistory] = useState(false);

// Add function to load session
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

// Add function to start new conversation
const startNewConversation = () => {
  setMessages([]);
  setCurrentSessionId(null);
  setError(null);
};

// Add to JSX (before Agent Selector)
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
