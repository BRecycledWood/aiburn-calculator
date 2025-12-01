/**
 * Vercel Serverless Function: Fetch AI API usage data
 * Proxies requests to OpenAI and Anthropic APIs
 * SECURITY: All input validated, no credential exposure
 */

// Simple in-memory rate limiter
const requestCounts = new Map()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per IP per minute

// Request size limit (10KB)
const MAX_PAYLOAD_SIZE = 10 * 1024

const isRateLimited = (ip) => {
  const now = Date.now()
  const userData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS }
  
  if (now > userData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  
  if (userData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }
  
  userData.count++
  requestCounts.set(ip, userData)
  return false
}

// Cleanup old entries every 5 minutes to prevent memory leak
if (typeof global !== 'undefined' && !global._rateLimitCleanupScheduled) {
  global._rateLimitCleanupScheduled = true
  setInterval(() => {
    const now = Date.now()
    for (const [ip, data] of requestCounts.entries()) {
      if (now > data.resetTime + RATE_LIMIT_WINDOW_MS) {
        requestCounts.delete(ip)
      }
    }
  }, 5 * 60 * 1000)
}

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
  
  // Get client IP for rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                   req.headers['x-real-ip'] ||
                   req.socket?.remoteAddress ||
                   'unknown'

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
  
  // Check payload size
  const contentLength = parseInt(req.headers['content-length'] || '0')
  if (contentLength > MAX_PAYLOAD_SIZE) {
    log('warn', 'Payload too large', { contentLength, clientIp })
    res.status(413).json({ error: 'Request payload too large. Maximum 10KB allowed.' })
    return
  }
  
  // Check rate limit
  if (isRateLimited(clientIp)) {
    log('warn', 'Rate limit exceeded', { clientIp })
    res.status(429).json({ error: 'Too many requests. Please try again later.' })
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
