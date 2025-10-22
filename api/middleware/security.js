import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Input validation middleware
 */
export function validateInput(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    req.body = value;
    next();
  };
}

/**
 * Authorization middleware - check if user has permission
 */
export async function authorize(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Get user profile with role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, tier')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        return res.status(403).json({ error: 'Forbidden - No profile found' });
      }

      // Check role if required
      if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Forbidden - Insufficient permissions',
          required: requiredRole,
          current: profile.role
        });
      }

      // Attach user and profile to request
      req.user = user;
      req.profile = profile;
      next();

    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Authorization failed' });
    }
  };
}

/**
 * Rate limiting by user ID
 */
export const rateLimitByUser = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiting by IP
 */
export const rateLimitByIP = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window per IP
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiting for sensitive endpoints
 */
export const rateLimitStrict = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many attempts. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://api.stripe.com"],
        frameSrc: ["'self'", "https://js.stripe.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  });
}

/**
 * CORS configuration
 */
export function corsConfig() {
  const allowedOrigins = [
    'https://dhstx.co',
    'https://www.dhstx.co',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400 // 24 hours
  };
}

/**
 * CSRF protection middleware
 */
export function csrfProtection() {
  return (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Check CSRF token
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({
        error: 'CSRF token validation failed',
        message: 'Invalid or missing CSRF token'
      });
    }

    next();
  };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize request body
 */
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
}

/**
 * Abuse detection middleware
 */
export async function detectAbuse(req, res, next) {
  try {
    const userId = req.user?.id;
    const ip = req.ip;

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(<script|javascript:|onerror=)/i, // XSS attempts
      /(union|select|insert|update|delete|drop)/i, // SQL injection
      /(\.\.\/|\.\.\\)/g, // Path traversal
    ];

    const requestData = JSON.stringify(req.body) + JSON.stringify(req.query);
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));

    if (isSuspicious) {
      // Log abuse attempt
      await supabase.from('abuse_log').insert({
        user_id: userId,
        ip_address: ip,
        request_path: req.path,
        request_method: req.method,
        request_data: requestData,
        abuse_type: 'suspicious_pattern',
        severity: 'high'
      });

      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request contains suspicious patterns'
      });
    }

    // Check rate of requests from this IP
    const { count } = await supabase
      .from('abuse_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (count > 100) {
      // IP is making too many suspicious requests
      await supabase.from('abuse_log').insert({
        user_id: userId,
        ip_address: ip,
        abuse_type: 'rate_abuse',
        severity: 'critical'
      });

      return res.status(429).json({
        error: 'Too many requests',
        message: 'Your IP has been flagged for suspicious activity'
      });
    }

    next();
  } catch (error) {
    console.error('Abuse detection error:', error);
    next(); // Don't block on error
  }
}

/**
 * Create abuse log table migration
 */
export const abuseLogMigration = `
CREATE TABLE IF NOT EXISTS abuse_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT NOT NULL,
  request_path TEXT,
  request_method TEXT,
  request_data JSONB,
  abuse_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_abuse_log_ip (ip_address),
  INDEX idx_abuse_log_user (user_id),
  INDEX idx_abuse_log_created (created_at),
  INDEX idx_abuse_log_severity (severity)
);

-- RLS
ALTER TABLE abuse_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view abuse logs
CREATE POLICY "Admins can view abuse logs"
  ON abuse_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
`;

export default {
  validateInput,
  authorize,
  rateLimitByUser,
  rateLimitByIP,
  rateLimitStrict,
  securityHeaders,
  corsConfig,
  csrfProtection,
  sanitizeInput,
  sanitizeBody,
  detectAbuse,
  abuseLogMigration
};

