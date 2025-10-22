import { useState, useMemo } from 'react';
import { Search, Lock, Star, TrendingUp, X } from 'lucide-react';
import { agents as agentData } from '../lib/agents-enhanced';
import { getAvailableAgents } from '../lib/agentAccessControl';

export default function EnhancedAgentSelector({ 
  selectedAgent, 
  onSelect, 
  userTier = 'freemium',
  onClose 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favoriteAgents');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Get available agents based on user tier
  const availableAgents = useMemo(() => {
    return getAvailableAgents(userTier);
  }, [userTier]);

  // Filter and sort agents
  const filteredAgents = useMemo(() => {
    let filtered = agentData;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.description?.toLowerCase().includes(query) ||
        agent.category?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (showOnlyAvailable) {
      filtered = filtered.filter(agent => 
        availableAgents.includes(agent.name)
      );
    }

    // Sort: favorites first, then by name
    filtered.sort((a, b) => {
      const aFav = favorites.includes(a.name);
      const bFav = favorites.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [agentData, searchQuery, showOnlyAvailable, favorites, availableAgents]);

  const toggleFavorite = (agentName) => {
    const newFavorites = favorites.includes(agentName)
      ? favorites.filter(name => name !== agentName)
      : [...favorites, agentName];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteAgents', JSON.stringify(newFavorites));
  };

  const handleSelect = (agent) => {
    if (availableAgents.includes(agent.name)) {
      onSelect(agent.name);
      onClose?.();
    }
  };

  const isLocked = (agentName) => !availableAgents.includes(agentName);

  const getTierBadge = (tier) => {
    const badges = {
      freemium: { label: 'Free', color: 'bg-gray-100 text-gray-700' },
      entry: { label: 'Entry', color: 'bg-blue-100 text-blue-700' },
      pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700' },
      proplus: { label: 'Pro+', color: 'bg-indigo-100 text-indigo-700' },
      business: { label: 'Business', color: 'bg-orange-100 text-orange-700' },
    };
    return badges[tier] || badges.freemium;
  };

  const currentTierBadge = getTierBadge(userTier);

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select AI Agent</h2>
            <p className="text-sm text-gray-600 mt-1">
              Your tier: <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${currentTierBadge.color}`}>
                {currentTierBadge.label}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Show only available agents
            </label>

            <div className="text-sm text-gray-600">
              {filteredAgents.length} of {agentData.length} agents
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.map((agent) => {
              const locked = isLocked(agent.name);
              const isFavorite = favorites.includes(agent.name);
              const isSelected = selectedAgent === agent.name;

              return (
                <div
                  key={agent.name}
                  onClick={() => handleSelect(agent)}
                  className={`relative p-4 border rounded-lg transition-all cursor-pointer ${
                    locked
                      ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {/* Favorite Star */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(agent.name);
                    }}
                    className={`absolute top-3 right-3 p-1 rounded hover:bg-gray-200 transition-colors ${
                      locked ? 'hidden' : ''
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Lock Icon */}
                  {locked && (
                    <div className="absolute top-3 right-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Agent Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    <span className="text-2xl">{agent.icon}</span>
                  </div>

                  {/* Agent Info */}
                  <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {agent.description || 'AI assistant for your tasks'}
                  </p>

                  {/* Category & Tier */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {agent.category && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {agent.category}
                      </span>
                    )}
                    {agent.requiredTier && (
                      <span className={`text-xs px-2 py-0.5 rounded ${getTierBadge(agent.requiredTier).color}`}>
                        {getTierBadge(agent.requiredTier).label}+
                      </span>
                    )}
                  </div>

                  {/* Locked Message */}
                  {locked && (
                    <div className="mt-3 text-xs text-gray-500">
                      Upgrade to unlock this agent
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-semibold">{availableAgents.length}</span> agents available in your tier
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

