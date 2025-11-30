/**
 * Sentry Error Tracking Integration
 * 
 * Initialize Sentry for production error tracking and performance monitoring
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking and monitoring
 * 
 * Must be called early in application startup
 */
export function initSentry() {
  // Only initialize in production
  if (process.env.NODE_ENV !== 'production' || !process.env.VITE_SENTRY_DSN) {
    console.log('Sentry disabled (development mode or DSN not configured)');
    return;
  }

  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Sample 10% of transactions in production, 100% in development
    tracesSampleRate: 0.1,
    
    // Sample 100% of error events
    sampleRate: 1.0,
    
    // Max breadcrumbs to store (default 100)
    maxBreadcrumbs: 50,
    
    // Auto-session tracking
    autoSessionTracking: true,
    
    // Release tracking
    release: process.env.VITE_APP_VERSION || 'unknown',
    
    // Attachments - max number to keep
    attachStacktrace: true,
    
    // Before sending to Sentry, filter sensitive data
    beforeSend(event, hint) {
      // Don't send if it's a network error to OpenAI (expected)
      const errorString = JSON.stringify(event);
      if (errorString.includes('api.openai.com') || errorString.includes('net::ERR')) {
        return null;
      }
      
      // Redact sensitive information
      redactSensitiveData(event);
      
      return event;
    },
    
    // Configure what to ignore
    ignoreErrors: [
      // Browser extensions and custom plugins
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      
      // External scripts
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      
      // Network errors (expected)
      'NetworkError',
      'Network request failed',
      
      // Aborted requests
      'The user aborted a request',
      'AbortError',
      
      // Third-party script errors (uncomment if needed)
      // 'Script error',
    ],
    
    // Deny URLs (don't report errors from these)
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
    ],
    
    // Allow URLs (whitelist for important errors)
    allowUrls: [
      // Your app domain
      /https?:\/\/(aiburn\.)?howstud\.io/,
      /https?:\/\/localhost/,
    ],
  });

  // Create a named instance for explicit error tracking
  window.sentryReportError = function(error, context = {}) {
    Sentry.captureException(error, {
      contexts: {
        app: context,
      },
    });
  };

  // Set user context if available (after auth)
  if (window.user) {
    Sentry.setUser({
      id: window.user.id,
      email: window.user.email,
      username: window.user.name,
    });
  }

  console.log('✓ Sentry initialized for error tracking');
}

/**
 * Redact sensitive data from Sentry events
 */
function redactSensitiveData(event) {
  const sensitivePatterns = [
    {
      pattern: /sk-[A-Za-z0-9-]{20,}/g,
      replacement: '[REDACTED:OPENAI_KEY]',
    },
    {
      pattern: /sk-ant-[A-Za-z0-9-]{20,}/g,
      replacement: '[REDACTED:ANTHROPIC_KEY]',
    },
    {
      pattern: /AKIA[0-9A-Z]{16}/g,
      replacement: '[REDACTED:AWS_KEY]',
    },
    {
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      replacement: '[REDACTED:EMAIL]',
    },
  ];

  const eventString = JSON.stringify(event);
  let redacted = eventString;

  for (const { pattern, replacement } of sensitivePatterns) {
    redacted = redacted.replace(pattern, replacement);
  }

  // Parse back if changes were made
  if (redacted !== eventString) {
    try {
      const parsed = JSON.parse(redacted);
      Object.assign(event, parsed);
    } catch (e) {
      console.warn('Failed to redact sensitive data in Sentry event');
    }
  }
}

/**
 * Manually report an error to Sentry
 */
export function reportError(error, context = {}) {
  if (window.sentryReportError) {
    window.sentryReportError(error, context);
  } else {
    console.error('Sentry error reporter not available', error);
  }
}

/**
 * Set user context for error tracking
 */
export function setSentryUser(user) {
  if (user) {
    Sentry.setUser({
      id: user.id || 'unknown',
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(message, category = 'user-action', level = 'info') {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a transaction for performance monitoring
 * Note: Transactions are automatically created for navigation and HTTP calls
 * Use this for custom operations only
 */
export function startTransaction(name, op = 'http.request') {
  // In newer Sentry versions, transactions are created via startSpan
  if (Sentry.startSpan) {
    return Sentry.startSpan({
      op,
      name,
    });
  }
  // Fallback for older versions
  if (Sentry.startTransaction) {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
  console.warn('Sentry transaction API not available');
  return null;
}

/**
 * Capture a message (not an error)
 */
export function captureMessage(message, level = 'info') {
  Sentry.captureMessage(message, level);
}

export default {
  initSentry,
  reportError,
  setSentryUser,
  addBreadcrumb,
  startTransaction,
  captureMessage,
};
