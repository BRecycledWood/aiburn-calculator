import { useState } from 'react'

export default function PrivacyPage() {
  const [tldrOpen, setTldrOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          <span className="text-2xl">🔒</span> Privacy Policy
        </h1>
        <p className="text-slate-600 text-sm mb-8 italic">Last Updated: November 24, 2025</p>

        {/* TL;DR Accordion */}
        <div className="mb-12">
          <button
            onClick={() => setTldrOpen(!tldrOpen)}
            className="w-full bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg text-left flex items-center justify-between hover:bg-blue-100 transition"
          >
            <strong className="text-lg text-blue-900">TL;DR (Too Long, Didn't Read)</strong>
            <span className="text-2xl text-blue-900 transform transition-transform" style={{ transform: tldrOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {tldrOpen && (
            <div className="bg-blue-50 border-l-4 border-blue-600 border-t-0 p-6 rounded-b-lg space-y-4 text-blue-900">
              <div>
                <strong className="block mb-2">What we DON'T do:</strong>
                <ul className="list-inside space-y-1 ml-4">
                  <li>❌ Store your API keys or calculations</li>
                  <li>❌ Sell your data</li>
                  <li>❌ Require an account</li>
                  <li>❌ Track you across websites</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-2">What we DO:</strong>
                <ul className="list-inside space-y-1 ml-4">
                  <li>✅ Use Google Analytics (anonymous)</li>
                  <li>✅ Track ad performance (anonymous)</li>
                  <li>✅ Collect emails ONLY if you opt in</li>
                  <li>✅ Keep everything transparent</li>
                </ul>
              </div>
              <div className="pt-2">
                <strong>Bottom line:</strong> Use AIBurn anonymously, or opt in to get results emailed. Your choice.
              </div>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to AIBurn</h2>
            <p>AIBurn operates aiburn.howstud.io (the "Service"). This Privacy Policy explains how we collect, use, and protect your information when you use our AI cost calculator.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">✅ What We DON'T Store</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">Your Calculations Stay Private</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>API Keys:</strong> Never stored. If you enter one, it's used once in your browser and immediately discarded.</li>
              <li><strong>Token Usage:</strong> Not saved to any database. All calculations happen in your browser.</li>
              <li><strong>Model Selections:</strong> Not tracked or recorded.</li>
              <li><strong>Cost Estimates:</strong> Not saved on our servers.</li>
            </ul>
            <p><strong>Bottom line:</strong> Your calculation data never leaves your device unless you explicitly choose to share it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">📊 What We DO Collect (Anonymous)</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">Website Analytics</h3>
            <p className="mb-4">We use <strong>Google Analytics</strong> to understand how people use AIBurn:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Which pages are visited</li>
              <li>How long people spend on the site</li>
              <li>What device type (mobile, desktop, tablet)</li>
              <li>General location (city/country level - NOT your exact address)</li>
              <li>Which AI models are most compared</li>
            </ul>
            <p className="mb-4"><strong>Important:</strong> This data is <strong>anonymous and aggregated</strong>. Google Analytics shows us "50 people used the calculator today" - NOT "John Smith from New York used it."</p>
            <p className="mb-4"><strong>Opt out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Google Analytics Opt-out Browser Add-on</a></p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Advertising Analytics</h3>
            <p className="mb-4">AIBurn displays ads from AI tool companies. We track:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>How many times ads are viewed (impressions)</li>
              <li>How many times ads are clicked</li>
              <li>Which ad placements perform best</li>
            </ul>
            <p><strong>Important:</strong> We share these metrics with advertisers (e.g., "Your ad got 1,000 impressions") but NEVER share personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">📧 Optional - YOU Choose</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">Email Capture (100% Optional)</h3>
            <p className="mb-4">After you calculate costs, we offer to email you the results. This is <strong>completely optional</strong> - you can skip it and still use AIBurn.</p>

            <p className="mb-4"><strong>If you provide your email:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>We'll send you your calculation results</li>
              <li>We may send occasional updates about AIBurn or AI pricing changes</li>
              <li>You can unsubscribe anytime (link in every email)</li>
              <li>We will NEVER sell your email to third parties</li>
            </ul>

            <p className="mb-4"><strong>What we collect:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Email address (required)</li>
              <li>Name (optional)</li>
              <li>Company (optional)</li>
              <li>The calculation results you requested</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3">Advertising Inquiries</h3>
            <p>If you contact us about advertising on AIBurn, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name</li>
              <li>Email</li>
              <li>Company</li>
              <li>Your message</li>
            </ul>
            <p>This is stored in our CRM and used only to respond to your inquiry.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🍪 Cookies</h2>
            <p className="mb-4">We use minimal cookies for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Google Analytics</strong> - Anonymous usage tracking (you can opt out)</li>
              <li><strong>Session management</strong> - Remember your preferences during your visit (cleared when you close the browser)</li>
            </ul>

            <p className="mb-4">We do NOT use cookies for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li className="text-red-600">❌ Cross-site tracking</li>
              <li className="text-red-600">❌ Targeted advertising</li>
              <li className="text-red-600">❌ Selling your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🔐 Data Security</h2>
            <p className="mb-4">We take security seriously:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li className="text-green-600">✅ HTTPS encryption for all data transmission</li>
              <li className="text-green-600">✅ Secure email service providers</li>
              <li className="text-green-600">✅ No API keys or sensitive data ever stored</li>
              <li className="text-green-600">✅ Regular security updates</li>
            </ul>
            <p>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">👤 No Account Required</h2>
            <p>You can use AIBurn completely anonymously:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No signup required</li>
              <li>No password needed</li>
              <li>No profile created</li>
              <li>Just calculate and go</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">📱 Third-Party Services</h2>
            <p>We use these services (each has their own privacy policy):</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Analytics</strong> - Website analytics</li>
              <li><strong>Vercel</strong> - Website hosting</li>
              <li><strong>Email service</strong> - Sending calculation results (only if you opt in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🌍 Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Access</strong> - Request a copy of data we have about you</li>
              <li><strong>Delete</strong> - Request deletion of your email address</li>
              <li><strong>Opt out</strong> - Unsubscribe from emails anytime</li>
              <li><strong>Correct</strong> - Update your information</li>
              <li><strong>Export</strong> - Get your data in a portable format</li>
            </ul>
            <p><strong>To exercise these rights:</strong> Email <a href="mailto:tryaiburn@howstud.io" className="text-blue-600 hover:text-blue-700 underline">tryaiburn@howstud.io</a></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">👶 Children's Privacy</h2>
            <p>AIBurn is not intended for anyone under 13 years old. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🔄 Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email to users who provided their email address (for major changes)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">📞 Contact Us</h2>
            <p className="mb-4">Questions about this Privacy Policy?</p>
            <p>
              <strong>Email:</strong> <a href="mailto:tryaiburn@howstud.io" className="text-blue-600 hover:text-blue-700 underline">tryaiburn@howstud.io</a><br/>
              <strong>Website:</strong> <a href="https://aiburn.howstud.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">aiburn.howstud.io</a>
            </p>
          </section>
        </div>

        <hr className="my-12 border-slate-200" />

        <p className="text-center text-slate-600 text-sm">
          <a href="/" className="text-slate-600 hover:text-purple-600 transition">Back to Calculator</a> | 
          <a href="/terms" className="text-slate-600 hover:text-purple-600 transition ml-4">Terms of Service</a> | 
          <a href="/advertise" className="text-slate-600 hover:text-purple-600 transition ml-4">Advertise</a>
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-4">© 2025 AIBurn. All rights reserved.</p>
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
