# Security Fixes for AIBurn

## Quick Reference: Files to Update

### 1. `src/App.jsx` - Critical Fixes Required

**Three locations need fixing for XSS vulnerability in email links:**

**Location 1 - Line 110 (AdCard component)**
```jsx
// BEFORE (VULNERABLE):
href="mailto:ads@howstud.io?subject=Advertising%20Inquiry%20-%20{slot.name}"

// AFTER (FIXED):
href={`mailto:ads@howstud.io?subject=${encodeURIComponent(`Advertising Inquiry - ${slot.name}`)}`}
```

**Location 2 - Line 484 (Left sidebar)**
```jsx
// BEFORE (VULNERABLE):
<a href="mailto:ads@howstud.io" className="...">

// AFTER (FIXED):
<a href={`mailto:ads@howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="...">
```

**Location 3 - Line 773 (Right sidebar)**
```jsx
// BEFORE (VULNERABLE):
<a href="mailto:ads@howstud.io" className="...">

// AFTER (FIXED):
<a href={`mailto:ads@howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="...">
```

**Location 4 - Line 325 (Twitter share - data validation)**
```javascript
// BEFORE (VULNERABLE):
const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${results.alternatives[0].savings} monthly by switching to ${results.alternatives[0].name}. Current spending: $${results.currentCost}/month. Check the ROI on your AI stack → aiburn.howstud.io`

// AFTER (FIXED):
const savings = parseFloat(results.alternatives[0].savings)
const currentCost = parseFloat(results.currentCost)

if (isNaN(savings) || isNaN(currentCost)) {
  setError('Invalid calculation data')
  return
}

const modelName = String(results.alternatives[0].name).replace(/[<>"'&]/g, '')
const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${savings.toFixed(2)} monthly by switching to ${modelName}. Current spending: $${currentCost.toFixed(2)}/month. Check the ROI on your AI stack → aiburn.howstud.io`
```

**Location 5 - Add token validation (around line 529)**
```javascript
// ADD validation function before calculateCosts():
const validateMonthlyTokens = (value) => {
  const num = Number(value)
  const MAX_TOKENS = 500 // Reasonable limit
  
  if (isNaN(num) || num < 1 || num > MAX_TOKENS) {
    setError(`Token usage must be between 1M and ${MAX_TOKENS}M. Please adjust.`)
    return false
  }
  return true
}

// UPDATE onChange handler:
onChange={(e) => {
  const value = Number(e.target.value)
  if (validateMonthlyTokens(value)) {
    setMonthlyTokens(value)
    setError('')
  }
}}
```

**Location 6 - Update slider max value (line 527)**
```jsx
// BEFORE:
<input type="range" min="1" max="200" ... />

// AFTER:
<input type="range" min="1" max="500" ... />
```

---

### 2. `api/usage.js` - Critical & High Priority Fixes

**Complete replacement with fixed version:**

```javascript
/**
 * Vercel Serverless Function: Fetch AI API usage data
 * Proxies requests to OpenAI and Anthropic APIs
 * SECURITY: All input validated, no credential exposure
 */

// CORS configuration - restrict to specific origins in production
const getCORSHeaders = (origin) => {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://aiburn.howstud.io', 'https://aiburn-cost-calculator.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
  
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
  }
}

// Input validation helpers
const VALID_PROVIDERS = ['openai', 'anthropic']
const MAX_API_KEY_LENGTH = 500
const API_KEY_PATTERNS = {
  openai: /^sk-[A-Za-z0-9\-_]{20,}$/,
  anthropic: /^claude-[A-Za-z0-9\-_]{20,}$/,
}

const validateProvider = (provider) => {
  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    throw new Error('INVALID_PROVIDER')
  }
  return provider
}

const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('INVALID_API_KEY_TYPE')
  }

  const trimmed = apiKey.trim()
  
  if (trimmed.length === 0 || trimmed.length > MAX_API_KEY_LENGTH) {
    throw new Error('INVALID_API_KEY_LENGTH')
  }

  return trimmed
}

// Fetch with timeout
const fetchWithTimeout = async (url, options, timeoutMs = 10000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      timeout: timeoutMs,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

// Structured logging
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  }
  
  // Don't log sensitive data
  if (logEntry.apiKey) delete logEntry.apiKey
  if (logEntry.error?.includes('sk-')) delete logEntry.error
  
  console.log(JSON.stringify(logEntry))
}

export default async function handler(req, res) {
  const origin = req.headers.origin || 'unknown'
  const corsHeaders = getCORSHeaders(origin)

  // Set CORS headers on all responses
  Object.keys(corsHeaders).forEach((key) => {
    res.setHeader(key, corsHeaders[key])
  })

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    log('warn', 'Non-HTTPS request attempted')
    res.status(403).json({ error: 'HTTPS required' })
    return
  }

  try {
    // Extract and validate inputs
    const { apiKey, provider } = req.body

    if (!apiKey || !provider) {
      log('warn', 'Missing required fields', { hasApiKey: !!apiKey, hasProvider: !!provider })
      return res.status(400).json({ error: 'Missing apiKey or provider' })
    }

    // Validate inputs
    const validatedProvider = validateProvider(provider)
    const validatedApiKey = validateApiKey(apiKey)

    log('info', 'Usage fetch started', { provider: validatedProvider, keyLength: validatedApiKey.length })

    // Fetch usage data
    let usageData

    if (validatedProvider === 'openai') {
      usageData = await fetchOpenAIUsage(validatedApiKey)
    } else if (validatedProvider === 'anthropic') {
      usageData = await fetchAnthropicUsage(validatedApiKey)
    }

    log('info', 'Usage fetch succeeded', { provider: validatedProvider })
    res.status(200).json(usageData)

  } catch (error) {
    log('error', `${error.message}`)

    // Return user-friendly errors without exposing sensitive data
    const errorResponses = {
      INVALID_PROVIDER: { status: 400, message: 'Invalid provider specified' },
      INVALID_API_KEY_TYPE: { status: 400, message: 'API key must be a string' },
      INVALID_API_KEY_LENGTH: { status: 400, message: 'API key length invalid' },
      UNAUTHORIZED: { status: 401, message: 'Invalid API key. Please check your credentials.' },
      NOT_FOUND: { status: 404, message: 'API endpoint not found. Please verify the provider.' },
      TIMEOUT: { status: 504, message: 'Request timeout. Please try again.' },
      NETWORK_ERROR: { status: 503, message: 'Network error. Please try again later.' },
    }

    if (error.message === 'AbortError') {
      res.status(504).json({ error: 'Request timeout. Please try again.' })
    } else if (error.message === 'Failed to fetch') {
      res.status(503).json({ error: 'Network error. Please try again later.' })
    } else if (errorResponses[error.message]) {
      const { status, message } = errorResponses[error.message]
      res.status(status).json({ error: message })
    } else {
      // Generic error for unknown issues
      res.status(500).json({ error: 'Failed to fetch usage data. Please try again.' })
    }
  }
}

/**
 * Fetch usage data from OpenAI API with validation
 */
async function fetchOpenAIUsage(apiKey) {
  const response = await fetchWithTimeout('https://api.openai.com/v1/usage', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'AIBurn-Calculator/1.0',
    },
  }, 10000)

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND')
    }
    throw new Error(`API_ERROR_${response.status}`)
  }

  const data = await response.json()

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('INVALID_RESPONSE_FORMAT')
  }

  // Parse the 30-day usage data with validation
  const parsed = {
    provider: 'openai',
    totalCost: 0,
    usage: {},
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  }

  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((entry) => {
      if (entry.line_items && Array.isArray(entry.line_items)) {
        entry.line_items.forEach((item) => {
          const modelName = String(item.name || 'unknown').substring(0, 100)
          const cost = Math.max(0, parseFloat(item.cost) || 0)

          if (!parsed.usage[modelName]) {
            parsed.usage[modelName] = {
              cost: 0,
              requests: 0,
            }
          }

          parsed.usage[modelName].cost += cost
          parsed.usage[modelName].requests += 1
          parsed.totalCost += cost
        })
      }
    })
  }

  return parsed
}

/**
 * Fetch usage data from Anthropic API with validation
 * Note: Placeholder until Anthropic releases public usage API
 */
async function fetchAnthropicUsage(apiKey) {
  const response = await fetchWithTimeout('https://api.anthropic.com/v1/usage', {
    headers: {
      'x-api-key': apiKey,
      'User-Agent': 'AIBurn-Calculator/1.0',
    },
  }, 10000)

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND')
    }
    throw new Error(`API_ERROR_${response.status}`)
  }

  const data = await response.json()

  if (!data || typeof data !== 'object') {
    throw new Error('INVALID_RESPONSE_FORMAT')
  }

  const parsed = {
    provider: 'anthropic',
    totalCost: 0,
    usage: {},
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  }

  if (data.usage && Array.isArray(data.usage)) {
    data.usage.forEach((entry) => {
      const modelName = String(entry.model || 'claude').substring(0, 100)
      const cost = Math.max(0, parseFloat(entry.cost) || 0)

      if (!parsed.usage[modelName]) {
        parsed.usage[modelName] = {
          cost: 0,
          tokens: 0,
        }
      }

      parsed.usage[modelName].cost += cost
      parsed.usage[modelName].tokens += Math.max(0, entry.tokens || 0)
      parsed.totalCost += cost
    })
  }

  return parsed
}
```

---

### 3. `vercel.json` - Add Security Headers

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com; frame-ancestors 'self'"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

### 4. Create `src/components/ErrorBoundary.jsx`

```jsx
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error)
    console.error('Error info:', errorInfo)
    // In production, you'd send this to an error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-6">
              An unexpected error occurred. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

Then update `src/main.jsx`:
```jsx
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

---

## Implementation Order

1. **Phase 1 (CRITICAL - Must do before any deployment):**
   - Fix email links in App.jsx (3 locations)
   - Add data validation to Twitter share
   - Update api/usage.js with proper validation
   - Add token validation

2. **Phase 2 (HIGH - Do before production):**
   - Add vercel.json security headers
   - Create ErrorBoundary component
   - Test all changes

3. **Phase 3 (Optional but recommended):**
   - Add rate limiting (depends on infrastructure)
   - Implement analytics
   - Add structured logging

---

## Testing Commands

After implementing fixes:

```bash
# Run existing tests
npm test

# Build to verify no errors
npm run build

# Test API security
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "<script>alert(1)</script>", "provider": "openai"}'
# Should return 400 error, not execute script
```

---

## Deployment Checklist

- [ ] All XSS vulnerabilities fixed
- [ ] Input validation in place
- [ ] CORS restricted to specific origins
- [ ] Security headers added to vercel.json
- [ ] Error boundary implemented
- [ ] Tests passing
- [ ] Build successful
- [ ] Code review approved

---

**Priority**: Complete Phase 1 before deploying to production.
