// API client for agent communication
// Updated to connect to Railway backend with support for authenticated and anonymous users

// Use relative URL for Vercel deployment (proxies to Railway via vercel.json rewrites)
const API_BASE_URL = '';

// Generate or retrieve anonymous session ID
function getAnonymousSessionId() {
  const storageKey = 'dhstx_anonymous_session_id';
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

/**
 * Send a message to an AI agent
 * @param {string} message - The user's message
 * @param {string} agentId - Optional agent ID (defaults to orchestrator)
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @param {string} userId - Optional user ID for authenticated users
 * @returns {Promise<Object>} - The agent's response
 */
export async function sendMessage(message, agentId = null, sessionId = null, userId = null) {
  try {
    // Get or generate session ID for anonymous users
    const effectiveSessionId = sessionId || getAnonymousSessionId();
    
    const response = await fetch(`${API_BASE_URL}/api/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        agent: agentId || 'commander',
        sessionId: effectiveSessionId,
        userId: userId || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      
      // Handle specific error cases
      if (response.status === 429) {
        throw new Error(error.message || 'Question limit exceeded. Please create an account to continue.');
      }
      
      if (response.status === 403) {
        throw new Error(error.message || 'Session blocked. Please create an account.');
      }
      
      throw new Error(error.error || error.message || 'Failed to send message');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
}

/**
 * Get user's conversation sessions
 * @param {number} limit - Maximum number of sessions to retrieve
 * @returns {Promise<Array>} - Array of conversation sessions
 */
export async function getSessions(limit = 20) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/agents/sessions?limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // If sessions endpoint fails, return empty array (guest users)
      console.warn('Failed to fetch sessions, returning empty array');
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Get sessions error:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get a specific conversation session
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} - The session data with messages
 */
export async function getSession(sessionId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/agents/sessions/${sessionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Session not found' }));
      throw new Error(error.error || 'Failed to fetch session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
}

/**
 * Test the API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'test',
        agent: 'commander',
        sessionId: getAnonymousSessionId(),
      }),
    });
    return response.ok || response.status === 400; // 400 is ok (validation error, but API is working)
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

/**
 * Clear anonymous session (for testing or reset)
 */
export function clearAnonymousSession() {
  localStorage.removeItem('dhstx_anonymous_session_id');
}

