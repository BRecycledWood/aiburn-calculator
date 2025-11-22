import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Zap, AlertCircle, ExternalLink, Info, Download, Share2 } from 'lucide-react';

export default function AITokenCalculator() {
  const [mode, setMode] = useState('quick'); // 'quick' or 'exact'
  const [selectedModel, setSelectedModel] = useState('');
  const [monthlyTokens, setMonthlyTokens] = useState(50000000);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // SPONSOR CONFIGURATION - Edit this array to manage ads
  const sponsors = [
    {
      id: 1,
      name: "Your Product Here",
      tagline: "Reach 10k+ AI founders monthly",
      url: "mailto:ads@howstud.io",
      logo: "💰",
      active: true,
      price: 299,
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 2,
      name: "Available Slot",
      tagline: "Get your product in front of AI builders",
      url: "mailto:ads@howstud.io",
      logo: "🎯",
      active: true,
      price: 499,
      color: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      name: "Premium Spot",
      tagline: "Featured placement for serious sponsors",
      url: "mailto:ads@howstud.io",
      logo: "⭐",
      active: true,
      price: 699,
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Comprehensive pricing data (per 1M tokens) - Updated Nov 2025
  const models = {
    'gpt-4': { 
      name: 'GPT-4',
      provider: 'OpenAI',
      input: 30, 
      output: 60,
      quality: 'Highest',
      speed: 'Slow',
      url: 'https://openai.com/pricing'
    },
    'gpt-4-turbo': { 
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      input: 10, 
      output: 30,
      quality: 'High',
      speed: 'Fast',
      url: 'https://openai.com/pricing'
    },
    'gpt-4o': { 
      name: 'GPT-4o',
      provider: 'OpenAI',
      input: 2.5, 
      output: 10,
      quality: 'High',
      speed: 'Very Fast',
      url: 'https://openai.com/pricing'
    },
    'gpt-3.5-turbo': { 
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      input: 0.5, 
      output: 1.5,
      quality: 'Good',
      speed: 'Very Fast',
      url: 'https://openai.com/pricing'
    },
    'claude-opus': { 
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      input: 15, 
      output: 75,
      quality: 'Highest',
      speed: 'Medium',
      url: 'https://anthropic.com/pricing'
    },
    'claude-sonnet': { 
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      input: 3, 
      output: 15,
      quality: 'High',
      speed: 'Fast',
      url: 'https://anthropic.com/pricing'
    },
    'claude-haiku': { 
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      input: 0.25, 
      output: 1.25,
      quality: 'Good',
      speed: 'Very Fast',
      url: 'https://anthropic.com/pricing'
    },
    'groq-llama': { 
      name: 'Llama 3.1 70B (Groq)',
      provider: 'Groq',
      input: 0.05, 
      output: 0.08,
      quality: 'Good',
      speed: 'Extremely Fast',
      url: 'https://groq.com/pricing'
    },
    'deepseek-chat': { 
      name: 'DeepSeek Chat',
      provider: 'DeepSeek',
      input: 0.14, 
      output: 0.28,
      quality: 'Good',
      speed: 'Fast',
      url: 'https://deepseek.com/pricing'
    }
  };

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    const activeSponsors = sponsors.filter(s => s.active);
    if (activeSponsors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeSponsors.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activeSponsors = sponsors.filter(s => s.active);
  const currentAd = activeSponsors[currentAdIndex] || sponsors[0];

  const calculateCosts = () => {
    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate loading for better UX
    setTimeout(() => {
      const inputTokens = monthlyTokens;
      const outputTokens = Math.floor(monthlyTokens * 0.3); // Typical ratio

      const currentModelData = models[selectedModel];
      const currentCost = (inputTokens / 1000000) * currentModelData.input + 
                         (outputTokens / 1000000) * currentModelData.output;

      // Calculate all alternatives
      const alternatives = Object.entries(models)
        .filter(([key]) => key !== selectedModel)
        .map(([key, model]) => {
          const altCost = (inputTokens / 1000000) * model.input + 
                         (outputTokens / 1000000) * model.output;
          return {
            key,
            model,
            cost: altCost,
            savings: currentCost - altCost,
            savingsPercent: ((currentCost - altCost) / currentCost * 100).toFixed(1)
          };
        })
        .sort((a, b) => b.savings - a.savings);

      setResults({
        inputTokens,
        outputTokens,
        currentCost,
        currentModel: currentModelData,
        currentModelKey: selectedModel,
        alternatives,
        mode: 'quick'
      });

      setLoading(false);
    }, 1000);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatTokens = (tokens) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    return formatNumber(tokens);
  };

  const downloadReport = () => {
    // This would generate a PNG/PDF - for now, just alert
    alert('Download feature coming soon! For now, take a screenshot of your results.');
  };

  const shareOnTwitter = () => {
    if (!results) return;
    const text = `I just checked my AI costs 🤯\n\nCurrent: ${formatCurrency(results.currentCost)}/mo\nCould save: ${formatCurrency(results.alternatives[0].savings)}/mo\n\nCheck yours:`;
    const url = 'https://aiburn.howstud.io';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                AI Token Cost Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compare AI model costs and find out if you're overpaying. Most devs waste $500-2000/month on expensive models.
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-4 mb-8 bg-white rounded-2xl p-2 shadow-lg max-w-md mx-auto">
              <button
                onClick={() => setMode('quick')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  mode === 'quick'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Quick Calculator
              </button>
              <button
                onClick={() => setMode('exact')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  mode === 'exact'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Exact Usage
              </button>
            </div>

            {/* Quick Calculator */}
            {mode === 'quick' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Which model are you currently using?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(models).map(([key, model]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedModel(key)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedModel === key
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-bold text-gray-900">{model.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{model.provider}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            ${model.input}/${model.output} per 1M tokens
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated monthly tokens (combined input + output)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1000000"
                        max="200000000"
                        step="1000000"
                        value={monthlyTokens}
                        onChange={(e) => setMonthlyTokens(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">1M tokens</span>
                        <span className="font-bold text-purple-600">{formatTokens(monthlyTokens)} tokens/month</span>
                        <span className="text-gray-500">200M tokens</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        ~{formatNumber(monthlyTokens * 0.75)} words or ~{formatNumber(monthlyTokens / 500)} pages of text
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={calculateCosts}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Calculating...' : 'Calculate My Costs'}
                  </button>
                </div>
              </div>
            )}

            {/* Exact Usage Mode */}
            {mode === 'exact' && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <strong>Coming Soon:</strong> Connect your OpenAI or Anthropic account to analyze your exact usage across all models.
                        For now, use the Quick Calculator above.
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      API Key (Read-Only Access)
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-... (feature in development)"
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                  >
                    Feature Coming Soon
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-6">
                
                {/* Current Usage */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-6">Your Current Costs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-purple-200 text-sm font-semibold mb-1">Monthly Cost</div>
                      <div className="text-4xl font-bold">{formatCurrency(results.currentCost)}</div>
                    </div>
                    <div>
                      <div className="text-purple-200 text-sm font-semibold mb-1">Input Tokens</div>
                      <div className="text-4xl font-bold">{formatTokens(results.inputTokens)}</div>
                    </div>
                    <div>
                      <div className="text-purple-200 text-sm font-semibold mb-1">Output Tokens</div>
                      <div className="text-4xl font-bold">{formatTokens(results.outputTokens)}</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{results.currentModel.name}</div>
                        <div className="text-sm text-purple-200">{results.currentModel.provider} • {results.currentModel.quality} Quality • {results.currentModel.speed} Speed</div>
                      </div>
                      <a 
                        href={results.currentModel.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
                      >
                        Verify Pricing →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={shareOnTwitter}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Share on 𝕏
                  </button>
                  <button
                    onClick={downloadReport}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download Report
                  </button>
                </div>

                {/* Alternatives */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">How Much You Could Save</h2>
                      <p className="text-sm text-gray-500">Sorted by highest savings first</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {results.alternatives.map((alt, idx) => (
                      <div key={idx} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-purple-300 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{alt.model.name}</h3>
                            <p className="text-sm text-gray-500">{alt.model.provider} • {alt.model.quality} Quality • {alt.model.speed} Speed</p>
                            <p className="text-xs text-gray-400 mt-1">
                              ${alt.model.input} input / ${alt.model.output} output per 1M tokens
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(alt.cost)}</div>
                            <div className="text-sm text-gray-500">per month</div>
                          </div>
                        </div>
                        {alt.savings > 0 ? (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-green-900">Save {formatCurrency(alt.savings)}/month</span>
                            </div>
                            <span className="text-green-700 font-bold text-lg">{alt.savingsPercent}% cheaper</span>
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                            <span className="text-red-600 font-semibold">{formatCurrency(Math.abs(alt.savings))}/mo more expensive</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Pricing Table (Always visible) */}
            <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Model Pricing Reference</h3>
              <p className="text-sm text-gray-500 mb-6">All prices per 1 million tokens • Last updated: November 2025</p>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Input</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Output</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(models).map(([key, model]) => (
                      <tr key={key} className="border-b border-gray-100 hover:bg-purple-50 transition-all">
                        <td className="py-3 px-4 font-semibold text-gray-900">{model.name}</td>
                        <td className="py-3 px-4 text-gray-600">{model.provider}</td>
                        <td className="py-3 px-4 text-right font-mono text-gray-900">${model.input}</td>
                        <td className="py-3 px-4 text-right font-mono text-gray-900">${model.output}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${
                            model.quality === 'Highest' ? 'bg-purple-100 text-purple-700' :
                            model.quality === 'High' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {model.quality}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar - Sponsors */}
          <div className="lg:w-80 space-y-6">
            
            {/* Rotating Ad */}
            <div className={`bg-gradient-to-br ${currentAd.color} rounded-3xl shadow-xl p-6 text-white transition-all duration-500`}>
              <div className="text-xs font-bold uppercase tracking-wide mb-3 opacity-80">
                Sponsored
              </div>
              <div className="text-5xl mb-4">{currentAd.logo}</div>
              <h3 className="text-2xl font-bold mb-2">{currentAd.name}</h3>
              <p className="text-white/90 mb-4">{currentAd.tagline}</p>
              <a 
                href={currentAd.url}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Ad Slots Available */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Advertise Here
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Reach 10,000+ AI founders and developers monthly
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Starting at:</span>
                  <span className="font-bold text-gray-900">$299/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Slots available:</span>
                  <span className="font-bold text-purple-600">3</span>
                </div>
              </div>
              <a
                href="mailto:ads@howstud.io"
                className="block w-full text-center bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
              >
                Buy Ad Slot
              </a>
            </div>

            {/* Other Tools */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Other Tools</h3>
              <a 
                href="https://howstud.io"
                className="block mb-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="font-semibold">Howstud.io</div>
                <div className="text-sm text-gray-300">AI Studio & Consulting</div>
              </a>
              <a 
                href="https://receptionist.howstud.io"
                className="block p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="font-semibold">AI Receptionist ROI</div>
                <div className="text-sm text-gray-300">Calculate your savings</div>
              </a>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          Built by <a href="https://howstud.io" className="text-purple-600 font-semibold hover:underline">Howstud.io</a> 
          {" "} | Follow on <a href="https://x.com/howstudio" className="text-purple-600 font-semibold hover:underline">𝕏</a>
          {" "} | Pricing last updated: November 2025
        </div>

      </div>
    </div>
  );
}