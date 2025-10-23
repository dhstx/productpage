// Vercel Serverless Function - Proxy to Railway Backend
// This function forwards all chat requests to the Railway backend API

const RAILWAY_API_URL = process.env.RAILWAY_API_URL || 'https://productpage-production.up.railway.app';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message, agentId, sessionId } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Forward request to Railway backend
    const railwayResponse = await fetch(`${RAILWAY_API_URL}/api/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
      body: JSON.stringify({
        message: message.trim(),
        agentId: agentId || 'orchestrator',
        sessionId: sessionId || null,
      }),
    });

    // Check if Railway backend responded successfully
    if (!railwayResponse.ok) {
      const errorData = await railwayResponse.json().catch(() => ({
        error: `Railway backend error: ${railwayResponse.status} ${railwayResponse.statusText}`
      }));
      
      console.error('Railway backend error:', errorData);
      
      return res.status(railwayResponse.status).json({
        success: false,
        error: errorData.error || 'Backend service error',
        message: errorData.message || 'Failed to process request'
      });
    }

    // Forward the successful response from Railway
    const data = await railwayResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Proxy service error',
      message: error.message
    });
  }
}

