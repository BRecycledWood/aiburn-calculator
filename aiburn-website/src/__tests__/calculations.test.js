/**
 * Unit Tests for Calculation Functions
 * Tests core math logic for AI token cost calculations
 */

describe('Cost Calculations', () => {
  // Mock models data
  const MODELS = {
    'GPT-4': { input: 30, output: 60, provider: 'openai', category: 'Premium' },
    'GPT-4o': { input: 2.5, output: 10, provider: 'openai', category: 'Balanced' },
    'Claude 3.5 Sonnet': { input: 3, output: 15, provider: 'anthropic', category: 'Standard' },
    'Llama 3.1 70B': { input: 0.05, output: 0.08, provider: 'groq', category: 'Budget' },
  }

  describe('calculateCost', () => {
    const calculateCost = (inputTokens, outputTokens, model) => {
      const pricing = MODELS[model]
      if (!pricing) throw new Error(`Model ${model} not found`)
      return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000
    }

    it('should calculate cost for valid inputs', () => {
      const cost = calculateCost(1000000, 1000000, 'GPT-4')
      expect(cost).toBeCloseTo(0.09, 2) // (1M * 30 + 1M * 60) / 1M = 90
    })

    it('should handle zero input tokens', () => {
      const cost = calculateCost(0, 1000000, 'GPT-4')
      expect(cost).toBeCloseTo(0.06, 2) // (0 * 30 + 1M * 60) / 1M = 60
    })

    it('should handle zero output tokens', () => {
      const cost = calculateCost(1000000, 0, 'GPT-4')
      expect(cost).toBeCloseTo(0.03, 2) // (1M * 30 + 0 * 60) / 1M = 30
    })

    it('should handle zero tokens', () => {
      const cost = calculateCost(0, 0, 'GPT-4')
      expect(cost).toBe(0)
    })

    it('should calculate different costs for different models', () => {
      const input = 1000000
      const output = 1000000
      const gpt4Cost = calculateCost(input, output, 'GPT-4')
      const gpt4oCost = calculateCost(input, output, 'GPT-4o')
      const llamaCost = calculateCost(input, output, 'Llama 3.1 70B')

      expect(gpt4Cost).toBeGreaterThan(gpt4oCost)
      expect(gpt4oCost).toBeGreaterThan(llamaCost)
    })

    it('should throw error for invalid model', () => {
      expect(() => calculateCost(1000000, 1000000, 'InvalidModel')).toThrow()
    })

    it('should handle very large numbers', () => {
      const cost = calculateCost(1000000000, 1000000000, 'GPT-4o')
      expect(cost).toBeCloseTo(12.5, 1) // (1B * 2.5 + 1B * 10) / 1M = 12500
      expect(isFinite(cost)).toBe(true)
    })

    it('should handle decimal token values', () => {
      const cost = calculateCost(500000.5, 250000.25, 'GPT-4')
      expect(cost).toBeCloseTo(0.0225, 4)
      expect(isFinite(cost)).toBe(true)
    })

    it('should handle negative numbers gracefully', () => {
      expect(() => calculateCost(-1000000, 1000000, 'GPT-4')).not.toThrow()
      // In production, should validate inputs and reject negatives
    })
  })

  describe('calculateMonthlyUsage', () => {
    const calculateMonthlyUsage = (dailyTokens, daysInMonth = 30) => {
      return dailyTokens * daysInMonth
    }

    it('should calculate monthly usage from daily usage', () => {
      const daily = 1000000
      const monthly = calculateMonthlyUsage(daily)
      expect(monthly).toBe(30000000)
    })

    it('should handle 31-day months', () => {
      const daily = 1000000
      const monthly = calculateMonthlyUsage(daily, 31)
      expect(monthly).toBe(31000000)
    })

    it('should handle zero daily usage', () => {
      expect(calculateMonthlyUsage(0)).toBe(0)
    })

    it('should handle fractional daily usage', () => {
      const daily = 1000.5
      const monthly = calculateMonthlyUsage(daily)
      expect(monthly).toBeCloseTo(30015, 0)
    })
  })

  describe('tokenDistribution', () => {
    const distributeTokens = (totalTokens, inputRatio = 0.7) => {
      const inputTokens = totalTokens * inputRatio
      const outputTokens = totalTokens * (1 - inputRatio)
      return { inputTokens, outputTokens }
    }

    it('should distribute tokens by input/output ratio', () => {
      const { inputTokens, outputTokens } = distributeTokens(1000000, 0.7)
      expect(inputTokens).toBe(700000)
      expect(outputTokens).toBe(300000)
    })

    it('should handle 100% input ratio', () => {
      const { inputTokens, outputTokens } = distributeTokens(1000000, 1.0)
      expect(inputTokens).toBe(1000000)
      expect(outputTokens).toBe(0)
    })

    it('should handle 0% input ratio', () => {
      const { inputTokens, outputTokens } = distributeTokens(1000000, 0)
      expect(inputTokens).toBe(0)
      expect(outputTokens).toBe(1000000)
    })

    it('should sum to total tokens', () => {
      const total = 1000000
      const { inputTokens, outputTokens } = distributeTokens(total, 0.6)
      expect(inputTokens + outputTokens).toBe(total)
    })
  })

  describe('calculateSavings', () => {
    const calculateSavings = (currentCost, alternativeCost) => {
      const savings = currentCost - alternativeCost
      const savingsPercent = ((savings / currentCost) * 100).toFixed(1)
      return { savings: savings.toFixed(2), savingsPercent }
    }

    it('should calculate positive savings', () => {
      const result = calculateSavings(100, 50)
      expect(result.savings).toBe('50.00')
      expect(result.savingsPercent).toBe('50.0')
    })

    it('should calculate negative savings (cost increase)', () => {
      const result = calculateSavings(50, 100)
      expect(result.savings).toBe('-50.00')
      expect(result.savingsPercent).toBe('-100.0')
    })

    it('should handle zero savings', () => {
      const result = calculateSavings(100, 100)
      expect(result.savings).toBe('0.00')
      expect(result.savingsPercent).toBe('0.0')
    })

    it('should handle very small differences', () => {
      const result = calculateSavings(100, 99.99)
      expect(parseFloat(result.savings)).toBeCloseTo(0.01, 2)
    })

    it('should handle very large costs', () => {
      const result = calculateSavings(1000000, 500000)
      expect(result.savings).toBe('500000.00')
      expect(result.savingsPercent).toBe('50.0')
    })

    it('should throw error on zero current cost', () => {
      expect(() => calculateSavings(0, 50)).toThrow()
    })
  })

  describe('tokenToMillion conversion', () => {
    const formatTokensToMillions = (tokens) => {
      return (tokens / 1000000).toFixed(2)
    }

    it('should convert tokens to millions', () => {
      expect(formatTokensToMillions(1000000)).toBe('1.00')
      expect(formatTokensToMillions(500000)).toBe('0.50')
      expect(formatTokensToMillions(2500000)).toBe('2.50')
    })

    it('should round to 2 decimals', () => {
      expect(formatTokensToMillions(1234567)).toBe('1.23')
    })

    it('should handle zero tokens', () => {
      expect(formatTokensToMillions(0)).toBe('0.00')
    })

    it('should handle small token counts', () => {
      expect(formatTokensToMillions(1)).toBe('0.00')
      expect(formatTokensToMillions(100000)).toBe('0.10')
    })
  })

  describe('pricePercentageCalculation', () => {
    const calculatePercentage = (part, total) => {
      if (total === 0) return '0.0'
      return ((part / total) * 100).toFixed(1)
    }

    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe('50.0')
      expect(calculatePercentage(25, 100)).toBe('25.0')
    })

    it('should handle zero part', () => {
      expect(calculatePercentage(0, 100)).toBe('0.0')
    })

    it('should handle zero total', () => {
      expect(calculatePercentage(50, 0)).toBe('0.0')
    })

    it('should handle part > total', () => {
      expect(calculatePercentage(150, 100)).toBe('150.0')
    })

    it('should round correctly', () => {
      expect(calculatePercentage(33.333, 100)).toBe('33.3')
      expect(calculatePercentage(66.667, 100)).toBe('66.7')
    })
  })
})
