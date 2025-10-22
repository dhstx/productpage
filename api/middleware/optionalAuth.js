// Optional authentication middleware
// Allows both authenticated and guest users

export function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // If token exists, try to validate it
      // For now, we'll just set a guest user
      // In production, you'd validate the JWT token here
      req.user = {
        id: 'guest-' + Date.now(),
        username: 'guest',
        role: 'guest'
      };
    } else {
      // No token, set as guest user
      req.user = {
        id: 'guest-' + Date.now(),
        username: 'guest',
        role: 'guest'
      };
    }
    
    next();
  } catch (error) {
    // On error, still allow as guest
    req.user = {
      id: 'guest-' + Date.now(),
      username: 'guest',
      role: 'guest'
    };
    next();
  }
}

