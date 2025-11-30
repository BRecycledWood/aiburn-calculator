/**
 * Input Sanitization Utility
 * 
 * Uses DOMPurify to safely sanitize and validate user input
 * to prevent XSS attacks and injection vulnerabilities
 */

import DOMPurify from 'dompurify';

// DOMPurify configuration
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [], // No HTML tags allowed for user input
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
};

/**
 * Sanitize plain text input (no HTML allowed)
 */
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(input, PURIFY_CONFIG).trim();
}

/**
 * Validate and sanitize email input
 */
export function sanitizeEmail(email) {
  const sanitized = sanitizeText(email);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized.toLowerCase();
}

/**
 * Validate and sanitize API key input
 * 
 * Note: API keys are sensitive - sanitize but never log or expose
 */
export function sanitizeAPIKey(key) {
  if (!key || typeof key !== 'string') {
    return '';
  }
  
  const sanitized = key.trim();
  
  // Basic format validation (OpenAI: sk-...)
  if (!sanitized.startsWith('sk-')) {
    throw new Error('Invalid API key format');
  }
  
  // Ensure reasonable length
  if (sanitized.length < 20 || sanitized.length > 256) {
    throw new Error('API key length out of range');
  }
  
  return sanitized;
}

/**
 * Validate and sanitize numeric input (token counts)
 */
export function sanitizeNumber(input, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const num = Number(input);
  
  if (isNaN(num)) {
    throw new Error('Input must be a valid number');
  }
  
  if (num < min || num > max) {
    throw new Error(`Number must be between ${min} and ${max}`);
  }
  
  return num;
}

/**
 * Validate and sanitize token count input
 */
export function sanitizeTokenCount(input) {
  try {
    const num = sanitizeNumber(input, 1, 500);
    return num;
  } catch (error) {
    throw new Error('Token count must be between 1 and 500 million');
  }
}

/**
 * Sanitize form data object
 */
export function sanitizeFormData(formData) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Create a safe message for display (no HTML/scripts)
 */
export function createSafeMessage(text) {
  return sanitizeText(text);
}

/**
 * Encode HTML entities for display
 */
export function encodeHTML(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate model name (prevent injection)
 */
export function sanitizeModelName(modelName) {
  if (!modelName || typeof modelName !== 'string') {
    return '';
  }
  
  // Allow only alphanumeric, spaces, dots, and hyphens
  const sanitized = modelName.replace(/[^a-zA-Z0-9\s.-]/g, '').trim();
  
  if (sanitized.length === 0 || sanitized.length > 100) {
    throw new Error('Invalid model name');
  }
  
  return sanitized;
}

/**
 * Safe URL validation for redirects
 */
export function isSafeURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url, window.location.href);
    
    // Only allow same origin or known safe domains
    const safeOrigins = [
      window.location.origin,
      'https://aiburn.howstud.io',
      'https://twitter.com',
      'https://x.com',
    ];
    
    return safeOrigins.some(origin => urlObj.origin === new URL(origin).origin);
  } catch {
    return false;
  }
}

export default {
  sanitizeText,
  sanitizeEmail,
  sanitizeAPIKey,
  sanitizeNumber,
  sanitizeTokenCount,
  sanitizeFormData,
  createSafeMessage,
  encodeHTML,
  sanitizeModelName,
  isSafeURL,
};
