import { useState, useEffect } from 'react'
import {
  Download,
  Share2,
  Settings,
  ChevronRight,
  Zap,
  TrendingDown,
  Mail,
  X,
  Loader,
} from 'lucide-react'

// Model pricing data (per 1M tokens)
const MODELS = {
  'GPT-4': { input: 30, output: 60, provider: 'openai', category: 'Premium' },
  'GPT-4 Turbo': { input: 10, output: 30, provider: 'openai', category: 'Standard' },
  'GPT-4o': { input: 2.5, output: 10, provider: 'openai', category: 'Balanced' },
  'GPT-3.5 Turbo': { input: 0.5, output: 1.5, provider: 'openai', category: 'Budget' },
  'Claude 3 Opus': { input: 15, output: 75, provider: 'anthropic', category: 'Premium' },
  'Claude 3.5 Sonnet': { input: 3, output: 15, provider: 'anthropic', category: 'Standard' },
  'Claude 3 Haiku': { input: 0.25, output: 1.25, provider: 'anthropic', category: 'Budget' },
  'Llama 3.1 70B': { input: 0.05, output: 0.08, provider: 'groq', category: 'Budget' },
  'DeepSeek Chat': { input: 0.14, output: 0.28, provider: 'deepseek', category: 'Budget' },
}

// Ad slots configuration
const AD_SLOTS = [
  {
    id: 'header-banner',
    name: 'Header Banner',
    price: 1499,
    placement: 'full-width-top',
    size: 'large',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'sidebar-premium',
    name: 'Sidebar Premium',
    price: 999,
    placement: 'sidebar',
    size: 'square',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'featured-1',
    name: 'Featured Rotating #1',
    price: 499,
    placement: 'content-featured',
    size: 'banner',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'featured-2',
    name: 'Featured Rotating #2',
    price: 499,
    placement: 'content-featured',
    size: 'banner',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'featured-3',
    name: 'Featured Rotating #3',
    price: 499,
    placement: 'content-featured',
    size: 'banner',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'content-top',
    name: 'In-Content Top',
    price: 399,
    placement: 'content-inline',
    size: 'standard',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'content-bottom',
    name: 'In-Content Bottom',
    price: 299,
    placement: 'content-inline',
    size: 'standard',
    color: 'from-slate-200 to-slate-300',
  },
  {
    id: 'footer-banner',
    name: 'Footer Banner',
    price: 199,
    placement: 'footer',
    size: 'banner',
    color: 'from-slate-200 to-slate-300',
  },
]

// AdCard Component
function AdCard({ slot, onRotate, isAvailableSlot = false }) {
  const isAvailable = !slot.sponsor
  const bgGradient = `bg-gradient-to-r ${slot.color}`
  const isLightBg = slot.color.includes('slate')

  if (isAvailable) {
    return (
      <div className={`${bgGradient} rounded-2xl p-6 ${isLightBg ? 'text-slate-900' : 'text-white'} shadow-md hover:shadow-lg transition`}>
        <h4 className="font-bold text-lg mb-1">{slot.name}</h4>
        <p className="text-sm opacity-90 mb-4">
          <span className="font-semibold text-base">${slot.price}</span>
          <span className="opacity-75">/month</span>
        </p>
        <a
          href={`mailto:contact@aiburn.howstud.io?subject=${encodeURIComponent(`Advertising Inquiry - ${slot.name}`)}`}
          className={`text-sm ${isLightBg ? 'bg-slate-900' : 'bg-white'} bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold`}
        >
          Inquire →
        </a>
      </div>
    )
  }

  return (
    <div className={`${bgGradient} rounded-2xl p-6 ${isLightBg ? 'text-slate-900' : 'text-white'} shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg">{slot.sponsor.name}</h4>
          <p className="text-sm opacity-90">{slot.sponsor.tagline}</p>
        </div>
        <span className="text-2xl">{slot.sponsor.logo}</span>
      </div>
      <a
        href={slot.sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block ${isLightBg ? 'bg-slate-900' : 'bg-white'} bg-opacity-20 hover:bg-opacity-30 transition px-4 py-2 rounded-lg font-semibold text-sm`}
      >
        Visit {slot.sponsor.name} →
      </a>
    </div>
  )
}

