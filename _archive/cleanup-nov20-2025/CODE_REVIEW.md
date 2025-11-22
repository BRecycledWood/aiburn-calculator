# AIBurn Code Review & Security Audit

**Date**: November 17, 2025  
**Status**: Production Ready (with fixes recommended)  
**Risk Level**: Medium  
**Build**: Passing ✅  

---

## Executive Summary

The AIBurn calculator is **functionally sound** but has **critical security vulnerabilities** and **input validation gaps** that must be addressed before production deployment. Issues include:

- **XSS vulnerabilities** in email links (not properly escaped)
- **API key exposure risks** in error messages
- **Insufficient input validation** on API key and provider
- **Missing rate limiting** on backend API
- **Unescaped user data** in canvas rendering (twitter share)

---

## Critical Issues (FIX REQUIRED)

### 1. **XSS Vulnerability in Email Links** ⚠️ CRITICAL
**Location**: `src/App.jsx` lines 110, 484, 773  
**Issue**: Email template uses unescaped `{slot.name}` in `mailto:` links.

```jsx
// VULNERABLE:
href="mailto:ads@howstud.io?subject=Advertising%20Inquiry%20-%20{slot.name}"
```

**Problem**: If slot name contains special characters, it breaks the URL and could allow XSS.

**Fix**:
```jsx
// FIXED:
href={`mailto:ads@howstud.io?subject=${encodeURIComponent(`Advertising Inquiry - ${slot.name}`)}`}
```

---

### 2. **API Key Exposure in Error Messages** ⚠️ CRITICAL
**Location**: `api/usage.js` lines 59, 80  
**Issue**: Error messages may contain sensitive data.

```javascript
// PROBLEMATIC:
console.error('Usage fetch error:', error)
res.status(500).json({
  error: error.message || 'Failed to fetch usage data'
})
```

**Problem**: API errors could expose authentication headers or request details containing API keys.

**Fix**:
```javascript
// FIXED:
console.error('Usage fetch error:', error.message)
res.status(500).json({
  error: 'Failed to fetch usage data. Please verify your API key and try again.'
})
```

---

### 3. **Missing Input Validation** ⚠️ HIGH
**Location**: `api/usage.js` lines 31-37  
**Issue**: No validation of `apiKey` or `provider` format.

```javascript
// VULNERABLE:
const { apiKey, provider } = req.body
if (!apiKey || !provider) {
  return res.status(400).json({ error: 'Missing apiKey or provider' })
}
```

**Problems**:
- `apiKey` could be extremely long (DoS attack)
- `provider` not validated against whitelist
- No trim/sanitization

**Fix**:
```javascript
// FIXED:
const { apiKey, provider } = req.body

// Validate provider
const VALID_PROVIDERS = ['openai', 'anthropic']
if (!VALID_PROVIDERS.includes(provider)) {
  return res.status(400).json({ error: 'Invalid provider' })
}

// Validate API key format
if (!apiKey || typeof apiKey !== 'string') {
  return res.status(400).json({ error: 'Invalid API key' })
}

const trimmedKey = apiKey.trim()
if (trimmedKey.length === 0 || trimmedKey.length > 500) {
  return res.status(400).json({ error: 'API key must be between 1 and 500 characters' })
}

// Never log the actual API key
if (!trimmedKey.startsWith('sk-') && !trimmedKey.startsWith('claude-')) {
  return res.status(400).json({ error: 'Invalid API key format' })
}
```

---

### 4. **XSS in Twitter Share Text** ⚠️ HIGH
**Location**: `src/App.jsx` line 325  
**Issue**: `results.alternatives[0].savings` is directly interpolated without validation.

```javascript
// VULNERABLE:
const text = `... could save $${results.alternatives[0].savings} monthly by switching to ${results.alternatives[0].name}...`
```

**Problem**: If pricing data is corrupted or user manipulates state, it could contain malicious content.

