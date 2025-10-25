import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Trash2, ChevronRight } from 'lucide-react';
import { getSessions } from '../lib/api/agentClient';

export default function ConversationHistory({ onSelectSession, currentSessionId }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getSessions(20, 0);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="history-card p-4" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-[#B3B3B3]">
          <Clock className="h-5 w-5 animate-spin" />
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-card p-4" role="alert">
        <div className="text-sm text-red-300">
          Error loading conversations: {error}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="history-card p-6 text-center" aria-live="polite">
        <MessageSquare className="h-12 w-12 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.6)' }} />
        <p style={{ color: 'rgba(255,255,255,0.88)' }}>No conversation history yet</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Start a chat to begin</p>
      </div>
    );
  }

  return (
    <div className="history-card">
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-lg font-semibold text-[#F2F2F2]">Conversation History</h3>
        <p className="text-sm text-[#B3B3B3] mt-1">{sessions.length} conversations</p>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full p-4 text-left border-b border-[#333] transition-all duration-200 hover:bg-[#202020] ${
              currentSessionId === session.id ? 'bg-[#202020] border-l-4 border-l-[#FFC96C]' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-[#FFC96C] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#F2F2F2] truncate">
                    {session.title || 'Untitled Conversation'}
                  </span>
                </div>
                
                {session.last_message && (
                  <p className="text-sm text-[#B3B3B3] truncate mb-2">
                    {session.last_message}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(session.updated_at)}
                  </span>
                  {session.message_count && (
                    <span>{session.message_count} messages</span>
                  )}
                  {session.agent && (
                    <span className="text-[#FFC96C]">{session.agent}</span>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-[#666] flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