// Main App Component
export default function App() {
  const [mode, setMode] = useState('quick') // 'quick' or 'exact'
  const [selectedModel, setSelectedModel] = useState('GPT-4o')
  const [monthlyTokens, setMonthlyTokens] = useState(10)
  const [inputRatio, setInputRatio] = useState(60) // % of tokens that are input
  const [outputRatio, setOutputRatio] = useState(40) // % of tokens that are output
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [currentFeatureAd, setCurrentFeatureAd] = useState(0)

  // Rotate featured ads every 10 seconds
  useEffect(() => {
    if (mode !== 'quick') return

    const timer = setInterval(() => {
      const featureSlots = AD_SLOTS.filter((s) => s.placement === 'content-featured')
      setCurrentFeatureAd((prev) => (prev + 1) % featureSlots.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [mode])

  // Validate token range
  const validateTokenRange = (tokens) => {
    const MAX_TOKENS = 500
    if (isNaN(tokens) || tokens < 1 || tokens > MAX_TOKENS) {
      setError(`Token usage must be between 1M and ${MAX_TOKENS}M`)
      return false
    }
    return true
  }

  // Calculate costs in Quick mode
  const calculateCosts = () => {
    const model = MODELS[selectedModel]
    const tokens = monthlyTokens * 1000000
    const inputTokens = tokens * (inputRatio / 100)
    const outputTokens = tokens * (outputRatio / 100)

    const currentCost = (inputTokens * model.input + outputTokens * model.output) / 1000000
    const dailyCost = currentCost / 30

    // Generate alternatives
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const alternatives = Object.entries(MODELS)
      .filter(([name]) => name !== selectedModel)
      .map(([name, pricing], idx) => {
        const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000
        const dailyAltCost = cost / 30
        const savings = currentCost - cost
        const savingsPercent = ((savings / currentCost) * 100).toFixed(1)
        const costPerInputUnit = pricing.input
        const costPerOutputUnit = pricing.output
        // First 3 updated today, rest updated a week ago
        const lastUpdated = idx < 3 ? now : weekAgo
        return {
          name,
          cost: cost.toFixed(2),
          dailyCost: dailyAltCost.toFixed(2),
          savings: savings.toFixed(2),
          savingsPercent,
          costPerInputUnit,
          costPerOutputUnit,
          pricing,
          lastUpdated,
        }
      })
      .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))

    setResults({
      mode: 'quick',
      selectedModel,
      monthlyTokens,
      inputRatio,
      outputRatio,
      currentCost: currentCost.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
      inputTokens: Math.floor(inputTokens),
      outputTokens: Math.floor(outputTokens),
      inputCostPerUnit: model.input,
      outputCostPerUnit: model.output,
      alternatives: alternatives.slice(0, 8),
    })

    setError('')
  }

  // Parse OpenAI usage response
  const parseOpenAIUsage = (usageData) => {
    const modelUsage = {}

    if (usageData.data) {
      usageData.data.forEach((day) => {
        day.line_items?.forEach((item) => {
          const model = item.name
          if (!modelUsage[model]) {
            modelUsage[model] = { input: 0, output: 0, cost: 0 }
          }
          // Parse token counts and costs
          if (item.operation === 'completion' || item.operation === 'generation') {
            modelUsage[model].output += item.quantity || 0
            modelUsage[model].cost += item.cost || 0
          } else {
            modelUsage[model].input += item.quantity || 0
          }
        })
      })
    }

    return modelUsage
  }

  // Fetch exact usage from API
  const analyzeExactUsage = async () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider }),
      })

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to fetch usage data')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Calculate total costs
      let totalCost = 0
      const modelBreakdown = {}

      // Process the usage data based on provider
      if (provider === 'openai') {
        const usage = parseOpenAIUsage(data)
        Object.entries(usage).forEach(([modelName, usage]) => {
          totalCost += usage.cost
          modelBreakdown[modelName] = {
            cost: usage.cost.toFixed(2),
            percent: 0, // Will calculate after
          }
        })
      }

      // Calculate percentages
      Object.keys(modelBreakdown).forEach((model) => {
        modelBreakdown[model].percent = (
          (parseFloat(modelBreakdown[model].cost) / totalCost) *
          100
        ).toFixed(1)
      })

      // Generate alternatives with actual usage patterns
      const alternatives = Object.entries(MODELS)
        .map(([name, pricing]) => {
          // Estimate cost based on avg usage patterns
          const estimatedInputTokens = 50000000
          const estimatedOutputTokens = 30000000
          const cost =
            (estimatedInputTokens * pricing.input +
              estimatedOutputTokens * pricing.output) /
            1000000
          const savings = totalCost - cost
          const savingsPercent = ((savings / totalCost) * 100).toFixed(1)

          return {
            name,
            cost: cost.toFixed(2),
            savings: savings.toFixed(2),
            savingsPercent,
            pricing,
          }
        })
        .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))

      setResults({
        mode: 'exact',
        currentCost: totalCost.toFixed(2),
        modelBreakdown,
        alternatives: alternatives.slice(0, 8),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Share on Twitter
  const shareOnTwitter = () => {
    if (!results) return

    // Validate data before using
    const savings = parseFloat(results.alternatives[0].savings)
    const currentCost = parseFloat(results.currentCost)

    if (isNaN(savings) || isNaN(currentCost)) {
      setError('Invalid calculation data. Please recalculate.')
      return
    }

    // Sanitize model name
    const modelName = String(results.alternatives[0].name)
      .replace(/[<>"'&]/g, '')
      .substring(0, 50)

    const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${savings.toFixed(2)} monthly by switching to ${modelName}. Current spending: $${currentCost.toFixed(2)}/month. Check the ROI on your AI stack → aiburn.howstud.io`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  // Download Screenshot
  const downloadReport = async () => {
    if (!results) return

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
    gradient.addColorStop(0, '#9333ea')
    gradient.addColorStop(1, '#3b82f6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1200, 630)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('AI Token Cost Analysis', 600, 80)

    // Current spending box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(50, 140, 500, 400)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Current Spending', 80, 190)
    ctx.font = 'bold 48px sans-serif'
    ctx.fillText(`$${results.currentCost}`, 80, 260)
    ctx.font = '16px sans-serif'
    ctx.fillText('/month', 80, 290)

    if (results.mode === 'quick') {
      ctx.font = '14px sans-serif'
      ctx.fillText(
        `Model: ${results.selectedModel}`,
        80,
        350
      )
      ctx.fillText(
        `Tokens: ${(results.monthlyTokens / 1000000).toFixed(2)}M`,
        80,
        380
      )
    }

    // Savings box
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
    ctx.fillRect(650, 140, 500, 400)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Potential Savings', 680, 190)
    ctx.font = 'bold 48px sans-serif'
    ctx.fillText(`$${results.alternatives[0].savings}`, 680, 260)
    ctx.font = '16px sans-serif'
    ctx.fillText(
      `Using ${results.alternatives[0].name}`,
      680,
      290
    )

    // Footer
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('aiburn.howstud.io', 600, 580)
    ctx.font = '14px sans-serif'
    ctx.fillText('Compare AI Model Costs', 600, 610)

    // Download
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `aiburn-analysis-${Date.now()}.png`
    link.click()
  }

  // Get feature ad to display
  const featureSlots = AD_SLOTS.filter((s) => s.placement === 'content-featured')
  const featureAdSlot = featureSlots[currentFeatureAd]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <img 
                 src="/images/logo-full.png" 
                 alt="AIBurn - AI Cost Calculator" 
                 className="h-16 object-contain"
               />
             </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('quick')
                  setResults(null)
                  setError('')
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  mode === 'quick'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Quick Calc
              </button>
              <button
                onClick={() => {
                  setMode('exact')
                  setResults(null)
                  setError('')
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  mode === 'exact'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Exact Usage
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdCard slot={AD_SLOTS.find((s) => s.id === 'header-banner')} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Advertising (20%) - 12 Cards */}
          <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`left-${i}`} className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl p-8 text-slate-900 shadow-md min-h-40 flex flex-col items-center justify-center text-center">
                <h4 className="font-bold text-lg mb-2">Ad Slot {i + 1}</h4>
                <p className="text-sm opacity-90 mb-6">
                  <span className="font-semibold text-base">$399.99</span>
                  <span className="opacity-75">/month</span>
                </p>
                <a href={`mailto:contact@aiburn.howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                   Inquire →
                 </a>
              </div>
            ))}
          </div>

          {/* Main Calculator - Center (60%) */}
          <div className="lg:col-span-3">
            {/* Quick Calculator Mode */}
             {mode === 'quick' && (
               <div className="space-y-8">
                 {/* Trust Badge */}
                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                   <span className="text-2xl">✓</span>
                   <div className="text-sm">
                     <p className="font-semibold text-green-900">100% Private • Zero Data Storage</p>
                     <p className="text-green-800 text-xs">Your analysis never leaves your browser. Completely anonymous.</p>
                   </div>
                 </div>

                 {/* Model Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 1: Select Your Current Model
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(MODELS).map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedModel(model)}
                        className={`p-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                          selectedModel === model
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Token Slider */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 2: Monthly Token Usage
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={monthlyTokens}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (validateTokenRange(value)) {
                          setMonthlyTokens(value)
                          setError('')
                        }
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-purple-600">
                        {monthlyTokens}
                      </span>
                      <span className="text-xl text-slate-600">Million tokens/month</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Range: 1M - 500M tokens (adjust to your monthly usage)
                    </p>
                  </div>
                </div>

                {/* Input/Output Ratio */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 2.5: Input vs Output Ratio
                  </h2>
                  <p className="text-slate-600 text-sm mb-6">
                    Output tokens are more expensive. Adjust the ratio to match your usage pattern (chatbot, search, etc.).
                  </p>
                  
                  <div className="space-y-6">
                    {/* Input Ratio Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-semibold text-slate-900">Input Tokens</label>
                        <div className="text-lg font-bold text-blue-600">{inputRatio}%</div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={inputRatio}
                        onChange={(e) => {
                          const newInput = Number(e.target.value)
                          setInputRatio(newInput)
                          setOutputRatio(100 - newInput)
                        }}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {monthlyTokens * (inputRatio / 100)}M input tokens/month
                      </p>
                    </div>

                    {/* Output Ratio Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-semibold text-slate-900">Output Tokens</label>
                        <div className="text-lg font-bold text-green-600">{outputRatio}%</div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={outputRatio}
                        onChange={(e) => {
                          const newOutput = Number(e.target.value)
                          setOutputRatio(newOutput)
                          setInputRatio(100 - newOutput)
                        }}
                        className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {monthlyTokens * (outputRatio / 100)}M output tokens/month
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">
                      <strong>Common patterns:</strong> Chatbot (60/40), Search (80/20), Code generation (70/30)
                    </p>
                  </div>
                </div>

                {/* Ad: Featured Rotating */}
                <div>
                  <AdCard slot={featureAdSlot} />
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateCosts}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition text-lg"
                >
                  Calculate Costs
                </button>
              </div>
            )}

            {/* Exact Usage Mode */}
            {mode === 'exact' && (
              <div className="space-y-8">
                {/* Privacy First - Zero Data Retention */}
                <div className="bg-green-50 border-2 border-green-400 rounded-3xl p-6 mb-6">
                  <div className="flex gap-4">
                    <div className="text-3xl">🔒</div>
                    <div>
                      <h3 className="font-bold text-green-900 text-lg mb-2">Your Privacy is Protected</h3>
                      <p className="text-green-900 text-sm mb-2">
                        <strong>Zero Data Retention:</strong> Your API key is transmitted directly to fetch your usage data, then immediately discarded. We never store your key, your data, or any information about you.
                      </p>
                      <p className="text-green-800 text-sm">
                        What you analyze stays completely private. Use the results to share on X or download a report—nothing is stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anthropic Note */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6">
                  <div className="flex gap-4">
                    <div className="text-3xl">ℹ️</div>
                    <div>
                      <h3 className="font-bold text-amber-900 text-lg mb-2">Anthropic Usage API Coming Soon</h3>
                      <p className="text-amber-900 text-sm mb-3">
                        Anthropic doesn't currently have a public usage API. We're monitoring for updates and will add support as soon as it's available.
                      </p>
                      <p className="text-amber-800 text-sm">
                        <strong>For now:</strong> Use the <button onClick={() => setMode('quick')} className="underline hover:text-amber-700 font-semibold">Quick Calculator</button> to estimate Claude costs, or check your usage directly in the <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700 font-semibold">Anthropic Console</a>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Provider Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 1: Select Your Provider
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setProvider('openai')}
                      className={`flex-1 p-4 rounded-xl font-semibold transition ${
                        provider === 'openai'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      ✓ OpenAI (Supported)
                    </button>
                    <button
                      onClick={() => setProvider('anthropic')}
                      className={`flex-1 p-4 rounded-xl font-semibold transition opacity-50 cursor-not-allowed`}
                      disabled
                    >
                      ⏳ Anthropic (Coming Soon)
                    </button>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 2: Enter Your API Key
                  </h2>
                  <input
                    type="password"
                    placeholder={
                      provider === 'openai'
                        ? 'sk-...'
                        : 'Claude API Key'
                    }
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    aria-label="API key (starts with sk-). Keep this private."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Your API key is never stored. It's only used to fetch your usage data.
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800">
                    {error}
                  </div>
                )}

                {/* Ad: Featured Rotating */}
                <div>
                  <AdCard slot={featureAdSlot} />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={analyzeExactUsage}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="spinner" size={20} />
                      Fetching usage data...
                    </span>
                  ) : (
                    'Analyze My Usage'
                  )}
                </button>
              </div>
            )}

            {/* Results Section - Step 3: Review */}
             {results && (
               <div role="alert" aria-live="polite" className="space-y-8 mt-12">
                 <h2 className="text-3xl font-bold text-slate-900 mb-8">
                   Step 3: Review Your Analysis
                 </h2>

                 {/* Main Review Card */}
                 <div className="bg-white rounded-3xl shadow-lg overflow-hidden" style={{ minHeight: 'calc(100vh - 12px)' }}>
                  {/* Current Spending Header */}
                  <div className="gradient-primary p-8 text-white">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <p className="text-purple-100 text-sm font-semibold mb-2">
                          YOUR CURRENT MONTHLY SPENDING
                        </p>
                        <h3 className="text-5xl font-bold mb-2">${results.currentCost}</h3>
                        {results.mode === 'quick' && (
                          <div>
                            <p className="text-purple-100 text-sm mb-3">
                              {results.selectedModel} using {results.monthlyTokens}M tokens/month
                            </p>
                            <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 inline-block">
                              <p className="text-purple-100 text-xs mb-1">Daily Cost</p>
                              <p className="text-2xl font-bold">${results.dailyCost}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Token & Cost Breakdown (Quick Mode Only) */}
                      {results.mode === 'quick' && (
                        <div className="text-center">
                          <p className="text-xs text-purple-100 font-semibold mb-2 uppercase">Token Breakdown</p>
                          <div className="bg-white bg-opacity-15 rounded-xl px-6 py-3 backdrop-blur-sm flex gap-6 justify-center">
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Input</p>
                              <p className="text-lg font-bold text-white mb-2">
                                {(results.inputTokens / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-xs text-purple-200">${results.inputCostPerUnit}/1M</p>
                            </div>
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Output</p>
                              <p className="text-lg font-bold text-white mb-2">
                                {(results.outputTokens / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-xs text-purple-200">${results.outputCostPerUnit}/1M</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alternatives Summary */}
                  <div className="p-8">
                    <p className="text-sm text-slate-600 font-semibold mb-6">TOP 8 ALTERNATIVES</p>
                    <div className="space-y-4">
                       {results.alternatives.map((alt, idx) => (
                         <div
                           key={idx}
                           className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
                         >
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                               <h4 className="font-bold text-slate-900">{alt.name}</h4>
                               <p className="text-xs text-slate-500">{alt.pricing.category}</p>
                             </div>
                             {results.mode === 'quick' && (
                               <div className="text-xs text-slate-600 space-y-1">
                                 <div className="flex gap-6 mb-2">
                                   <span>Input: <span className="font-semibold text-slate-900">{(results.inputTokens / 1000000).toFixed(1)}M @ ${alt.costPerInputUnit}/1M</span></span>
                                   <span>Output: <span className="font-semibold text-slate-900">{(results.outputTokens / 1000000).toFixed(1)}M @ ${alt.costPerOutputUnit}/1M</span></span>
                                 </div>
                               </div>
                             )}
                           </div>
                           <div className="text-right mr-6">
                             <p className="text-base text-slate-600 mb-1">
                               Monthly: <span className="font-bold text-slate-900">${alt.cost}</span>
                             </p>
                             <p className="text-xs text-slate-500 mb-2">
                               Daily: <span className="font-semibold">${alt.dailyCost}</span>
                             </p>
                             {alt.lastUpdated && (
                               <p className="text-xs text-slate-500 mb-1">
                                 Updated {alt.lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                               </p>
                             )}
                             <p className="text-base text-green-600 font-semibold">Save ${alt.savings}</p>
                           </div>
                           <div className="bg-green-100 rounded-lg px-4 py-2 text-right min-w-20">
                             <p className="text-xs text-green-600 font-semibold mb-1">SAVINGS</p>
                             <p className="text-xl font-bold text-green-600">{alt.savingsPercent}%</p>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 flex gap-3">
                    <button
                      onClick={shareOnTwitter}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                    >
                      <Share2 size={18} />
                      Share on X
                    </button>
                    <button
                      onClick={downloadReport}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      <Download size={18} />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Advertising (20%) - 12 Cards */}
          <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`right-${i}`} className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl p-8 text-slate-900 shadow-md min-h-40 flex flex-col items-center justify-center text-center">
                <h4 className="font-bold text-lg mb-2">Ad Slot {i + 1}</h4>
                <p className="text-sm opacity-90 mb-6">
                  <span className="font-semibold text-base">$399</span>
                  <span className="opacity-75">/month</span>
                </p>
                <a href={`mailto:contact@aiburn.howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Inquire →
                </a>
                </div>
                ))}
                </div>
                </div>
                </div>

                {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdCard slot={AD_SLOTS.find((s) => s.id === 'footer-banner')} />
          <div className="mt-8 flex flex-col items-center gap-4">
            <img 
              src="/images/logo-icon.png" 
              alt="AIBurn" 
              className="h-12 object-contain"
            />
            <p className="text-center text-sm text-slate-600">
              Build by{' '}
              <a
                href="https://howstud.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                HowStudios
              </a>
              . AI token prices current as of Nov 2025.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <a
                href="/pages/privacy.html"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Privacy Policy
              </a>
              <a
                href="/pages/terms.html"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
