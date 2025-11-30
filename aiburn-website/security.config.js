/**
 * Security Configuration
 * 
 * Content Security Policy and security headers configuration
 * for production deployment
 */

// CSP Policy for production
// Start with report-only mode, then enforce once validated
export const CSP_POLICY = {
  'report-only': {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      'https://cdn.jsdelivr.net', // For any CDN scripts
      'https://www.googletagmanager.com', // Google Analytics (if used)
      'https://cdn.segment.com', // Segment (if used)
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Tailwind requires this during dev
      'https://cdn.jsdelivr.net',
    ],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://api.openai.com', // OpenAI API
      'https://api.anthropic.com', // Anthropic API
      'https://formsubmit.co', // Form submission
      'https://*.sentry.io', // Sentry error tracking
    ],
    'frame-src': [
      "'self'",
      'https://twitter.com', // Twitter embed/share
      'https://x.com', // X embed/share
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", 'https://formsubmit.co'],
    'frame-ancestors': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': [],
  },
  'enforce': {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      'https://cdn.jsdelivr.net',
      'https://www.googletagmanager.com',
    ],
    'style-src': [
      "'self'",
      'https://cdn.jsdelivr.net',
    ],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:', 'https://fonts.googleapis.com'],
    'connect-src': [
      "'self'",
      'https://api.openai.com',
      'https://*.sentry.io',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
  },
};

/**
 * Build CSP header string from policy object
 */
export function buildCSPHeader(policy, mode = 'report-only') {
  const directives = policy[mode] || policy['report-only'];
  
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Security headers for production
 */
export const SECURITY_HEADERS = {
  // CSP - report-only for validation
  'Content-Security-Policy-Report-Only': buildCSPHeader(CSP_POLICY, 'report-only'),
  
  // X-Frame-Options
  'X-Frame-Options': 'SAMEORIGIN',
  
  // X-Content-Type-Options (prevent MIME sniffing)
  'X-Content-Type-Options': 'nosniff',
  
  // X-XSS-Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy':
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  
  // HSTS (after validated with https)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevent caching of sensitive content
  'Cache-Control': 'public, max-age=3600, must-revalidate',
};

/**
 * Validation rules for user input
 */
export const INPUT_VALIDATION = {
  // API key validation (OpenAI format: sk-...)
  apiKey: {
    pattern: /^sk-[A-Za-z0-9-]{20,}$/,
    maxLength: 256,
    description: 'OpenAI API key format',
  },
  
  // Email validation
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    description: 'Valid email format',
  },
  
  // Name validation
  name: {
    pattern: /^[a-zA-Z\s'-]{2,100}$/,
    maxLength: 100,
    description: 'Name with letters, spaces, hyphens, apostrophes',
  },
  
  // Token count validation
  tokens: {
    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
    min: 1,
    max: 500,
    description: 'Positive number up to 500',
  },
};

/**
 * Environment variable validation
 * 
 * These should NEVER be exposed to the client
 */
export const PROTECTED_ENV_VARS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'DATABASE_URL',
  'SENTRY_DSN',
  'API_SECRET_KEY',
];

/**
 * Check if any sensitive env vars are exposed to client
 */
export function validateClientBundleSecrets(bundle) {
  const sensitivePatterns = [
    /sk-[A-Za-z0-9-]{20,}/g, // OpenAI keys
    /sk-ant-[A-Za-z0-9-]{20,}/g, // Anthropic keys
    /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(bundle)) {
      console.warn('⚠️ WARNING: Potential secret found in client bundle!');
      return false;
    }
  }
  
  return true;
}

/**
 * Sentry configuration for error tracking
 */
export const SENTRY_CONFIG = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Before sending to Sentry, filter out sensitive data
  beforeSend(event, hint) {
    // Redact API keys from error messages
    if (event.exception) {
      const errorString = JSON.stringify(event);
      if (/sk-[A-Za-z0-9-]{20,}/.test(errorString)) {
        event.exception[0].value = '[REDACTED: API KEY DETECTED]';
      }
    }
    return event;
  },
  
  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
  ],
};

export default {
  CSP_POLICY,
  SECURITY_HEADERS,
  INPUT_VALIDATION,
  PROTECTED_ENV_VARS,
  SENTRY_CONFIG,
  buildCSPHeader,
  validateClientBundleSecrets,
};
