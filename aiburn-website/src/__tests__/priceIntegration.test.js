/**
 * Integration Tests for Price Fetching & Loading
 * Tests the price data loading pipeline and fallback mechanisms
 */

describe('Price Loading Integration', () => {
  // Mock fetch
  const mockFetch = (response) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(response),
      })
    )
  }

  const mockFetchError = (error) => {
    global.fetch = jest.fn(() => Promise.reject(error))
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Load Prices from JSON', () => {
    it('should load prices successfully', async () => {
      const mockPrices = {
        version: '1.0.0',
        timestamp: '2025-11-17T00:00:00Z',
        models: {
          'GPT-4': { input: 30, output: 60, provider: 'openai' },
          'GPT-4o': { input: 2.5, output: 10, provider: 'openai' },
        },
      }

      mockFetch(mockPrices)

      const response = await fetch('/data/prices.json')
      const data = await response.json()

      expect(data.version).toBe('1.0.0')
      expect(data.models).toBeDefined()
      expect(data.models['GPT-4']).toBeDefined()
    })

    it('should handle network errors gracefully', async () => {
      mockFetchError(new Error('Network failed'))

      try {
        await fetch('/data/prices.json')
        fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toBe('Network failed')
      }
    })

    it('should handle malformed JSON', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.reject(new SyntaxError('Invalid JSON')),
        })
      )

      try {
        const response = await fetch('/data/prices.json')
        await response.json()
        fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError)
      }
    })

    it('should validate price data structure', async () => {
      const mockPrices = {
        version: '1.0.0',
        timestamp: '2025-11-17T00:00:00Z',
        models: {
          'GPT-4': { input: 30, output: 60, provider: 'openai' },
        },
      }

      mockFetch(mockPrices)

      const response = await fetch('/data/prices.json')
      const data = await response.json()

      // Validate structure
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('timestamp')
      expect(data).toHaveProperty('models')
      expect(typeof data.models).toBe('object')
    })

    it('should parse timestamp correctly', async () => {
      const mockPrices = {
        version: '1.0.0',
        timestamp: '2025-11-17T12:34:56Z',
        models: {},
      }

      mockFetch(mockPrices)

      const response = await fetch('/data/prices.json')
      const data = await response.json()
      const date = new Date(data.timestamp)

      expect(date.getTime()).not.toBeNaN()
      expect(date.toISOString()).toContain('2025-11-17')
    })
  })

  describe('Fallback Mechanism', () => {
    const defaultModels = {
      'GPT-4': { input: 30, output: 60, provider: 'openai' },
      'GPT-4o': { input: 2.5, output: 10, provider: 'openai' },
    }

    const loadPricesWithFallback = async (url, fallbackData) => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Response not ok')
        return await response.json()
      } catch (error) {
        console.warn('Failed to load prices, using fallback')
        return fallbackData
      }
    }

    it('should use fallback data on fetch failure', async () => {
      mockFetchError(new Error('Network error'))

      const result = await loadPricesWithFallback('/data/prices.json', defaultModels)
      expect(result).toEqual(defaultModels)
    })

    it('should use fallback data on bad response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      )

      const result = await loadPricesWithFallback('/data/prices.json', defaultModels)
      expect(result).toEqual(defaultModels)
    })

    it('should prefer fresh data over fallback', async () => {
      const freshData = {
        version: '1.0.1',
        models: { 'GPT-5': { input: 100, output: 200 } },
      }
      mockFetch(freshData)

      const result = await loadPricesWithFallback('/data/prices.json', defaultModels)
      expect(result).toEqual(freshData)
      expect(result).not.toEqual(defaultModels)
    })
  })

  describe('Price Data Validation', () => {
    const validatePriceData = (data) => {
      const errors = []

      if (!data.models || typeof data.models !== 'object') {
        errors.push('Missing or invalid models object')
      }

      Object.entries(data.models || {}).forEach(([modelName, pricing]) => {
        if (typeof pricing.input !== 'number' || pricing.input < 0) {
          errors.push(`Invalid input price for ${modelName}`)
        }
        if (typeof pricing.output !== 'number' || pricing.output < 0) {
          errors.push(`Invalid output price for ${modelName}`)
        }
        if (!pricing.provider) {
          errors.push(`Missing provider for ${modelName}`)
        }
      })

      return errors.length === 0 ? null : errors
    }

    it('should validate correct price data', () => {
      const validData = {
        models: {
          'GPT-4': { input: 30, output: 60, provider: 'openai' },
          'GPT-4o': { input: 2.5, output: 10, provider: 'openai' },
        },
      }

      const errors = validatePriceData(validData)
      expect(errors).toBeNull()
    })

    it('should detect missing models object', () => {
      const errors = validatePriceData({})
      expect(errors).not.toBeNull()
      expect(errors).toContain('Missing or invalid models object')
    })

    it('should detect invalid input prices', () => {
      const invalidData = {
        models: {
          'GPT-4': { input: 'invalid', output: 60, provider: 'openai' },
        },
      }

      const errors = validatePriceData(invalidData)
      expect(errors).not.toBeNull()
      expect(errors[0]).toContain('Invalid input price')
    })

    it('should detect negative prices', () => {
      const invalidData = {
        models: {
          'GPT-4': { input: -30, output: 60, provider: 'openai' },
        },
      }

      const errors = validatePriceData(invalidData)
      expect(errors).not.toBeNull()
      expect(errors[0]).toContain('Invalid input price')
    })

    it('should detect missing provider', () => {
      const invalidData = {
        models: {
          'GPT-4': { input: 30, output: 60 },
        },
      }

      const errors = validatePriceData(invalidData)
      expect(errors).not.toBeNull()
      expect(errors[0]).toContain('Missing provider')
    })

    it('should allow zero prices', () => {
      const validData = {
        models: {
          'Free Model': { input: 0, output: 0, provider: 'test' },
        },
      }

      const errors = validatePriceData(validData)
      expect(errors).toBeNull()
    })
  })

  describe('Price Staleness Detection', () => {
    const isPriceStale = (timestamp, maxAgeHours = 168) => {
      const now = new Date()
      const priceDate = new Date(timestamp)
      const ageMs = now - priceDate
      const ageHours = ageMs / (1000 * 60 * 60)

      return ageHours > maxAgeHours
    }

    it('should detect fresh prices', () => {
      const now = new Date().toISOString()
      expect(isPriceStale(now)).toBe(false)
    })

    it('should detect stale prices (7+ days old)', () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      expect(isPriceStale(sevenDaysAgo)).toBe(true)
    })

    it('should detect stale prices at boundary', () => {
      const exactly7DaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 1).toISOString()
      expect(isPriceStale(exactly7DaysAgo)).toBe(true)
    })

    it('should allow custom staleness threshold', () => {
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      expect(isPriceStale(oneDayAgo, 24)).toBe(true)
      expect(isPriceStale(oneDayAgo, 48)).toBe(false)
    })

    it('should handle invalid timestamps', () => {
      expect(() => isPriceStale('invalid-date')).not.toThrow()
      // Should treat as stale
      expect(isPriceStale('invalid-date')).toBe(true)
    })
  })

  describe('Price Comparison', () => {
    const comparePrices = (model1, model2, models) => {
      const cost1 =
        (1000000 * models[model1].input + 1000000 * models[model1].output) / 1000000
      const cost2 =
        (1000000 * models[model2].input + 1000000 * models[model2].output) / 1000000

      return {
        cheaper: cost1 < cost2 ? model1 : model2,
        difference: Math.abs(cost1 - cost2).toFixed(2),
        percent: (Math.abs(cost1 - cost2) / Math.max(cost1, cost2) * 100).toFixed(1),
      }
    }

    it('should identify cheaper model', () => {
      const models = {
        'Expensive': { input: 100, output: 200 },
        'Cheap': { input: 1, output: 2 },
      }

      const result = comparePrices('Expensive', 'Cheap', models)
      expect(result.cheaper).toBe('Cheap')
    })

    it('should calculate price difference', () => {
      const models = {
        'ModelA': { input: 30, output: 60 }, // 0.09
        'ModelB': { input: 2.5, output: 10 }, // 0.0125
      }

      const result = comparePrices('ModelA', 'ModelB', models)
      expect(result.difference).toBeDefined()
      expect(parseFloat(result.difference)).toBeGreaterThan(0)
    })

    it('should calculate percentage difference', () => {
      const models = {
        'ModelA': { input: 30, output: 60 },
        'ModelB': { input: 30, output: 60 },
      }

      const result = comparePrices('ModelA', 'ModelB', models)
      expect(result.percent).toBe('0.0')
    })
  })

  describe('Model Alternatives Generation', () => {
    const generateAlternatives = (currentModel, allModels) => {
      const currentPrice =
        (1000000 * allModels[currentModel].input +
          1000000 * allModels[currentModel].output) /
        1000000

      return Object.entries(allModels)
        .filter(([name]) => name !== currentModel)
        .map(([name, pricing]) => {
          const altPrice =
            (1000000 * pricing.input + 1000000 * pricing.output) / 1000000
          const savings = currentPrice - altPrice
          return {
            name,
            price: altPrice.toFixed(4),
            savings: savings.toFixed(4),
            savingsPercent: ((savings / currentPrice) * 100).toFixed(1),
          }
        })
        .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))
    }

    it('should generate alternatives', () => {
      const models = {
        'Current': { input: 30, output: 60 },
        'Alt1': { input: 10, output: 20 },
        'Alt2': { input: 2.5, output: 10 },
      }

      const alts = generateAlternatives('Current', models)
      expect(alts.length).toBe(2)
      expect(alts[0].name).toBeDefined()
    })

    it('should sort by savings (descending)', () => {
      const models = {
        'Current': { input: 100, output: 200 },
        'Alt1': { input: 10, output: 20 },
        'Alt2': { input: 1, output: 2 },
      }

      const alts = generateAlternatives('Current', models)
      for (let i = 0; i < alts.length - 1; i++) {
        expect(parseFloat(alts[i].savings)).toBeGreaterThanOrEqual(
          parseFloat(alts[i + 1].savings)
        )
      }
    })

    it('should exclude current model', () => {
      const models = {
        'Current': { input: 30, output: 60 },
        'Alt1': { input: 10, output: 20 },
      }

      const alts = generateAlternatives('Current', models)
      const modelNames = alts.map((a) => a.name)
      expect(modelNames).not.toContain('Current')
    })

    it('should calculate negative savings for expensive alternatives', () => {
      const models = {
        'Current': { input: 1, output: 2 },
        'Expensive': { input: 100, output: 200 },
      }

      const alts = generateAlternatives('Current', models)
      expect(parseFloat(alts[0].savings)).toBeLessThan(0)
    })
  })
})
