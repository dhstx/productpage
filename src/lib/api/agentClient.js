/**
 * Agent API Client
 * Handles all communication with the backend agent system
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Send a message to an agent
 * @param {string} message - The user's message
 * @param {string} agentId - The ID of the agent to send to (optional, Orchestrator will route)
 * @param {string} sessionId - The conversation session ID (optional, will create new if not provided)
 * @returns {Promise<Object>} - The agent's response
 */
export async function sendMessage(message, agentId = null, sessionId = null) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/api/agents/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      agentId,
      sessionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's conversation sessions
 * @param {number} limit - Maximum number of sessions to retrieve
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} - Array of conversation sessions
 */
export async function getSessions(limit = 20, offset = 0) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/agents/sessions?limit=${limit}&offset=${offset}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a specific conversation session
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} - The session data with messages
 */
export async function getSession(sessionId) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/agents/sessions/${sessionId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Test the API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}
