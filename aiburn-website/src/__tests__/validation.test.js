/**
 * Input Validation & Error Handling Tests
 * Tests edge cases and error scenarios
 */

describe('Input Validation', () => {
  const validateTokenInput = (value) => {
    // Check for null/undefined first
    if (value === null || value === undefined) {
      throw new Error('Invalid number format')
    }

    // Check for empty string
    if (typeof value === 'string' && value.trim() === '') {
      throw new Error('Invalid number format')
    }

    // Coerce to number
    const num = Number(value)

    // Check if valid number
    if (isNaN(num)) {
      throw new Error('Invalid number format')
    }

    // Check if negative
    if (num < 0) {
      throw new Error('Tokens cannot be negative')
    }

    // Check if exceeds max
    if (num > 1000000000000) {
      throw new Error('Token count exceeds maximum (1 trillion)')
    }

    // Check if integer
    if (!Number.isInteger(num) && num !== 0) {
      // Allow decimals but warn
      console.warn('Token counts should be integers')
    }

    return num
  }

  describe('Token Input Validation', () => {
    it('should accept valid token counts', () => {
      expect(validateTokenInput(1000000)).toBe(1000000)
      expect(validateTokenInput(0)).toBe(0)
      expect(validateTokenInput(1)).toBe(1)
    })

    it('should reject negative tokens', () => {
      expect(() => validateTokenInput(-1000000)).toThrow('Tokens cannot be negative')
    })

    it('should reject non-numeric input', () => {
      expect(() => validateTokenInput('abc')).toThrow('Invalid number format')
      expect(() => validateTokenInput('12abc34')).toThrow('Invalid number format')
    })

    it('should reject special characters', () => {
      expect(() => validateTokenInput('@#$%')).toThrow('Invalid number format')
      expect(() => validateTokenInput('<script>')).toThrow('Invalid number format')
    })

    it('should handle very large numbers', () => {
      expect(validateTokenInput(999999999999)).toBe(999999999999)
    })

    it('should reject numbers exceeding limit', () => {
      expect(() => validateTokenInput(1000000000001)).toThrow(
        'Token count exceeds maximum'
      )
    })

    it('should handle scientific notation', () => {
      expect(validateTokenInput('1e6')).toBe(1000000)
      expect(validateTokenInput('5e8')).toBe(500000000)
    })

    it('should handle string numbers', () => {
      expect(validateTokenInput('1000000')).toBe(1000000)
      expect(validateTokenInput('0')).toBe(0)
    })

    it('should handle empty string', () => {
      expect(() => validateTokenInput('')).toThrow('Invalid number format')
    })

    it('should handle null/undefined', () => {
      expect(() => validateTokenInput(null)).toThrow('Invalid number format')
      expect(() => validateTokenInput(undefined)).toThrow('Invalid number format')
    })

    it('should handle float tokens', () => {
      expect(validateTokenInput(1000000.5)).toBe(1000000.5)
    })

    it('should handle infinity', () => {
      expect(() => validateTokenInput(Infinity)).toThrow(
        'Token count exceeds maximum'
      )
    })
  })

  const validateApiKey = (key) => {
    if (!key || typeof key !== 'string') {
      throw new Error('API key must be a non-empty string')
    }

    if (key.trim().length === 0) {
      throw new Error('API key cannot be empty')
    }

    if (key.length < 10) {
      throw new Error('API key appears too short')
    }

    if (key.length > 1000) {
      throw new Error('API key appears too long')
    }

    return key.trim()
  }

  describe('API Key Validation', () => {
    it('should accept valid API keys', () => {
      const validKey = 'sk-' + 'a'.repeat(48)
      expect(validateApiKey(validKey)).toBe(validKey)
    })

    it('should reject empty API key', () => {
      expect(() => validateApiKey('')).toThrow()
      expect(() => validateApiKey('   ')).toThrow()
    })

    it('should reject null/undefined', () => {
      expect(() => validateApiKey(null)).toThrow()
      expect(() => validateApiKey(undefined)).toThrow()
    })

    it('should reject short API keys', () => {
      expect(() => validateApiKey('short')).toThrow('too short')
    })

    it('should reject extremely long API keys', () => {
      const longKey = 'k'.repeat(1001)
      expect(() => validateApiKey(longKey)).toThrow('too long')
    })

    it('should trim whitespace', () => {
      const key = '  valid-api-key-here  '
      expect(validateApiKey(key)).toBe('valid-api-key-here')
    })

    it('should allow various key formats', () => {
      expect(() => validateApiKey('sk-proj-1234567890abcdef')).not.toThrow()
      expect(() => validateApiKey('bearer_1234567890')).not.toThrow()
    })
  })

  const validateModelSelection = (model, availableModels) => {
    if (!model || model.trim().length === 0) {
      throw new Error('Model must be selected')
    }

    if (!availableModels[model]) {
      throw new Error(`Model "${model}" not found`)
    }

    return model
  }

  describe('Model Selection Validation', () => {
    const models = {
      'GPT-4': { input: 30, output: 60 },
      'GPT-4o': { input: 2.5, output: 10 },
    }

    it('should accept valid model', () => {
      expect(validateModelSelection('GPT-4', models)).toBe('GPT-4')
    })

    it('should reject invalid model', () => {
      expect(() => validateModelSelection('InvalidModel', models)).toThrow(
        'not found'
      )
    })

    it('should reject empty model', () => {
      expect(() => validateModelSelection('', models)).toThrow()
      expect(() => validateModelSelection('   ', models)).toThrow()
    })

    it('should reject null/undefined', () => {
      expect(() => validateModelSelection(null, models)).toThrow()
      expect(() => validateModelSelection(undefined, models)).toThrow()
    })

    it('should be case-sensitive', () => {
      expect(() => validateModelSelection('gpt-4', models)).toThrow()
      expect(() => validateModelSelection('GPT-4o', models)).not.toThrow()
    })
  })

  const validateSliderValue = (value, min = 0, max = 100) => {
    const num = Number(value)
    if (isNaN(num)) {
      throw new Error('Slider value must be numeric')
    }
    if (num < min) {
      throw new Error(`Value cannot be less than ${min}`)
    }
    if (num > max) {
      throw new Error(`Value cannot exceed ${max}`)
    }
    return num
  }

  describe('Slider Input Validation', () => {
    it('should accept values in range', () => {
      expect(validateSliderValue(50, 0, 100)).toBe(50)
      expect(validateSliderValue(0, 0, 100)).toBe(0)
      expect(validateSliderValue(100, 0, 100)).toBe(100)
    })

    it('should reject values below minimum', () => {
      expect(() => validateSliderValue(-1, 0, 100)).toThrow(
        'cannot be less than'
      )
    })

    it('should reject values above maximum', () => {
      expect(() => validateSliderValue(101, 0, 100)).toThrow(
        'cannot exceed'
      )
    })

    it('should handle decimal values', () => {
      expect(validateSliderValue(50.5, 0, 100)).toBe(50.5)
    })

    it('should reject non-numeric values', () => {
      expect(() => validateSliderValue('abc', 0, 100)).toThrow()
    })

    it('should handle custom ranges', () => {
      expect(validateSliderValue(50, 10, 90)).toBe(50)
      expect(() => validateSliderValue(5, 10, 90)).toThrow()
      expect(() => validateSliderValue(95, 10, 90)).toThrow()
    })
  })
})