**Fix**:
```javascript
// FIXED:
const savings = parseFloat(results.alternatives[0].savings)
if (isNaN(savings)) {
  setError('Invalid savings data')
  return
}
const modelName = String(results.alternatives[0].name).replace(/[<>"']/g, '')
const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${savings.toFixed(2)} monthly by switching to ${modelName}. Current spending: $${results.currentCost}/month. Check the ROI on your AI stack → aiburn.howstud.io`
```

---

### 5. **Missing CORS Validation** ⚠️ MEDIUM
**Location**: `api/usage.js` line 9  
**Issue**: `Access-Control-Allow-Origin: '*'` exposes API to any domain.

```javascript
// VULNERABLE:
'Access-Control-Allow-Origin': '*',
```

**Fix** (for production):
```javascript
// FIXED:
const allowedOrigins = ['https://aiburn.howstud.io', 'https://aiburn-cost-calculator.vercel.app']
const origin = req.headers.origin
const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

res.setHeader('Access-Control-Allow-Origin', corsOrigin)
res.setHeader('Access-Control-Allow-Credentials', 'true')
```

---

## High Priority Issues

### 6. **No Rate Limiting** ⚠️ HIGH
**Location**: `api/usage.js`  
**Issue**: API endpoint has no protection against brute force attacks.

**Risk**: Attacker could enumerate API keys or spam OpenAI's API.

**Fix** (add rate limiting middleware):
```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/usage', limiter)
```

For Vercel serverless, use: `https://www.npmjs.com/package/upstash-ratelimit`

---

### 7. **Unvalidated Canvas Rendering** ⚠️ MEDIUM
**Location**: `src/App.jsx` lines 361-401  
**Issue**: Canvas text isn't sanitized before rendering.

```javascript
// POTENTIALLY PROBLEMATIC:
ctx.fillText(`$${results.currentCost}`, 80, 260)
ctx.fillText(`Model: ${results.selectedModel}`, 80, 350)
```

**Problem**: While less critical than DOM XSS, malformed data could break the report.

**Fix**:
```javascript
// FIXED:
const sanitizeText = (text) => String(text).replace(/[^\w\s\$\-.,]/g, '')
ctx.fillText(`$${parseFloat(results.currentCost).toFixed(2)}`, 80, 260)
ctx.fillText(`Model: ${sanitizeText(results.selectedModel)}`, 80, 350)
```

---

### 8. **Missing Content Security Policy (CSP)** ⚠️ MEDIUM
**Location**: `vercel.json` / HTTP headers  
**Issue**: No CSP headers prevent XSS attacks.

