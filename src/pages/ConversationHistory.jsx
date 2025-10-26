import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/LoadingState';
import { 
  Search, Star, Archive, Trash2, Share2, Download, 
  MessageSquare, Calendar, Zap, Filter, X 
} from 'lucide-react';

export default function ConversationHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgent, setFilterAgent] = useState(null);
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadConversations();
    loadStats();
  }, [filterAgent, filterBookmarked, showArchived]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        bookmarkedOnly: filterBookmarked,
        archived: showArchived
      });
      if (filterAgent) params.append('agentId', filterAgent);

      const response = await fetch(`/api/conversations?${params}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/conversations/stats', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadConversations();
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ q: searchQuery });
      if (filterAgent) params.append('agentId', filterAgent);
      if (filterBookmarked) params.append('bookmarkedOnly', 'true');

      const response = await fetch(`/api/conversations/search?${params}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (conversationId) => {
    try {
      await fetch(`/api/conversations/${conversationId}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      loadConversations();
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const archiveConversation = async (conversationId) => {
    try {
      await fetch(`/api/conversations/${conversationId}/archive`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      loadConversations();
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const shareConversation = async (conversationId) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/share`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresInDays: 7 })
      });
      const data = await response.json();
      const shareUrl = `${window.location.origin}/shared/${data.share_code}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to create share link:', error);
    }
  };

  const exportConversation = async (conversationId) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/export`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversationId}.json`;
      a.click();
    } catch (error) {
      console.error('Failed to export conversation:', error);
    }
  };

  if (loading && !conversations.length) {
    return <LoadingState message="Loading conversations..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conversation History</h1>
          <p className="mt-2 text-gray-600">
            View, search, and manage your chat conversations
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_conversations}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_messages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Points Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_pt_spent}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bookmarked</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.bookmarked_conversations}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilterBookmarked(!filterBookmarked)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                filterBookmarked
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="w-4 h-4" />
              Bookmarked Only
            </button>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                showArchived
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              {showArchived ? 'Hide' : 'Show'} Archived
            </button>

            {(filterBookmarked || showArchived || searchQuery) && (
              <button
                onClick={() => {
                  setFilterBookmarked(false);
                  setShowArchived(false);
                  setSearchQuery('');
                  loadConversations();
                }}
                className="px-4 py-2 rounded-md flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations found
              </h3>
              <p className="text-gray-600 mb-6">
                Start a conversation with an agent to see it here
              </p>
              <Link
                to="/agents"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Start Chatting
              </Link>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/agents?conversation=${conversation.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                      >
                        {conversation.title || 'Untitled Conversation'}
                      </Link>
                      {conversation.is_bookmarked && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {conversation.agent_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {conversation.message_count} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {conversation.total_pt_cost} Points
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(conversation.id)}
                      className="p-2 text-gray-400 hover:text-yellow-500 rounded-md hover:bg-gray-100"
                      title={conversation.is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                      <Star className={`w-5 h-5 ${conversation.is_bookmarked ? 'fill-current text-yellow-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => shareConversation(conversation.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-md hover:bg-gray-100"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => exportConversation(conversation.id)}
                      className="p-2 text-gray-400 hover:text-green-500 rounded-md hover:bg-gray-100"
                      title="Export"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => archiveConversation(conversation.id)}
                      className="p-2 text-gray-400 hover:text-orange-500 rounded-md hover:bg-gray-100"
                      title="Archive"
                    >
                      <Archive className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => deleteConversation(conversation.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