describe('Error Handling', () => {
  const calculateWithErrorHandling = (inputTokens, outputTokens, model, models) => {
    try {
      // Validate inputs
      if (inputTokens < 0 || outputTokens < 0) {
        throw new Error('Token counts cannot be negative')
      }

      if (!models[model]) {
        throw new Error(`Model ${model} not found`)
      }

      const pricing = models[model]
      return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000
    } catch (error) {
      return { error: error.message }
    }
  }

  describe('Calculation Error Handling', () => {
    const models = {
      'GPT-4': { input: 30, output: 60 },
    }

    it('should return error object on invalid input', () => {
      const result = calculateWithErrorHandling(
        -1000000,
        1000000,
        'GPT-4',
        models
      )
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('negative')
    })

    it('should return error object on invalid model', () => {
      const result = calculateWithErrorHandling(1000000, 1000000, 'Invalid', models)
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('not found')
    })

    it('should return calculated value on success', () => {
      const result = calculateWithErrorHandling(1000000, 1000000, 'GPT-4', models)
      expect(typeof result).toBe('number')
      // GPT-4: input $30 + output $60 = $90 for 1M+1M tokens
      expect(result).toBeCloseTo(90, 2)
    })

    it('should handle missing model pricing', () => {
      const result = calculateWithErrorHandling(1000000, 1000000, 'GPT-4', {})
      expect(result).toHaveProperty('error')
    })
  })

  const formatErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error
    }
    if (error instanceof Error) {
      return error.message
    }
    return 'An unexpected error occurred'
  }

  describe('Error Message Formatting', () => {
    it('should format string errors', () => {
      expect(formatErrorMessage('API key is invalid')).toBe('API key is invalid')
    })

    it('should format Error objects', () => {
      const error = new Error('Network timeout')
      expect(formatErrorMessage(error)).toBe('Network timeout')
    })

    it('should handle unexpected error types', () => {
      expect(formatErrorMessage({})).toBe('An unexpected error occurred')
      expect(formatErrorMessage(null)).toBe('An unexpected error occurred')
    })

    it('should preserve special characters in messages', () => {
      const msg = 'Error: "Invalid" value @ position 5'
      expect(formatErrorMessage(msg)).toBe(msg)
    })
  })
})

describe('Data Sanitization', () => {
  const sanitizeUserInput = (input) => {
    if (typeof input !== 'string') return ''

    // Remove script tags and content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '')

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '')

    // Trim whitespace
    sanitized = sanitized.trim()

    return sanitized
  }

  it('should remove HTML tags', () => {
    expect(sanitizeUserInput('Hello <b>World</b>')).toBe('Hello World')
    expect(sanitizeUserInput('<div>Content</div>')).toBe('Content')
  })

  it('should remove script tags', () => {
    expect(sanitizeUserInput('<script>alert("xss")</script>Hello')).toBe('Hello')
  })

  it('should remove null bytes', () => {
    expect(sanitizeUserInput('Hello\0World')).toBe('HelloWorld')
  })

  it('should trim whitespace', () => {
    expect(sanitizeUserInput('  Hello  World  ')).toBe('Hello  World')
  })

  it('should handle non-string input', () => {
    expect(sanitizeUserInput(123)).toBe('')
    expect(sanitizeUserInput(null)).toBe('')
    expect(sanitizeUserInput(undefined)).toBe('')
  })

  it('should preserve legitimate content', () => {
    expect(sanitizeUserInput('GPT-4 @ $0.03/1k tokens')).toBe('GPT-4 @ $0.03/1k tokens')
  })
})