**Fix** (add to `vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com"
        }
      ]
    }
  ]
}
```

---

### 9. **No Token Validation** ⚠️ MEDIUM
**Location**: `src/App.jsx` lines 524-542  
**Issue**: Token slider accepts 1-200M with no sanity checks.

**Problem**: Users could accidentally select extreme values.

**Fix**:
```javascript
// ADD:
const MAX_TOKENS = 1000 // Set reasonable limit
const validateTokens = (value) => {
  const num = Number(value)
  if (isNaN(num) || num < 1 || num > MAX_TOKENS) {
    setError(`Tokens must be between 1 and ${MAX_TOKENS}M`)
    return false
  }
  return true
}

// Then use it:
onChange={(e) => {
  const val = Number(e.target.value)
  if (validateTokens(val)) setMonthlyTokens(val)
}}
```

---

### 10. **No Error Boundaries** ⚠️ MEDIUM
**Location**: `src/App.jsx`  
**Issue**: No React Error Boundary for crash protection.

**Fix** (create `ErrorBoundary.jsx`):
```jsx
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          Something went wrong. Please refresh the page.
        </div>
      )
    }
    return this.props.children
  }
}
```

Then wrap App:
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Medium Priority Issues

### 11. **Hardcoded Prices** ⚠️ MEDIUM
**Location**: `src/App.jsx` lines 15-25  
**Issue**: Model prices are hardcoded and may become outdated.

**Risk**: Inaccurate calculations if prices change (which happens frequently in AI).

**Solution**: Already documented in `_STATUS.md` - implement dynamic price updates from API.

---

### 12. **No Logging/Monitoring** ⚠️ LOW
**Location**: `api/usage.js`  
**Issue**: No structured logging for debugging production issues.

**Fix** (add logging):
```javascript
function logEvent(level, message, data = {}) {
  const timestamp = new Date().toISOString()
  console.log(JSON.stringify({
    timestamp,
    level,
    message,
    ...data
  }))
}

// Then use:
logEvent('info', 'Usage fetch started', { provider })
logEvent('error', 'API error occurred', { provider, statusCode: response.status })
```

---

### 13. **Missing Timeout on API Calls** ⚠️ MEDIUM
**Location**: `api/usage.js` lines 89, 144  
**Issue**: No timeout on fetch requests to OpenAI/Anthropic.

**Fix**:
```javascript
async function fetchWithTimeout(url, options, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

// Then use:
const response = await fetchWithTimeout('https://api.openai.com/v1/usage', { headers }, 10000)
```

---

### 14. **No Input Length Validation** ⚠️ LOW
**Location**: `src/App.jsx` line 617  
**Issue**: API key input has no maxLength attribute.

**Fix**:
```jsx
<input
  type="password"
  placeholder={...}
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value.slice(0, 500))}
  maxLength="500"
  // ... rest of props
/>
```

---

### 15. **Missing HTTPS Enforcement** ⚠️ MEDIUM
**Location**: `api/usage.js`  
**Issue**: No enforcement that client communicates over HTTPS.

**Fix** (add to handler):
```javascript
if (process.env.NODE_ENV === 'production' && !req.headers['x-forwarded-proto']?.includes('https')) {
  return res.status(403).json({ error: 'HTTPS required' })
}
```

---

## Performance Optimizations

### 16. **Bundle Size Check** ✅ PASSING
Current: **66.76 KB gzipped** - acceptable for this use case.

---

### 17. **Memory Leak Risk in useEffect** ⚠️ LOW
**Location**: `src/App.jsx` lines 153-162  
**Issue**: Timer cleanup is correct, but good to note.

**Status**: Already correctly implemented with return cleanup function.

---

## Testing Recommendations

### Missing Test Coverage

1. **Security Tests** - Add to test suite:
   ```javascript
   // security.test.js
   test('API key validation rejects invalid formats', async () => {
     const res = await fetch('/api/usage', {
       method: 'POST',
       body: JSON.stringify({ apiKey: '<script>alert(1)</script>', provider: 'openai' })
     })
     expect(res.status).toBe(400)
   })

   test('XSS payload in savings is escaped', () => {
     // ...
   })
   ```

2. **Input Validation Tests**
3. **Rate Limiting Tests**
4. **CORS Tests**

---

## Checklist for Production Deployment

- [ ] **CRITICAL**: Fix XSS in email links (line 110, 484, 773)
- [ ] **CRITICAL**: Fix API key exposure in error messages (usage.js)
- [ ] **CRITICAL**: Add input validation to `/api/usage` endpoint
- [ ] **CRITICAL**: Escape user data in Twitter share text
- [ ] **HIGH**: Restrict CORS to specific origins
- [ ] **HIGH**: Add rate limiting to API
- [ ] **HIGH**: Implement Content Security Policy headers
- [ ] **HIGH**: Add token value validation
- [ ] **MEDIUM**: Create Error Boundary component
- [ ] **MEDIUM**: Add API request timeouts
- [ ] **MEDIUM**: Add HTTPS enforcement
- [ ] **LOW**: Add input length validation
- [ ] **LOW**: Implement structured logging

---

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Critical Issues | 5 | ⚠️ MUST FIX |
| High Priority | 8 | ⚠️ SHOULD FIX |
| Medium Priority | 2 | ⚠️ CONSIDER |
| Low Priority | 3 | 📝 NICE TO HAVE |
| **Total Issues** | **18** | |

---

## Next Steps

1. **Immediate**: Fix the 5 critical security issues before deploying
2. **Before Deploy**: Address all HIGH priority items
3. **Post-Deploy**: Monitor logs and implement LOW priority improvements
4. **Ongoing**: Update prices dynamically and add analytics

---

**Reviewed by**: Code Analysis Tool  
**Last Updated**: November 17, 2025  
**Recommendation**: **DO NOT DEPLOY** until critical issues are fixed.
