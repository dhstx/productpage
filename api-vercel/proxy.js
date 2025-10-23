// Generic Vercel Serverless Function - Proxy all API requests to Railway Backend
// This function forwards all API requests to the Railway backend

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

  try {
    // Extract the API path from the request
    const apiPath = req.url.replace(/^\/api-vercel\/proxy/, '');
    const targetUrl = `${RAILWAY_API_URL}${apiPath}`;

    console.log(`Proxying ${req.method} ${req.url} -> ${targetUrl}`);

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      // Forward authorization header if present
      ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      // Forward other relevant headers
      ...(req.headers['x-user-id'] && { 'X-User-Id': req.headers['x-user-id'] }),
    };

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Forward request to Railway backend
    const railwayResponse = await fetch(targetUrl, fetchOptions);

    // Get response data
    const contentType = railwayResponse.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await railwayResponse.json();
    } else {
      data = await railwayResponse.text();
    }

    // Forward the response from Railway
    return res.status(railwayResponse.status).json(
      typeof data === 'string' ? { data } : data
    );

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Proxy service error',
      message: error.message
    });
  }
}

