import { useState } from 'react'

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setShowSuccess(false)
    setShowError(false)

    try {
      // TODO: Integrate with form submission service
      // For now, just show success message
      console.log('Form data:', formData)
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      })
      setShowSuccess(true)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <a href="/">
              <img 
                src="/images/logo-full.png" 
                alt="AIBurn" 
                className="h-16 object-contain"
              />
            </a>
            <a href="/" className="text-purple-600 hover:text-purple-700 font-semibold">← Back to Calculator</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Reach Thousands of AI Developers
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            AIBurn is the trusted cost calculator for AI engineers. Advertise your tools to developers actively optimizing their AI stack.
          </p>
        </section>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          
          {/* Left Column: Who Sees Ads */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Who Sees Your Ads</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👨‍💻</div>
                  <div>
                    <p className="font-semibold text-slate-900">AI Engineers</p>
                    <p className="text-sm text-slate-600">Building and deploying AI applications</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏢</div>
                  <div>
                    <p className="font-semibold text-slate-900">Product Managers</p>
                    <p className="text-sm text-slate-600">Planning AI infrastructure</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <p className="font-semibold text-slate-900">Decision Makers</p>
                    <p className="text-sm text-slate-600">Optimizing AI costs and tools</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🚀</div>
                  <div>
                    <p className="font-semibold text-slate-900">Founders & CTOs</p>
                    <p className="text-sm text-slate-600">Building AI-first companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: What You Get */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* What You Get */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Get</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                      <p className="font-semibold text-slate-900">Real-Time Analytics</p>
                      <p className="text-sm text-slate-600">Impressions, clicks, CTR, conversions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="font-semibold text-slate-900">Targeted Audience</p>
                      <p className="text-sm text-slate-600">High-intent AI developers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl">📈</span>
                    <div>
                      <p className="font-semibold text-slate-900">Monthly Reports</p>
                      <p className="text-sm text-slate-600">Detailed performance breakdown</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl">🔗</span>
                    <div>
                      <p className="font-semibold text-slate-900">UTM Tracking</p>
                      <p className="text-sm text-slate-600">Measure ROI and conversions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Dashboard */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-md p-8">
                <h3 className="font-bold text-slate-900 mb-4">Sample Analytics Dashboard</h3>
                <a href="/advertiser-dashboard-mockup.html" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-semibold underline">
                  View Full Example →
                </a>
                <p className="text-xs text-slate-600 mt-3">Track your campaign performance in real-time</p>
              </div>
            </div>
          </div>

          {/* Right Column: Ad Placements */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Ad Placements</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-purple-600 pl-4 py-2">
                  <h3 className="font-bold text-slate-900">Header Banner</h3>
                  <p className="text-sm text-slate-600">Full width, top placement</p>
                  <p className="text-xs text-slate-500 mt-1">100% visibility</p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="font-bold text-slate-900">Sidebar Ads</h3>
                  <p className="text-sm text-slate-600">Fixed scroll, high engagement</p>
                  <p className="text-xs text-slate-500 mt-1">24 slot network</p>
                </div>

                <div className="border-l-4 border-green-600 pl-4 py-2">
                  <h3 className="font-bold text-slate-900">In-Content</h3>
                  <p className="text-sm text-slate-600">Between calculation results</p>
                  <p className="text-xs text-slate-500 mt-1">High intent moment</p>
                </div>

                <div className="border-l-4 border-orange-600 pl-4 py-2">
                  <h3 className="font-bold text-slate-900">Footer Banner</h3>
                  <p className="text-sm text-slate-600">Bottom placement</p>
                  <p className="text-xs text-slate-500 mt-1">Engaged users</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <a href="/text-ad-mockups.html" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 font-semibold underline">
                    View Ad Specifications →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-lg text-white p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">AIBurn By The Numbers</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-purple-100">Monthly Visitors</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">9</div>
              <p className="text-purple-100">AI Models Covered</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <p className="text-purple-100">Privacy Focused</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-white rounded-3xl shadow-md p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Get Started</h2>
          <p className="text-lg text-slate-600 mb-8 text-center">
            Fill out the form below and we'll be in touch within 24 hours to discuss your advertising goals.
          </p>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">✓ Thank you! Your inquiry has been submitted successfully.</p>
              <p className="text-green-700 text-sm mt-1">We'll review your request and get back to you within 24 hours.</p>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">✗ Something went wrong. Please try again.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Your Name *
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Company */}
              <div className="md:col-span-2">
                <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                  Company Name *
                </label>
                <input 
                  type="text" 
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme AI Tools"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                Message *
              </label>
              <textarea 
                id="message"
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your product and which ad placements interest you..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button 
                type="submit"
                disabled={loading}
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-12 rounded-2xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Inquiry →'}
              </button>
              <p className="text-sm text-slate-600 mt-4">
                Or email directly: <a href="mailto:tryaiburn@howstud.io" className="text-purple-600 hover:text-purple-700 font-semibold">tryaiburn@howstud.io</a>
              </p>
            </div>
          </form>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white rounded-2xl shadow-md p-6 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-lg flex justify-between items-center">
                What ad formats do you accept?
                <span className="text-slate-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">
                We accept text-based ads with custom branding. All ads are optimized for web display. Please see our <a href="/text-ad-mockups.html" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-semibold">Ad Specifications guide</a> for detailed requirements.
              </p>
            </details>

            <details className="bg-white rounded-2xl shadow-md p-6 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-lg flex justify-between items-center">
                What's the minimum commitment?
                <span className="text-slate-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">
                We offer flexible monthly placements with a 1-month minimum commitment. You can pause, modify, or extend your campaign at any time. Contact us to discuss custom arrangements.
              </p>
            </details>

            <details className="bg-white rounded-2xl shadow-md p-6 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-lg flex justify-between items-center">
                Do you provide analytics and reporting?
                <span className="text-slate-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">
                Yes! Every advertiser gets access to a private analytics dashboard showing impressions, clicks, click-through rates, and conversions. We provide monthly reports and support UTM parameter tracking for ROI measurement.
              </p>
            </details>

            <details className="bg-white rounded-2xl shadow-md p-6 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-lg flex justify-between items-center">
                How can I track conversions from my ads?
                <span className="text-slate-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">
                We support UTM parameters and custom tracking links so you can measure conversions on your end.
              </p>
            </details>

            <details className="bg-white rounded-2xl shadow-md p-6 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-lg flex justify-between items-center">
                What's the typical response time?
                <span className="text-slate-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">
                We aim to respond to all inquiries within 24 hours. After we confirm interest, we'll work with you to finalize details, provide pricing, and get your campaign live within 5-7 business days.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-4">
              © 2025 AIBurn. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 flex-wrap mb-4">
              <a href="/" className="text-slate-600 hover:text-purple-600 transition">Home</a>
              <a href="/privacy" className="text-slate-600 hover:text-purple-600 transition">Privacy Policy</a>
              <a href="/terms" className="text-slate-600 hover:text-purple-600 transition">Terms of Service</a>
              <a href="/advertise" className="text-slate-600 hover:text-purple-600 transition">Advertise</a>
              <a href="mailto:tryaiburn@howstud.io" className="text-slate-600 hover:text-purple-600 transition">Contact: tryaiburn@howstud.io</a>
            </div>
            <div className="flex justify-center gap-4">
              <a href="https://instagram.com/tryaiburn" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-purple-600 transition font-semibold">Instagram</a>
              <span className="text-slate-400">•</span>
              <a href="https://x.com/tryaiburn" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-purple-600 transition font-semibold">X</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
