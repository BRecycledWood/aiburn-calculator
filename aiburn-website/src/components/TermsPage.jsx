import { useState } from 'react'

export default function TermsPage() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

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
          <span className="text-2xl">📜</span> Terms of Service
        </h1>
        <p className="text-slate-600 text-sm mb-8 italic">Last Updated: November 24, 2025</p>

        {/* Disclaimer Accordion */}
        <div className="mb-12">
          <button
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="w-full bg-amber-50 border-l-4 border-amber-600 p-4 rounded-lg text-left flex items-center justify-between hover:bg-amber-100 transition"
          >
            <strong className="text-amber-900">⚠️ Important Disclaimer</strong>
            <span className="text-2xl text-amber-900 transform transition-transform" style={{ transform: disclaimerOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {disclaimerOpen && (
            <div className="bg-amber-50 border-l-4 border-amber-600 border-t-0 p-6 rounded-b-lg space-y-2">
              <ul className="list-disc list-inside space-y-2 text-amber-900">
                <li>Pricing data is provided for informational purposes only</li>
                <li>We strive for accuracy but cannot guarantee all pricing is current</li>
                <li>AI providers may change pricing at any time</li>
                <li>Always verify pricing with the official provider before making decisions</li>
                <li>We are not liable for any business decisions based on our calculations</li>
              </ul>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
            <p>By accessing AIBurn at aiburn.howstud.io, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Description of Service</h2>
            <p>AIBurn is a free AI cost calculator that helps you estimate API costs across various AI providers including OpenAI, Anthropic, Claude, Google AI, and others.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Use of Service</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">You May:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4 text-green-700">
              <li>✅ Use the calculator for personal or commercial projects</li>
              <li>✅ Share results on social media</li>
              <li>✅ Download calculation reports</li>
              <li>✅ Use AIBurn as often as needed</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3">You May NOT:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-red-700">
              <li>❌ Scrape or automate requests to overload our servers</li>
              <li>❌ Attempt to hack or compromise the Service</li>
              <li>❌ Use AIBurn for illegal purposes</li>
              <li>❌ Misrepresent yourself as AIBurn or its affiliates</li>
              <li>❌ Remove or obscure any copyright notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Warranty</h2>
            <p className="mb-4">AIBurn is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Accuracy of pricing information</li>
              <li>Availability of the Service</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
            </ul>

            <p className="mb-4"><strong>We make no guarantees that:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The Service will be uninterrupted or error-free</li>
              <li>Pricing data will always be current and accurate</li>
              <li>The calculator will meet your specific needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="mb-4">To the maximum extent permitted by law, AIBurn and its creators shall not be liable for any:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Business losses</li>
              <li>Lost profits</li>
              <li>Lost revenue</li>
              <li>Data loss</li>
              <li>Indirect, special, or consequential damages</li>
            </ul>

            <p className="mb-4">Arising from your use of the Service, even if we have been advised of the possibility of such damages.</p>

            <p><strong>Maximum Liability:</strong> Our total liability shall not exceed $100 USD.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Pricing Data</h2>
            <p className="mb-4">AIBurn aggregates pricing information from public sources. We are not affiliated with OpenAI, Anthropic, Google, or any other AI providers mentioned on our site.</p>

            <p className="mb-4">Pricing displayed on AIBurn may differ from actual costs due to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Promotional pricing or discounts</li>
              <li>Volume pricing tiers</li>
              <li>Enterprise agreements</li>
              <li>Regional pricing variations</li>
              <li>Recent price changes not yet updated</li>
            </ul>

            <p><strong>Always verify pricing directly with the provider.</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Advertising</h2>
            <p className="mb-4">AIBurn displays advertisements from third-party companies. We are not responsible for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>The content of advertisements</li>
              <li>The products or services advertised</li>
              <li>Any transactions between you and advertisers</li>
              <li>Advertiser privacy policies or practices</li>
            </ul>

            <p>Clicking on ads may redirect you to third-party websites. Review their terms and privacy policies before providing any information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">AIBurn owns:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>The calculator design and functionality</li>
              <li>AIBurn logo and branding</li>
              <li>Original content and copy</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3">You retain ownership of:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your calculation inputs</li>
              <li>Any data you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">User-Generated Content</h2>
            <p>If you share calculation results publicly (e.g., on social media):</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You grant us permission to display those shares on AIBurn</li>
              <li>You represent that you have the right to share that content</li>
              <li>We are not responsible for content you choose to share</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Communications</h2>
            <p>If you provide your email address:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We may send you the calculation results you requested</li>
              <li>We may send occasional updates about AIBurn (you can unsubscribe)</li>
              <li>We will never sell your email to third parties</li>
              <li>You can unsubscribe at any time via the link in any email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Modifications to Service</h2>
            <p className="mb-4">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Modify or discontinue the Service at any time</li>
              <li>Add or remove features</li>
              <li>Change pricing data sources</li>
              <li>Update these Terms of Service</li>
            </ul>

            <p className="mb-4">We will notify users of significant changes by:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Updating the "Last Updated" date</li>
              <li>Posting a notice on the website</li>
              <li>Sending an email (if you've provided one)</li>
            </ul>

            <p>Continued use of AIBurn after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Termination</h2>
            <p>We may terminate or suspend your access to AIBurn immediately, without prior notice, for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Abusive behavior or harassment</li>
              <li>Attempts to hack or compromise the Service</li>
              <li>Any conduct we deem harmful to AIBurn or other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law</h2>
            <p>These Terms shall be governed by the laws of the United States, without regard to conflict of law provisions.</p>
            <p>Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Severability</h2>
            <p>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Entire Agreement</h2>
            <p>These Terms constitute the entire agreement between you and AIBurn regarding the Service, and supersede any prior agreements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
            <p className="mb-4">Questions about these Terms of Service?</p>
            <p>
              <strong>Email:</strong> <a href="mailto:tryaiburn@howstud.io" className="text-blue-600 hover:text-blue-700 underline">tryaiburn@howstud.io</a><br/>
              <strong>Website:</strong> <a href="https://aiburn.howstud.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">aiburn.howstud.io</a>
            </p>
          </section>
        </div>

        <hr className="my-12 border-slate-200" />

        <p className="text-center text-slate-600 text-sm">
          <a href="/" className="text-slate-600 hover:text-purple-600 transition">Back to Calculator</a> | 
          <a href="/privacy" className="text-slate-600 hover:text-purple-600 transition ml-4">Privacy Policy</a> | 
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
