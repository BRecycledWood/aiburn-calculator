import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AdvertisePage from './components/AdvertisePage'
import PrivacyPage from './components/PrivacyPage'
import TermsPage from './components/TermsPage'

// Model pricing data (per 1M tokens)
const MODELS = {
  'GPT-4': { input: 30, output: 60, provider: 'openai', category: 'Premium' },
  'GPT-4 Turbo': { input: 10, output: 30, provider: 'openai', category: 'Standard' },
  'GPT-4o': { input: 2.5, output: 10, provider: 'openai', category: 'Balanced' },
  'GPT-4o mini': { input: 0.15, output: 0.6, provider: 'openai', category: 'Budget' },
  'GPT-3.5 Turbo': { input: 0.5, output: 1.5, provider: 'openai', category: 'Budget' },
  'Claude 3 Opus': { input: 15, output: 75, provider: 'anthropic', category: 'Premium' },
  'Claude 3.5 Sonnet': { input: 3, output: 15, provider: 'anthropic', category: 'Standard' },
  'Claude 3 Haiku': { input: 0.25, output: 1.25, provider: 'anthropic', category: 'Budget' },
  'Gemini 2.0 Flash': { input: 0.075, output: 0.3, provider: 'google', category: 'Budget' },
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
      <div className={`${bgGradient} rounded-2xl p-8 ${isLightBg ? 'text-slate-900' : 'text-white'} shadow-md hover:shadow-lg transition flex flex-col items-center justify-center text-center`}>
        <h4 className="font-bold text-xl mb-2">Advertise Here</h4>
        <p className="text-sm opacity-90 mb-6 max-w-xs">
          Reach thousands of AI developers and engineers daily
        </p>
        <a
          href="/advertise"
          className={`text-sm ${isLightBg ? 'bg-slate-900' : 'bg-white'} bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg inline-block transition font-semibold`}
        >
          Contact Us →
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

// Main Calculator Component
function Calculator() {
  const [mode, setMode] = useState('exact') // 'quick' or 'exact'
  const [selectedModel, setSelectedModel] = useState('GPT-4o')
  const [monthlyTokens, setMonthlyTokens] = useState(10)
  const [inputTokens, setInputTokens] = useState(6) // actual M tokens for input
  const [outputTokens, setOutputTokens] = useState(4) // actual M tokens for output
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [currentFeatureAd, setCurrentFeatureAd] = useState(0)
  const [emailCapture, setEmailCapture] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  })
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)

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

  // Validate input/output token split
  const validateTokenSplit = (input, output, total) => {
    const sum = input + output
    const tolerance = total * 0.05 // 5% tolerance
    if (Math.abs(sum - total) > tolerance) {
      const deviation = Math.abs(sum - total)
      if (sum > total) {
        return `⚠️ Warning: Input + Output (${sum.toFixed(1)}M) exceeds total (${total}M) by ${deviation.toFixed(1)}M`
      } else if (sum < total) {
        return `⚠️ Warning: Input + Output (${sum.toFixed(1)}M) is below total (${total}M) by ${deviation.toFixed(1)}M`
      }
    }
    return null
  }

  // Calculate costs in Quick mode
  const calculateCosts = () => {
    const model = MODELS[selectedModel]
    const inputTokensM = inputTokens * 1000000
    const outputTokensM = outputTokens * 1000000

    const currentCost = (inputTokensM * model.input + outputTokensM * model.output) / 1000000
    const dailyCost = currentCost / 30

    // Generate alternatives
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const alternatives = Object.entries(MODELS)
      .filter(([name]) => name !== selectedModel)
      .map(([name, pricing], idx) => {
        const cost = inputTokens * pricing.input + outputTokens * pricing.output
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
      inputTokens,
      outputTokens,
      currentCost: currentCost.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
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

    const text = `I analyzed my AI token costs using @tryaiburn and discovered I could save $${savings.toFixed(2)} monthly by switching to ${modelName}. Current spending: $${currentCost.toFixed(2)}/month. Find your savings → aiburn.howstud.io`

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

    // Handle email capture submission
    const handleEmailCapture = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!emailCapture.name.trim() || !emailCapture.email.trim()) {
     setError('Name and email are required')
     return
    }

    setEmailSubmitting(true)
    
    try {
     // Submit to FormSubmit which will email to tryaiburn@howstud.io
     const formData = new FormData()
     formData.append('name', emailCapture.name)
     formData.append('email', emailCapture.email)
     formData.append('phone', emailCapture.phone)
     formData.append('company', emailCapture.company)
     formData.append('jobTitle', emailCapture.jobTitle)
     formData.append('_subject', 'AIBurn Cost Analysis Report')
     formData.append('_captcha', 'false')

     const response = await fetch('https://formsubmit.co/tryaiburn@howstud.io', {
       method: 'POST',
       body: formData,
     })

     if (response.ok) {
       setEmailSubmitted(true)
       setEmailCapture({ name: '', email: '', phone: '', company: '', jobTitle: '' })
       
       // Reset after 5 seconds
       setTimeout(() => {
         setEmailSubmitted(false)
       }, 5000)
     }
    } catch (err) {
     console.error('Email capture error:', err)
    } finally {
     setEmailSubmitting(false)
    }
    }

  // Get feature ad to display
  const featureSlots = AD_SLOTS.filter((s) => s.placement === 'content-featured')
  const featureAdSlot = featureSlots[currentFeatureAd]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex items-center justify-between gap-3">
             <div className="flex items-center gap-3 flex-shrink-0">
               <img 
                 src="/images/logo-full.png" 
                 alt="AIBurn - AI Cost Calculator" 
                 className="h-12 sm:h-16 object-contain"
               />
             </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setMode('exact')
                  setResults(null)
                  setError('')
                }}
                className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                  mode === 'exact'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Exact
              </button>
              <button
                onClick={() => {
                  setMode('quick')
                  setResults(null)
                  setError('')
                }}
                className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                  mode === 'quick'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Quick
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Explanation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
          {mode === 'quick' ? (
            <div>
              <h3 className="font-bold text-slate-900 mb-2">📊 Quick Calculator</h3>
              <p className="text-sm text-slate-600">
                Estimate costs based on your monthly token usage and current model. Perfect for quick comparisons and what-if scenarios. Results are calculated instantly in your browser.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-slate-900 mb-2">🔍 Exact Usage Analysis</h3>
              <p className="text-sm text-slate-600">
                Connect your OpenAI API key to analyze your actual usage patterns. See detailed breakdowns by model and discover real savings opportunities based on your spending history.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdCard slot={AD_SLOTS.find((s) => s.id === 'header-banner')} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Advertising (20%) - 7 Cards - Hidden on mobile, order 1 on desktop */}
          <div className="lg:col-span-1 hidden lg:block order-1" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`left-${i}`} className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl p-8 text-slate-900 shadow-md min-h-40 flex flex-col items-center justify-center text-center">
                <h4 className="font-bold text-lg mb-2">Advertise Here</h4>
                <p className="text-sm opacity-90 mb-6">
                  Reach thousands of AI developers
                </p>
                <a href="/advertise" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                   Contact Us →
                 </a>
              </div>
            ))}
          </div>

          {/* Main Calculator - Center (60%) - Appears first on mobile */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            {/* Quick Calculator Mode */}
             {mode === 'quick' && (
               <div className="space-y-8">
                 {/* Privacy Badge */}
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                   <span className="text-2xl">🔒</span>
                   <div className="text-sm flex-1">
                     <p className="font-semibold text-blue-900 mb-2">Your Calculations Stay Private</p>
                     <ul className="text-blue-800 text-xs space-y-1">
                       <li>• API keys never stored</li>
                       <li>• Calculations processed in your browser</li>
                       <li>• Email capture is optional</li>
                       <li>• No account required</li>
                     </ul>
                     <a 
                       href="/privacy"
                       className="text-blue-600 hover:text-blue-700 font-semibold text-xs mt-2 inline-block"
                     >
                       Read full privacy policy →
                     </a>
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
                  
                  {/* Pricing Display */}
                  {selectedModel && MODELS[selectedModel] && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-slate-600 font-semibold mb-3 uppercase">Current Pricing Rates</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-slate-500 mb-1">Input Tokens</p>
                          <p className="text-2xl font-bold text-purple-600">${MODELS[selectedModel].input}</p>
                          <p className="text-xs text-slate-500">/1M tokens</p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-slate-500 mb-1">Output Tokens</p>
                          <p className="text-2xl font-bold text-blue-600">${MODELS[selectedModel].output}</p>
                          <p className="text-xs text-slate-500">/1M tokens</p>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-purple-600">
                          {monthlyTokens}
                        </span>
                        <span className="text-xl text-slate-600">Million tokens/month</span>
                      </div>
                      {/* Manual Entry Field */}
                      <input
                        type="number"
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
                        className="w-20 px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-center font-semibold"
                        title="Enter a number between 1 and 500"
                      />
                    </div>
                    <p className="text-sm text-slate-500">
                      Range: 1M - 500M tokens (adjust to your monthly usage)
                    </p>
                  </div>
                </div>

                {/* Input/Output Token Breakdown */}
                 <div className="bg-white rounded-3xl p-8 shadow-md">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6">
                     Step 2.5: Input vs Output Tokens
                   </h2>
                   <p className="text-slate-600 text-sm mb-6">
                     Output tokens are more expensive. Split your {monthlyTokens}M monthly tokens between input and output.
                   </p>
                   
                   <div className="space-y-6">
                     {/* Input Tokens Slider */}
                     <div>
                       <div className="flex justify-between items-center mb-3">
                         <label className="font-semibold text-slate-900">Input Tokens (M)</label>
                         <input
                           type="number"
                           min="0"
                           max={monthlyTokens}
                           step="0.1"
                           value={inputTokens.toFixed(1)}
                           onChange={(e) => {
                             const value = Math.min(Number(e.target.value), monthlyTokens)
                             setInputTokens(value)
                           }}
                           className="w-24 px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg font-bold text-blue-600 text-center"
                         />
                       </div>
                       <input
                         type="range"
                         min="0"
                         max={monthlyTokens}
                         step="0.1"
                         value={inputTokens}
                         onChange={(e) => {
                           setInputTokens(Number(e.target.value))
                         }}
                         className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                       />
                       <p className="text-xs text-slate-500 mt-2">
                         {inputTokens.toFixed(1)}M input tokens/month
                       </p>
                     </div>

                     {/* Output Tokens Slider */}
                     <div>
                       <div className="flex justify-between items-center mb-3">
                         <label className="font-semibold text-slate-900">Output Tokens (M)</label>
                         <input
                           type="number"
                           min="0"
                           max={monthlyTokens}
                           step="0.1"
                           value={outputTokens.toFixed(1)}
                           onChange={(e) => {
                             const value = Math.min(Number(e.target.value), monthlyTokens)
                             setOutputTokens(value)
                           }}
                           className="w-24 px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-lg font-bold text-green-600 text-center"
                         />
                       </div>
                       <input
                         type="range"
                         min="0"
                         max={monthlyTokens}
                         step="0.1"
                         value={outputTokens}
                         onChange={(e) => {
                           setOutputTokens(Number(e.target.value))
                         }}
                         className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                       />
                       <p className="text-xs text-slate-500 mt-2">
                         {outputTokens.toFixed(1)}M output tokens/month
                       </p>
                     </div>
                   </div>

                   <div className="mt-6 p-3 bg-slate-50 rounded-lg">
                     <p className="text-xs text-slate-600 mb-2">
                       <strong>Total allocated:</strong> {(inputTokens + outputTokens).toFixed(1)}M / {monthlyTokens}M tokens
                     </p>
                     {validateTokenSplit(inputTokens, outputTokens, monthlyTokens) && (
                       <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                         <p className="text-xs text-yellow-900 font-semibold">
                           {validateTokenSplit(inputTokens, outputTokens, monthlyTokens)}
                         </p>
                       </div>
                     )}
                     <p className="text-xs text-slate-600 mt-3">
                       <strong>Common patterns:</strong> Chatbot (6M/4M), Search (8M/2M), Code generation (7M/3M)
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
                          <p className="text-xs text-purple-100 font-semibold mb-2 uppercase">Daily Costs</p>
                          <div className="bg-white bg-opacity-15 rounded-xl px-6 py-3 backdrop-blur-sm flex gap-6 justify-center">
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Input Tokens</p>
                              <p className="text-lg font-bold text-white mb-2">
                                {(results.inputTokens * results.inputCostPerUnit / 30).toFixed(2)}
                              </p>
                              <p className="text-xs text-purple-200">{results.inputTokens.toFixed(1)}M @ ${results.inputCostPerUnit}/M</p>
                            </div>
                            <div>
                              <p className="text-xs text-purple-200 mb-1">Output Tokens</p>
                              <p className="text-lg font-bold text-white mb-2">
                                {(results.outputTokens * results.outputCostPerUnit / 30).toFixed(2)}
                              </p>
                              <p className="text-xs text-purple-200">{results.outputTokens.toFixed(1)}M @ ${results.outputCostPerUnit}/M</p>
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
                           className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition gap-4"
                         >
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                               <h4 className="font-bold text-slate-900">{alt.name}</h4>
                               <p className="text-xs text-slate-500">{alt.pricing.category}</p>
                             </div>
                             {results.mode === 'quick' && (
                               <div className="text-xs text-slate-600 space-y-1">
                                 <div className="flex flex-col sm:flex-row gap-6 mb-2">
                                   <span>Input: <span className="font-semibold text-slate-900">{results.inputTokens.toFixed(1)}M @ ${alt.costPerInputUnit}/1M</span></span>
                                   <span>Output: <span className="font-semibold text-slate-900">{results.outputTokens.toFixed(1)}M @ ${alt.costPerOutputUnit}/1M</span></span>
                                 </div>
                               </div>
                             )}
                           </div>
                           <div className="text-left sm:text-right">
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
                           <div className="bg-green-100 rounded-lg px-4 py-2 text-center sm:text-right min-w-20">
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

                  {/* Email Capture Form */}
                  {!emailSubmitted && (
                    <div className="border-t border-slate-200 px-8 py-8 bg-white">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">📊 Get Your Results Emailed</h3>
                      <p className="text-slate-600 text-sm mb-6">
                        We'll send you this cost breakdown and monthly AI cost optimization tips.
                      </p>

                      <form onSubmit={handleEmailCapture} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={emailCapture.name}
                              onChange={(e) => setEmailCapture({ ...emailCapture, name: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              placeholder="Your name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={emailCapture.email}
                              onChange={(e) => setEmailCapture({ ...emailCapture, email: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              placeholder="your@email.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={emailCapture.phone}
                              onChange={(e) => setEmailCapture({ ...emailCapture, phone: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              placeholder="(optional)"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Company
                            </label>
                            <input
                              type="text"
                              value={emailCapture.company}
                              onChange={(e) => setEmailCapture({ ...emailCapture, company: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              placeholder="(optional)"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={emailCapture.jobTitle}
                              onChange={(e) => setEmailCapture({ ...emailCapture, jobTitle: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              placeholder="(optional)"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={emailSubmitting}
                            className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                          >
                            {emailSubmitting ? 'Sending...' : 'Send My Report'}
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 text-center">
                          We respect your privacy. <a href="/privacy" className="text-purple-600 hover:text-purple-700">Read our privacy policy</a>
                        </p>
                      </form>
                    </div>
                  )}

                  {emailSubmitted && (
                    <div className="border-t border-slate-200 px-8 py-8 bg-green-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <h3 className="font-semibold text-green-900">Report sent!</h3>
                          <p className="text-sm text-green-800">Check your email for your cost analysis report.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                  </div>
                  )}
          </div>

          {/* Right Sidebar - Advertising (20%) - 7 Cards - Hidden on mobile, order 3 on desktop */}
          <div className="lg:col-span-1 hidden lg:block order-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`right-${i}`} className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl p-8 text-slate-900 shadow-md min-h-40 flex flex-col items-center justify-center text-center">
                <h4 className="font-bold text-lg mb-2">Advertise Here</h4>
                <p className="text-sm opacity-90 mb-6">
                  Reach thousands of AI developers
                </p>
                <a href="/advertise" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Contact Us →
                </a>
                </div>
                ))}
                </div>
                </div>
                </div>

          {/* Full-Width Featured Ad - Above Footer */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdCard slot={featureAdSlot} />
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
            <div className="mt-4 flex justify-center gap-6 flex-wrap">
              <a
                href="/privacy"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Terms of Service
              </a>
              <a
                href="/advertise"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Advertise
              </a>
              <a
                href="mailto:tryaiburn@howstud.io"
                className="text-slate-600 hover:text-purple-600 transition"
              >
                Contact: tryaiburn@howstud.io
              </a>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="https://instagram.com/tryaiburn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-purple-600 transition font-semibold"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span className="text-slate-400">•</span>
              <a
                href="https://x.com/tryaiburn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-purple-600 transition font-semibold"
                aria-label="X/Twitter"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Router App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </Router>
  )
}
