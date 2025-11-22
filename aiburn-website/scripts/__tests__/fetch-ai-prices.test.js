/**
 * Tests for AIBurn Price Fetcher
 * 
 * Run with: npm test -- scripts/__tests__/fetch-ai-prices.test.js
 * or: npx jest scripts/__tests__/fetch-ai-prices.test.js
 */

const fs = require('fs');
const path = require('path');
const {
  buildPriceData,
  validatePriceData,
  PRICE_SOURCES,
} = require('../fetch-ai-prices');

describe('Price Fetching System', () => {
  describe('buildPriceData', () => {
    it('should build price data with all required models', async () => {
      const data = await buildPriceData();

      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('models');
      expect(data).toHaveProperty('metadata');

      const requiredModels = [
        'GPT-4',
        'GPT-4 Turbo',
        'GPT-4o',
        'GPT-3.5 Turbo',
        'Claude 3 Opus',
        'Claude 3.5 Sonnet',
        'Claude 3 Haiku',
        'Llama 3.1 70B',
        'DeepSeek Chat',
      ];

      requiredModels.forEach((model) => {
        expect(data.models).toHaveProperty(model);
      });
    });

    it('should include metadata for all models', async () => {
      const data = await buildPriceData();

      expect(data.metadata.totalModels).toBe(9);
      expect(data.metadata.providersUpdated).toBe(4);
      expect(data.metadata.successCount).toBeGreaterThan(0);
    });

    it('should have valid timestamp', async () => {
      const data = await buildPriceData();
      const timestamp = new Date(data.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('validatePriceData', () => {
    let validData;

    beforeAll(async () => {
      validData = await buildPriceData();
    });

    it('should validate correct price data', () => {
      expect(() => validatePriceData(validData)).not.toThrow();
    });

    it('should reject data with missing models', () => {
      const invalidData = { ...validData, models: {} };
      expect(() => validatePriceData(invalidData)).toThrow();
    });

    it('should reject data with negative prices', () => {
      const invalidData = { ...validData };
      invalidData.models['GPT-4'].input = -1;

      expect(() => validatePriceData(invalidData)).toThrow();
    });

    it('should reject data with invalid price types', () => {
      const invalidData = { ...validData };
      invalidData.models['GPT-4'].input = 'invalid';

      expect(() => validatePriceData(invalidData)).toThrow();
    });

    it('should require all 9 models', () => {
      const invalidData = { ...validData };
      delete invalidData.models['GPT-4'];

      expect(() => validatePriceData(invalidData)).toThrow(
        /Missing required models/
      );
    });
  });

  describe('Price structure', () => {
    it('should have correct price structure per model', async () => {
      const data = await buildPriceData();

      Object.entries(data.models).forEach(([modelName, modelData]) => {
        expect(modelData).toHaveProperty('provider');
        expect(modelData).toHaveProperty('input');
        expect(modelData).toHaveProperty('output');
        expect(modelData).toHaveProperty('inputUnit');
        expect(modelData).toHaveProperty('outputUnit');
        expect(modelData).toHaveProperty('lastUpdated');

        expect(typeof modelData.input).toBe('number');
        expect(typeof modelData.output).toBe('number');
        expect(modelData.input).toBeGreaterThanOrEqual(0);
        expect(modelData.output).toBeGreaterThanOrEqual(0);
      });
    });

    it('should group models by provider', async () => {
      const data = await buildPriceData();
      const providers = {};

      Object.entries(data.models).forEach(([modelName, modelData]) => {
        if (!providers[modelData.provider]) {
          providers[modelData.provider] = [];
        }
        providers[modelData.provider].push(modelName);
      });

      expect(Object.keys(providers)).toContain('openai');
      expect(Object.keys(providers)).toContain('anthropic');
      expect(Object.keys(providers)).toContain('groq');
      expect(Object.keys(providers)).toContain('deepseek');
    });

    it('should have output price >= input price for same model', async () => {
      const data = await buildPriceData();

      Object.entries(data.models).forEach(([modelName, modelData]) => {
        expect(modelData.output).toBeGreaterThanOrEqual(modelData.input);
      });
    });
  });

  describe('Provider data', () => {
    it('should have OpenAI models', () => {
      expect(PRICE_SOURCES.openai.models).toHaveProperty('GPT-4');
      expect(PRICE_SOURCES.openai.models).toHaveProperty('GPT-4o');
      expect(PRICE_SOURCES.openai.models).toHaveProperty('GPT-3.5 Turbo');
    });

    it('should have Anthropic models', () => {
      expect(PRICE_SOURCES.anthropic.models).toHaveProperty('Claude 3 Opus');
      expect(PRICE_SOURCES.anthropic.models).toHaveProperty(
        'Claude 3.5 Sonnet'
      );
      expect(PRICE_SOURCES.anthropic.models).toHaveProperty('Claude 3 Haiku');
    });

    it('should have Groq models', () => {
      expect(PRICE_SOURCES.groq.models).toHaveProperty('Llama 3.1 70B');
    });

    it('should have DeepSeek models', () => {
      expect(PRICE_SOURCES.deepseek.models).toHaveProperty('DeepSeek Chat');
    });
  });

  describe('Price consistency', () => {
    it('should have consistent unit conversions', async () => {
      const data = await buildPriceData();

      Object.entries(data.models).forEach(([modelName, modelData]) => {
        expect(modelData.inputUnit).toBeGreaterThan(0);
        expect(modelData.outputUnit).toBeGreaterThan(0);
      });
    });

    it('should convert to per-1M token format', async () => {
      const data = await buildPriceData();

      // All prices should be per-1M tokens
      Object.entries(data.models).forEach(([modelName, modelData]) => {
        // Prices should be in reasonable range (not per-token, but per-1M tokens)
        expect(modelData.input).toBeGreaterThan(0.01);
        expect(modelData.output).toBeGreaterThan(0.01);
      });
    });
  });

  describe('Update log', () => {
    it('should have valid update log', async () => {
      const data = await buildPriceData();

      expect(Array.isArray(data.updateLog)).toBe(true);
      expect(data.updateLog.length).toBeGreaterThan(0);
    });

    it('should have status for each update', async () => {
      const data = await buildPriceData();

      data.updateLog.forEach((log) => {
        expect(log).toHaveProperty('model');
        expect(log).toHaveProperty('provider');
        expect(log).toHaveProperty('status');
        expect(['success', 'failure']).toContain(log.status);
      });
    });
  });

  describe('Error scenarios', () => {
    it('should handle missing price data gracefully', async () => {
      expect(async () => {
        const invalidData = { models: null };
        validatePriceData(invalidData);
      }).rejects.toThrow();
    });

    it('should handle empty models object', () => {
      expect(() => {
        validatePriceData({ models: {} });
      }).toThrow();
    });

    it('should handle corrupted price values', () => {
      const corruptedData = {
        models: {
          'GPT-4': { input: NaN, output: Infinity },
        },
      };

      expect(() => validatePriceData(corruptedData)).toThrow();
    });
  });
});

describe('Integration scenarios', () => {
  it('should be able to build and validate data in sequence', async () => {
    const data = await buildPriceData();
    expect(() => validatePriceData(data)).not.toThrow();
  });

  it('should produce consistent data across multiple runs', async () => {
    const data1 = await buildPriceData();
    const data2 = await buildPriceData();

    expect(Object.keys(data1.models)).toEqual(Object.keys(data2.models));

    Object.keys(data1.models).forEach((model) => {
      expect(data1.models[model].input).toBe(data2.models[model].input);
      expect(data1.models[model].output).toBe(data2.models[model].output);
    });
  });
});
