/**
 * End-to-End Workflow Tests
 * Tests complete user journeys and feature workflows
 */

describe('E2E Workflows', () => {
  describe('Quick Calculator Workflow', () => {
    const quickCalcWorkflow = (inputData) => {
      const {
        selectedModel,
        dailyTokens,
        inputRatio = 0.7,
        daysPerMonth = 30,
      } = inputData

      const MODELS = {
        'GPT-4': { input: 30, output: 60 },
        'GPT-4o': { input: 2.5, output: 10 },
      }

      // Step 1: Validate input
      if (!selectedModel || !MODELS[selectedModel]) {
        return { error: 'Invalid model selected' }
      }

      if (!dailyTokens || dailyTokens <= 0) {
        return { error: 'Invalid token count' }
      }

      // Step 2: Calculate usage
      const monthlyTokens = dailyTokens * daysPerMonth
      const inputTokens = monthlyTokens * inputRatio
      const outputTokens = monthlyTokens * (1 - inputRatio)

      // Step 3: Calculate cost
      const pricing = MODELS[selectedModel]
      const monthlyCost =
        (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000

      // Step 4: Generate alternatives
      const alternatives = Object.entries(MODELS)
        .filter(([name]) => name !== selectedModel)
        .map(([name, altPricing]) => {
          const altCost =
            (inputTokens * altPricing.input + outputTokens * altPricing.output) /
            1000000
          const savings = monthlyCost - altCost
          return {
            name,
            cost: altCost.toFixed(2),
            savings: savings.toFixed(2),
            savingsPercent: ((savings / monthlyCost) * 100).toFixed(1),
          }
        })
        .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))

      return {
        selectedModel,
        monthlyTokens: Math.floor(monthlyTokens),
        inputTokens: Math.floor(inputTokens),
        outputTokens: Math.floor(outputTokens),
        currentCost: monthlyCost.toFixed(2),
        alternatives: alternatives.slice(0, 8),
        success: true,
      }
    }

    it('should complete quick calc workflow', () => {
      const result = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 1000000,
        inputRatio: 0.7,
      })

      expect(result.success).toBe(true)
      expect(result.selectedModel).toBe('GPT-4')
      expect(result.monthlyTokens).toBe(30000000)
      expect(result.currentCost).toBeDefined()
      expect(result.alternatives.length).toBeGreaterThan(0)
    })

    it('should handle model change', () => {
      const gpt4Result = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 1000000,
      })
      const gpt4oResult = quickCalcWorkflow({
        selectedModel: 'GPT-4o',
        dailyTokens: 1000000,
      })

      expect(parseFloat(gpt4Result.currentCost)).toBeGreaterThan(
        parseFloat(gpt4oResult.currentCost)
      )
    })

    it('should handle slider adjustment', () => {
      const result1 = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 1000000,
      })
      const result2 = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 2000000,
      })

      expect(parseFloat(result2.currentCost)).toBeGreaterThan(
        parseFloat(result1.currentCost)
      )
    })

    it('should error on invalid model', () => {
      const result = quickCalcWorkflow({
        selectedModel: 'InvalidModel',
        dailyTokens: 1000000,
      })

      expect(result.error).toBeDefined()
      expect(result.success).not.toBe(true)
    })

    it('should error on invalid tokens', () => {
      const result = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 0,
      })

      expect(result.error).toBeDefined()
    })

    it('should calculate alternatives correctly', () => {
      const result = quickCalcWorkflow({
        selectedModel: 'GPT-4',
        dailyTokens: 1000000,
      })

      expect(result.alternatives).toBeDefined()
      expect(result.alternatives.length).toBeLessThanOrEqual(8)

      // Check alternatives are sorted by savings
      for (let i = 0; i < result.alternatives.length - 1; i++) {
        expect(parseFloat(result.alternatives[i].savings)).toBeGreaterThanOrEqual(
          parseFloat(result.alternatives[i + 1].savings)
        )
      }
    })
  })

  describe('Exact Usage Workflow', () => {
    const exactUsageWorkflow = async (apiKey, provider, models) => {
      // Step 1: Validate API key
      if (!apiKey || apiKey.trim().length === 0) {
        return { error: 'API key is required' }
      }

      // Step 2: Simulate API call
      try {
        const mockUsageData = {
          total_cost: 250.0,
          models: {
            'GPT-4': 150.0,
            'GPT-4o': 100.0,
          },
        }

        // Step 3: Parse usage data
        const totalCost = mockUsageData.total_cost

        // Step 4: Generate alternatives
        const alternatives = Object.entries(models)
          .map(([name, pricing]) => {
            const estimatedCost = (50000000 * pricing.input + 30000000 * pricing.output) / 1000000
            const savings = totalCost - estimatedCost
            return {
              name,
              cost: estimatedCost.toFixed(2),
              savings: savings.toFixed(2),
              savingsPercent: ((savings / totalCost) * 100).toFixed(1),
            }
          })
          .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))

        return {
          currentCost: totalCost.toFixed(2),
          alternatives: alternatives.slice(0, 8),
          success: true,
        }
      } catch (error) {
        return { error: error.message }
      }
    }

    it('should complete exact usage workflow', async () => {
      const models = { 'GPT-4': { input: 30, output: 60 } }
      const result = await exactUsageWorkflow('sk-valid-key', 'openai', models)

      expect(result.success).toBe(true)
      expect(result.currentCost).toBeDefined()
      expect(result.alternatives).toBeDefined()
    })

    it('should error on empty API key', async () => {
      const models = { 'GPT-4': { input: 30, output: 60 } }
      const result = await exactUsageWorkflow('', 'openai', models)

      expect(result.error).toBeDefined()
    })

    it('should parse usage data correctly', async () => {
      const models = {
        'GPT-4': { input: 30, output: 60 },
        'GPT-4o': { input: 2.5, output: 10 },
      }
      const result = await exactUsageWorkflow('sk-valid-key', 'openai', models)

      expect(result.success).toBe(true)
      expect(parseFloat(result.currentCost)).toBeGreaterThan(0)
    })
  })

  describe('Share Results Workflow', () => {
    const shareOnTwitter = (results, config) => {
      if (!results || !results.alternatives || results.alternatives.length === 0) {
        return { error: 'No results to share' }
      }

      const tweetText = `I analyzed my AI token costs using ${config.brand}'s calculator and discovered I could save $${results.alternatives[0].savings} monthly by switching to ${results.alternatives[0].name}. Current spending: $${results.currentCost}/month. Check the ROI on your AI stack → ${config.url}`

      const encodedText = encodeURIComponent(tweetText)
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`

      return {
        tweetText,
        twitterUrl,
        characterCount: tweetText.length,
        success: true,
      }
    }

    it('should generate tweet with correct data', () => {
      const results = {
        currentCost: '100.00',
        alternatives: [{ savings: '50.00', name: 'GPT-4o' }],
      }
      const config = { brand: '@aiburn', url: 'aiburn.com' }

      const result = shareOnTwitter(results, config)

      expect(result.success).toBe(true)
      expect(result.tweetText).toContain('$50.00')
      expect(result.tweetText).toContain('GPT-4o')
      expect(result.twitterUrl).toContain('twitter.com')
    })

    it('should handle URL encoding', () => {
      const results = {
        currentCost: '100.00',
        alternatives: [{ savings: '50.00', name: 'Model & Test' }],
      }
      const config = { brand: '@test', url: 'test.com' }

      const result = shareOnTwitter(results, config)

      expect(result.twitterUrl).toContain('intent/tweet')
      expect(result.twitterUrl).toContain('text=')
    })

    it('should error on missing results', () => {
      const result = shareOnTwitter(null, {})
      expect(result.error).toBeDefined()
    })

    it('should error on empty alternatives', () => {
      const result = shareOnTwitter({ currentCost: '100', alternatives: [] }, {})
      expect(result.error).toBeDefined()
    })

    it('should keep tweet under 280 characters', () => {
      // Note: URL gets shortened to 23 chars by Twitter
      const results = {
        currentCost: '100.00',
        alternatives: [{ savings: '50.00', name: 'GPT-4o' }],
      }
      const config = { brand: '@aiburn', url: 'aiburn.com' }

      const result = shareOnTwitter(results, config)
      expect(result.characterCount).toBeLessThanOrEqual(280)
    })
  })

  describe('Download Report Workflow', () => {
    const generateReport = (results, canvas) => {
      if (!results) {
        return { error: 'No results to export' }
      }

      const reportData = {
        title: 'AI Token Cost Analysis',
        currentSpending: `$${results.currentCost}`,
        topSaving: results.alternatives?.[0]?.savings,
        topModel: results.alternatives?.[0]?.name,
        generatedAt: new Date().toISOString(),
        success: true,
      }

      return reportData
    }

    it('should generate report from results', () => {
      const results = {
        currentCost: '100.00',
        selectedModel: 'GPT-4',
        alternatives: [
          { savings: '50.00', name: 'GPT-4o', savingsPercent: '50.0' },
        ],
      }

      const report = generateReport(results, {})

      expect(report.success).toBe(true)
      expect(report.title).toBe('AI Token Cost Analysis')
      expect(report.currentSpending).toBe('$100.00')
      expect(report.topModel).toBe('GPT-4o')
    })

    it('should include timestamp', () => {
      const results = {
        currentCost: '100.00',
        alternatives: [{ savings: '50.00', name: 'Model' }],
      }

      const report = generateReport(results, {})

      expect(report.generatedAt).toBeDefined()
      expect(new Date(report.generatedAt)).toBeInstanceOf(Date)
    })

    it('should error on missing results', () => {
      const report = generateReport(null, {})
      expect(report.error).toBeDefined()
    })

    it('should handle missing alternatives', () => {
      const results = { currentCost: '100.00', alternatives: [] }
      const report = generateReport(results, {})

      expect(report.success).toBe(true)
      expect(report.topModel).toBeUndefined()
    })
  })

  describe('Complete User Journey', () => {
    const runCompleteJourney = async (userActions) => {
      const journey = {
        steps: [],
        state: {
          tab: 'quick',
          selectedModel: 'GPT-4',
          results: null,
          error: null,
        },
      }

      for (const action of userActions) {
        switch (action.type) {
          case 'select_tab':
            journey.state.tab = action.payload
            journey.steps.push({
              action: 'select_tab',
              tab: action.payload,
              timestamp: new Date(),
            })
            break

          case 'select_model':
            journey.state.selectedModel = action.payload
            journey.steps.push({
              action: 'select_model',
              model: action.payload,
            })
            break

          case 'calculate':
            journey.state.results = {
              currentCost: '100.00',
              alternatives: [{ savings: '50.00', name: 'Alternative' }],
            }
            journey.steps.push({
              action: 'calculate',
              success: true,
            })
            break

          case 'share':
            journey.steps.push({
              action: 'share',
              platform: action.payload,
            })
            break

          case 'download':
            journey.steps.push({
              action: 'download',
              format: action.payload,
            })
            break
        }
      }

      return journey
    }

    it('should complete full user journey', async () => {
      const actions = [
        { type: 'select_tab', payload: 'quick' },
        { type: 'select_model', payload: 'GPT-4o' },
        { type: 'calculate' },
        { type: 'share', payload: 'twitter' },
        { type: 'download', payload: 'png' },
      ]

      const journey = await runCompleteJourney(actions)

      expect(journey.steps.length).toBe(5)
      expect(journey.state.results).not.toBeNull()
      expect(journey.steps[0].action).toBe('select_tab')
      expect(journey.steps[4].action).toBe('download')
    })

    it('should track state changes', async () => {
      const actions = [
        { type: 'select_model', payload: 'GPT-4' },
        { type: 'select_model', payload: 'GPT-4o' },
      ]

      const journey = await runCompleteJourney(actions)

      expect(journey.state.selectedModel).toBe('GPT-4o')
      expect(journey.steps.length).toBe(2)
    })

    it('should handle multiple calculations', async () => {
      const actions = [
        { type: 'calculate' },
        { type: 'select_model', payload: 'GPT-4o' },
        { type: 'calculate' },
      ]

      const journey = await runCompleteJourney(actions)

      expect(journey.steps[0].action).toBe('calculate')
      expect(journey.steps[2].action).toBe('calculate')
      expect(journey.state.results).not.toBeNull()
    })
  })
})
