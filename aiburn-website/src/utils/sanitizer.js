/**
 * Input sanitization utilities
 */

/**
 * Sanitize numeric token input
 * @param {string|number} value - Raw input value
 * @returns {number} - Sanitized number between 0.1 and 500
 */
export const sanitizeTokenCount = (value) => {
  const num = parseFloat(value);
  
  // Return 0 if invalid
  if (isNaN(num)) {
    return 0;
  }
  
  // Clamp between 0.1 and 500M tokens
  return Math.max(0.1, Math.min(500, num));
};

/**
 * Sanitize form input strings (prevent XSS)
 * @param {string} value - Raw input value
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, 500); // Limit length
};

/**
 * Sanitize email form data
 * @param {object} formData - Form data object
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  return {
    name: sanitizeString(formData.name || ''),
    email: sanitizeEmail(formData.email || ''),
    phone: sanitizePhone(formData.phone || ''),
    company: sanitizeString(formData.company || ''),
    jobTitle: sanitizeString(formData.jobTitle || ''),
  };
};

/**
 * Validate and sanitize email
 * @param {string} email - Email address
 * @returns {string} - Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email) => {
  const trimmed = String(email).trim().slice(0, 254);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(trimmed)) {
    return trimmed;
  }
  
  return '';
};

/**
 * Sanitize phone number (keep only digits, +, -, space, parentheses)
 * @param {string} phone - Phone number
 * @returns {string} - Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  return String(phone)
    .replace(/[^0-9\s\-\+\(\)]/g, '')
    .slice(0, 20);
};

/**
 * Sanitize API key (redact for logging)
 * @param {string} key - API key
 * @returns {string} - Redacted key for display
 */
export const redactApiKey = (key) => {
  if (!key || key.length < 8) {
    return '***';
  }
  const visibleChars = Math.ceil(key.length * 0.2);
  return key.slice(0, visibleChars) + '*'.repeat(key.length - visibleChars);
};
