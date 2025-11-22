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
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { usePrices } from './hooks/usePrices'

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
          href="mailto:ads@howstud.io?subject=Advertising%20Inquiry%20-%20{slot.name}"
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

// Price Warning Component
function PriceWarning({ isStale, lastUpdated, formatTimestamp, onRefresh, isRefreshing }) {
  if (!isStale) return null

  const ageText = lastUpdated ? `Last updated ${formatTimestamp(lastUpdated)}` : 'Unknown last update'

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 mb-6">
      <div className="flex gap-4">
        <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-amber-900 text-lg mb-2">
            Pricing Data is Outdated
          </h3>
          <p className="text-amber-900 text-sm mb-4">
            {ageText}. Prices may have changed. Please refresh to get the latest data.
          </p>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {isRefreshing ? (
              <>
                <Loader size={16} className="animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh Prices Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Price Loading State
function PriceLoadingState() {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-4">
        <Loader size={24} className="text-blue-600 animate-spin" />
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Loading prices...</h3>
          <p className="text-blue-800 text-sm">Fetching latest AI model pricing data</p>
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function App() {
  const { prices, loading, error, lastUpdated, isStale, refresh, formatTimestamp, getPriceAge, getCalculatorModels } = usePrices()
  const [mode, setMode] = useState('quick')
  const [selectedModel, setSelectedModel] = useState('GPT-4o')
  const [monthlyTokens, setMonthlyTokens] = useState(10)
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [calculatorLoading, setCalculatorLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [calcError, setCalcError] = useState('')
  const [currentFeatureAd, setCurrentFeatureAd] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get models from prices or use fallback
  const MODELS = getCalculatorModels() || {
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

  // Rotate featured ads
  useEffect(() => {
    if (mode !== 'quick') return

    const timer = setInterval(() => {
      const featureSlots = AD_SLOTS.filter((s) => s.placement === 'content-featured')
      setCurrentFeatureAd((prev) => (prev + 1) % featureSlots.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [mode])

  // Handle price refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }

  // Calculate costs in Quick mode
  const calculateCosts = () => {
    const model = MODELS[selectedModel]
    if (!model) {
      setCalcError('Model not found')
      return
    }

    const tokens = monthlyTokens * 1000000
    const inputTokens = tokens * 0.6
    const outputTokens = tokens * 0.4

    const currentCost = (inputTokens * model.input + outputTokens * model.output) / 1000000

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const alternatives = Object.entries(MODELS)
      .filter(([name]) => name !== selectedModel)
      .map(([name, pricing], idx) => {
        const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000
        const savings = currentCost - cost
        const savingsPercent = ((savings / currentCost) * 100).toFixed(1)
        const lastUpdatedDate = idx < 3 ? now : weekAgo
        return {
          name,
          cost: cost.toFixed(2),
          savings: savings.toFixed(2),
          savingsPercent,
          pricing,
          lastUpdated: lastUpdatedDate,
        }
      })
      .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))

    setResults({
      mode: 'quick',
      selectedModel,
      monthlyTokens,
      currentCost: currentCost.toFixed(2),
      inputTokens: Math.floor(inputTokens),
      outputTokens: Math.floor(outputTokens),
      alternatives: alternatives.slice(0, 8),
      priceLastUpdated: lastUpdated,
    })

    setCalcError('')
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
      setCalcError('Please enter a valid API key')
      return
    }

    setCalculatorLoading(true)
    setCalcError('')

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

      let totalCost = 0
      const modelBreakdown = {}

      if (provider === 'openai') {
        const usage = parseOpenAIUsage(data)
        Object.entries(usage).forEach(([modelName, usage]) => {
          totalCost += usage.cost
          modelBreakdown[modelName] = {
            cost: usage.cost.toFixed(2),
            percent: 0,
          }
        })
      }

      Object.keys(modelBreakdown).forEach((model) => {
        modelBreakdown[model].percent = (
          (parseFloat(modelBreakdown[model].cost) / totalCost) *
          100
        ).toFixed(1)
      })

      const alternatives = Object.entries(MODELS)
        .map(([name, pricing]) => {
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
        priceLastUpdated: lastUpdated,
      })
    } catch (err) {
      setCalcError(err.message)
    } finally {
      setCalculatorLoading(false)
    }
  }

  // Share on Twitter
  const shareOnTwitter = () => {
    if (!results) return

    const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${results.alternatives[0].savings} monthly by switching to ${results.alternatives[0].name}. Current spending: $${results.currentCost}/month. Check the ROI on your AI stack → aiburn.howstud.io`

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

    const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
    gradient.addColorStop(0, '#9333ea')
    gradient.addColorStop(1, '#3b82f6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1200, 630)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('AI Token Cost Analysis', 600, 80)

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
      ctx.fillText(`Model: ${results.selectedModel}`, 80, 350)
      ctx.fillText(`Tokens: ${(results.monthlyTokens / 1000000).toFixed(2)}M`, 80, 380)
    }

    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
    ctx.fillRect(650, 140, 500, 400)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Potential Savings', 680, 190)
    ctx.font = 'bold 48px sans-serif'
    ctx.fillText(`$${results.alternatives[0].savings}`, 680, 260)
    ctx.font = '16px sans-serif'
    ctx.fillText(`Using ${results.alternatives[0].name}`, 680, 290)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('aiburn.howstud.io', 600, 580)
    ctx.font = '14px sans-serif'
    ctx.fillText('Compare AI Model Costs', 600, 610)

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `aiburn-analysis-${Date.now()}.png`
    link.click()
  }

  const featureSlots = AD_SLOTS.filter((s) => s.placement === 'content-featured')
  const featureAdSlot = featureSlots[currentFeatureAd]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-xl font-bold text-white">🔥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  AIBurn
                </h1>
                <p className="text-slate-600 text-xs">
                  Optimize your AI costs
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('quick')
                  setResults(null)
                  setCalcError('')
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
                  setCalcError('')
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

      {/* Price Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <PriceLoadingState />}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 mb-6">
            <div className="flex gap-4">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-2">
                  Error Loading Prices
                </h3>
                <p className="text-red-800 text-sm mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        {!loading && !error && (
          <PriceWarning
            isStale={isStale}
            lastUpdated={lastUpdated}
            formatTimestamp={formatTimestamp}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}
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
                <a href="mailto:ads@howstud.io" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
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
                      max="200"
                      value={monthlyTokens}
                      onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-purple-600">
                        {monthlyTokens}
                      </span>
                      <span className="text-xl text-slate-600">Million tokens/month</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Range: 1M - 200M tokens (adjust to your monthly usage)
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Your API key is never stored. It's only used to fetch your usage data.
                  </p>
                </div>

                {/* Error Display */}
                {calcError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800">
                    {calcError}
                  </div>
                )}

                {/* Ad: Featured Rotating */}
                <div>
                  <AdCard slot={featureAdSlot} />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={analyzeExactUsage}
                  disabled={calculatorLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition text-lg disabled:opacity-50"
                >
                  {calculatorLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={20} />
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
              <div className="space-y-8 mt-12">
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
                          <p className="text-purple-100 text-sm">
                            {results.selectedModel} using {results.monthlyTokens}M tokens/month
                          </p>
                        )}
                        {results.priceLastUpdated && (
                          <p className="text-xs text-purple-200 mt-2">
                            Prices updated {formatTimestamp(results.priceLastUpdated)}
                          </p>
                        )}
                      </div>

                      {/* Token Breakdown Inline (Quick Mode Only) */}
                      {results.mode === 'quick' && (
                        <div className="text-center">
                          <p className="text-xs text-purple-100 font-semibold mb-2 uppercase">Token Breakdown</p>
                          <div className="bg-white bg-opacity-15 rounded-xl px-6 py-3 backdrop-blur-sm flex gap-8 justify-center">
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Input</p>
                              <p className="text-lg font-bold text-white">
                                {(results.inputTokens / 1000000).toFixed(1)}M
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Output</p>
                              <p className="text-lg font-bold text-white">
                                {(results.outputTokens / 1000000).toFixed(1)}M
                              </p>
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
                            <p className="text-xs text-slate-500 mb-2">Token Breakdown</p>
                            {results.mode === 'quick' && (
                              <div className="text-sm text-slate-600 flex gap-6">
                                <span>Input: <span className="font-semibold text-slate-900">{(results.inputTokens / 1000000).toFixed(1)}M</span></span>
                                <span>Output: <span className="font-semibold text-slate-900">{(results.outputTokens / 1000000).toFixed(1)}M</span></span>
                              </div>
                            )}
                          </div>
                          <div className="text-right mr-6">
                            <p className="text-base text-slate-600 mb-1">Cost: <span className="font-bold text-slate-900">${alt.cost}</span></p>
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
                <a href="mailto:ads@howstud.io" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
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
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              Build by{' '}
              <a
                href="https://howstud.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                HowStudios
              </a>
              . AI token prices current as of {lastUpdated ? formatTimestamp(lastUpdated) : 'Nov 2025'}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
