// Use relative URL for Vercel deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

export async function sendMessage(message, agentId = null, sessionId = null) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/agents/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      message,
      agentId,
      sessionId
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function getSessions(limit = 20, offset = 0) {
  const token = getAuthToken();
  
  const response = await fetch(
    `${API_BASE_URL}/api/agents/sessions?limit=${limit}&offset=${offset}`,
    {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function getSession(sessionId) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/agents/sessions/${sessionId}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}
