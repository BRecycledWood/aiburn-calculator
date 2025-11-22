/**
 * Jest Setup File
 * Global test configuration and utilities
 */

// Polyfill for fetch if needed
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn()
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Suppress console errors and warnings in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global test utilities
global.testUtils = {
  /**
   * Wait for async operations
   */
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Create a mock fetch response
   */
  mockFetchResponse: (data, options = {}) => ({
    ok: options.ok !== false,
    status: options.status || 200,
    statusText: options.statusText || 'OK',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    clone: function () {
      return this
    },
  }),

  /**
   * Create a mock fetch error
   */
  mockFetchError: (message = 'Fetch failed') => {
    return Promise.reject(new Error(message))
  },
}

// Setup global test data
global.TEST_MODELS = {
  'GPT-4': { input: 30, output: 60, provider: 'openai', category: 'Premium' },
  'GPT-4o': { input: 2.5, output: 10, provider: 'openai', category: 'Balanced' },
  'Claude 3.5 Sonnet': { input: 3, output: 15, provider: 'anthropic', category: 'Standard' },
  'Llama 3.1 70B': { input: 0.05, output: 0.08, provider: 'groq', category: 'Budget' },
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver
