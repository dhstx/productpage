// API client for agent communication
// Updated to work without authentication for guest users

// Use relative URL for Vercel deployment
const API_BASE_URL = '';

/**
 * Send a message to an AI agent
 * @param {string} message - The user's message
 * @param {string} agentId - Optional agent ID (defaults to orchestrator)
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise<Object>} - The agent's response
 */
export async function sendMessage(message, agentId = null, sessionId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        agentId,
        sessionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.error || 'Failed to send message');
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
        agentId: 'orchestrator',
      }),
    });
    return response.ok || response.status === 400; // 400 is ok (validation error, but API is working)
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

