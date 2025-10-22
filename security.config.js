/**
 * Security Configuration for dhstx.co
 * 
 * This file centralizes all security settings for the application.
 * Update these settings based on your security requirements.
 */

export const securityConfig = {
  // Rate limiting
  rateLimit: {
    // Standard rate limit for authenticated users
    user: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // 100 requests per window
    },
    
    // Rate limit by IP for unauthenticated requests
    ip: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200 // 200 requests per window
    },
    
    // Strict rate limit for sensitive endpoints
    strict: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10 // 10 requests per hour
    },
    
    // Chat endpoint specific limits
    chat: {
      windowMs: 60 * 1000, // 1 minute
      max: 10 // 10 messages per minute
    }
  },

  // CORS settings
  cors: {
    allowedOrigins: [
      'https://dhstx.co',
      'https://www.dhstx.co',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Stripe
        "'unsafe-eval'", // Required for some React features
        "https://js.stripe.com",
        "https://www.googletagmanager.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.supabase.co",
        "https://api.stripe.com",
        "https://www.google-analytics.com"
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },

  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    name: 'dhstx.sid',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    resave: false,
    saveUninitialized: false
  },

  // Input validation
  validation: {
    maxLength: {
      message: 10000, // Max chat message length
      email: 255,
      name: 100,
      description: 1000
    },
    patterns: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[1-9]\d{1,14}$/,
      url: /^https?:\/\/.+/
    }
  },

  // Abuse detection
  abuse: {
    // Suspicious patterns to detect
    patterns: {
      xss: /(<script|javascript:|onerror=|onclick=)/i,
      sqli: /(union|select|insert|update|delete|drop|;--)/i,
      pathTraversal: /(\.\.\/|\.\.\\)/g,
      commandInjection: /(\||;|&|`|\$\()/g
    },
    
    // Thresholds
    thresholds: {
      suspiciousRequestsPerHour: 100,
      failedAuthAttemptsPerHour: 10,
      invalidTokensPerHour: 20
    },
    
    // Actions
    actions: {
      log: true,
      block: true,
      notify: true
    }
  },

  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  },

  // File upload security
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']
  },

  // API security
  api: {
    // Require API key for certain endpoints
    requireApiKey: [
      '/api/admin/*',
      '/api/cron/*'
    ],
    
    // Endpoints that require admin role
    adminOnly: [
      '/api/admin/*',
      '/api/users/*/ban',
      '/api/disputes/*/resolve'
    ],
    
    // Public endpoints (no auth required)
    public: [
      '/api/health',
      '/api/status',
      '/',
      '/pricing',
      '/about',
      '/contact'
    ]
  },

  // Logging
  logging: {
    // Log all security events
    securityEvents: true,
    
    // Log failed authentication attempts
    failedAuth: true,
    
    // Log rate limit violations
    rateLimitViolations: true,
    
    // Log abuse detection
    abuseDetection: true,
    
    // Sensitive fields to redact from logs
    redactFields: [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn'
    ]
  }
};

export default securityConfig;

