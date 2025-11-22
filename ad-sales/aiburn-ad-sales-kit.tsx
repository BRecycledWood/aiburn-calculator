import React, { useState } from 'react';
import { BarChart3, Users, Target, TrendingUp, Eye, MousePointer, Clock, Mail } from 'lucide-react';

export default function AIBurnAdSalesKit() {
  const [activeTab, setActiveTab] = useState('one-pager');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AIBurn Advertising</h1>
                <p className="text-sm text-slate-500">Sales Kit & Resources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('one-pager')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'one-pager'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One-Pager
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'emails'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Templates
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'one-pager' && <OnePager />}
        {activeTab === 'dashboard' && <DashboardMockup />}
        {activeTab === 'emails' && <EmailTemplates />}
      </div>
    </div>
  );
}

function OnePager() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Reach 10,000+ AI Builders Every Month
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Advertise on AIBurn - Where Decision-Makers Calculate Their AI Costs
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
              <Users className="w-4 h-4" />
              <span>10K+ Monthly Visitors</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
              <Target className="w-4 h-4" />
              <span>High-Intent Audience</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span>Growing 40% MoM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Who Uses AIBurn */}
      <div className="p-12 bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Who Uses AIBurn?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Founders & CTOs</h3>
            <p className="text-slate-600 text-sm">
              Making critical decisions about AI infrastructure and budget allocation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Solo Entrepreneurs</h3>
            <p className="text-slate-600 text-sm">
              Building AI-powered products and comparing API costs for their projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Engineering Teams</h3>
            <p className="text-slate-600 text-sm">
              Evaluating AI models and optimizing costs for production workloads.
            </p>
          </div>
        </div>
      </div>

      {/* Advertising Packages */}
      <div className="p-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Advertising Packages</h2>
        <p className="text-slate-600 mb-8">Choose the placement that fits your goals and budget</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
            <div className="text-sm font-semibold text-purple-600 mb-2">STARTER</div>
            <div className="text-3xl font-bold text-slate-900 mb-4">
              $499<span className="text-lg text-slate-500">/mo</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Footer banner placement</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Basic analytics dashboard</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Monthly email report</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>3-month minimum</span>
              </li>
            </ul>
            <button className="w-full bg-slate-100 text-slate-900 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              Get Started
            </button>
          </div>

          {/* Standard - Popular */}
          <div className="border-2 border-purple-600 rounded-xl p-6 relative shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
              MOST POPULAR
            </div>
            <div className="text-sm font-semibold text-purple-600 mb-2">STANDARD</div>
            <div className="text-3xl font-bold text-slate-900 mb-4">
              $1,499<span className="text-lg text-slate-500">/mo</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Header rotation (15s, 4 slots)</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Full GoHighLevel dashboard</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Real-time analytics + UTM tracking</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Conversion pixel support</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>No minimum commitment</span>
              </li>
            </ul>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Start Campaign
            </button>
          </div>

          {/* Premium */}
          <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
            <div className="text-sm font-semibold text-purple-600 mb-2">PREMIUM</div>
            <div className="text-3xl font-bold text-slate-900 mb-4">
              $2,999<span className="text-lg text-slate-500">/mo</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>2 premium placements</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>All Standard features</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>A/B testing support</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Monthly strategy call</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Priority positioning</span>
              </li>
            </ul>
            <button className="w-full bg-slate-100 text-slate-900 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="p-12 bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">What's Included?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Real-Time Analytics</h3>
              <p className="text-slate-600 text-sm">
                Track impressions, clicks, CTR, and conversions with hourly updates via your dedicated GoHighLevel dashboard.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">UTM & Conversion Tracking</h3>
              <p className="text-slate-600 text-sm">
                Custom UTM links and conversion pixel integration to measure true ROI from AIBurn traffic.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Monthly Performance Reports</h3>
              <p className="text-slate-600 text-sm">
                Automated PDF reports with insights, benchmarks, and optimization recommendations.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Dedicated Support</h3>
              <p className="text-slate-600 text-sm">
                Priority email support, creative feedback, and optimization guidance from our team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Reach Your Ideal Customers?</h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Limited spots available. Lock in your position before your competitors do.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
            Book a Demo Call
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            View Sample Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Advertiser Analytics Dashboard</h2>
            <p className="text-slate-600">Sample view for: Header Banner Slot #2</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Total Impressions</span>
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">127,450</div>
            <div className="text-xs text-blue-700">↑ 12.3% vs last month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Total Clicks</span>
              <MousePointer className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">3,847</div>
            <div className="text-xs text-purple-700">↑ 8.5% vs last month</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Click Rate (CTR)</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">3.02%</div>
            <div className="text-xs text-green-700">Above 2.8% benchmark</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-700">Conversions</span>
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">142</div>
            <div className="text-xs text-orange-700">3.69% conversion rate</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Performance Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 88, 85, 92, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t hover:from-purple-700 hover:to-purple-500 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-500 mt-2">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Peak Performance Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">9:00 AM - 11:00 AM EST</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Highest CTR: 4.2%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">2:00 PM - 4:00 PM EST</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Most Impressions
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">Monday & Wednesday</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  Best Days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Audience Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">Desktop</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">Mobile</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">Tablet</span>
                  <span className="font-medium">4%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '4%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Optimization Recommendations
        </h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-sm">Strong Performance</p>
                <p className="text-xs text-slate-600">Your CTR is 7.9% above industry average. Current creative is resonating well.</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold">→</span>
              <div>
                <p className="font-medium text-sm">Consider A/B Testing</p>
                <p className="text-xs text-slate-600">Test a CTA variation during peak hours (9-11 AM) to potentially boost conversions by 15-20%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('cold-outreach');

  const templates = {
    'cold-outreach': {
      subject: 'Partner with AIBurn to Reach 10K+ AI Builders',
      body: `Hi [First Name],

I noticed [Company Name] is doing incredible work in [AI tools/infrastructure/dev tools space], and I think there's a great partnership opportunity.

I'm reaching out from AIBurn – we're a cost calculator that 10,000+ founders, CTOs, and AI builders use every month to compare API pricing and optimize their AI infrastructure costs.

**Why this matters for you:**
• Our users are actively building with AI and making purchasing decisions
• High-intent traffic – they're literally calculating costs and comparing providers
• Growing 40% month-over-month with a highly engaged audience

**What we're offering:**
Premium ad placements with full transparency via real-time GoHighLevel analytics. You'll see exactly how many impressions, clicks, and conversions your ads are driving.

**Quick Stats:**
✓ 10,000+ monthly visitors
✓ Average CTR: 2.8% (above industry standard)
✓ Audience: Founders, CTOs, solo entrepreneurs, engineering teams
✓ Starting at $1,499/month with no long-term commitment

I'd love to show you a sample analytics dashboard and discuss how we can help [Company Name] reach the right audience.

Are you available for a quick 15-minute call this week?

Best,
[Your Name]
AIBurn Partnerships
[Your Email] | [Your Calendar Link]

P.S. We only have 4 header banner slots available – happy to reserve one for you while we chat.`
    },
    'follow-up': {
      subject: 'Re: AIBurn Partnership + Sample Analytics',
      body: `Hi [First Name],

Following up on my previous email about advertising on AIBurn.

I wanted to share what one of our current advertisers is seeing:
• 127K impressions in their first month
• 3.02% CTR (above our 2.8% average)
• 142 tracked conversions
• $4.20 cost per conversion

They're targeting the same audience as you – AI builders making infrastructure decisions.

I've attached a sample dashboard view so you can see the level of transparency we provide. Every advertiser gets:
✓ Real-time impression & click tracking
✓ UTM parameter support for full attribution
✓ Conversion pixel integration
✓ Monthly performance reports with recommendations

**Limited availability:** We only have 2 header slots left for [Month].

Would you be open to a quick call to discuss? I can show you exactly where your ads would appear and walk through the analytics setup.

[Book a 15-min call here: CALENDAR_LINK]

Best,
[Your Name]
AIBurn Partnerships`
    },
    'demo-follow-up': {
      subject: 'Thanks for the call – AIBurn Partnership Details',
      body: `Hi [First Name],

Great speaking with you earlier! As discussed, here's a quick recap of the AIBurn advertising opportunity:

**Your Package: Standard Plan**
• Header banner rotation (15-second intervals, 4 total slots)
• Estimated 30K-40K impressions/month based on current traffic
• Full GoHighLevel analytics dashboard access
• Custom UTM tracking for your campaigns
• Monthly performance reports
• $1,499/month, no long-term commitment

**Next Steps:**
1. Send us your creative assets (728x90px or 970x250px, PNG/JPG)
2. We'll set up your advertiser dashboard
3. Campaign launches within 48 hours
4. You get login credentials for real-time tracking

**To get started:**
Simply reply with:
✓ Preferred start date
✓ Ad creative (or we can recommend design resources)
✓ Destination URL
✓ UTM parameters (if you have preference, otherwise we'll create them)

I'll send over the agreement and onboarding details once I hear back from you.

Looking forward to partnering with [Company Name]!

Best,
[Your Name]
AIBurn Partnerships
[Your Email] | [Your Phone]`
    },
    'renewal': {
      subject: 'Your AIBurn Campaign Performance + Renewal',
      body: `Hi [First Name],

Your ad campaign with AIBurn has been live for [X months] and I wanted to share some results before your renewal date on [Date].

**Your Performance Summary:**
📊 Total Impressions: [X]
🖱️ Total Clicks: [X]
📈 Average CTR: [X]%
🎯 Tracked Conversions: [X]
💰 Cost per Conversion: $[X]

**Compared to benchmarks:**
• Your CTR is [X]% [above/below] the platform average
• Peak performance days: [Days]
• Best performing times: [Times]

**Optimization Recommendations:**
Based on your data, here are some ways we could improve performance for your next cycle:
1. [Specific recommendation based on their data]
2. [Specific recommendation based on their data]

**Renewal Options:**
1. Continue with Standard Plan: $1,499/month
2. Upgrade to Premium (2 placements + A/B testing): $2,999/month
3. Try our new Featured Spotlight package: [Custom pricing]

I've attached your full performance report. Would you like to schedule a quick call to discuss renewal and optimization strategies?

Let me know if you'd like to continue – I can process your renewal today to ensure no gap in coverage.

Best,
[Your Name]
AIBurn Partnerships
[Your Email]

P.S. If you renew by [Date], I can lock in your current rate and throw in a free A/B test for your next creative.`
    },
    'rejection-nurture': {
      subject: 'No worries – staying in touch',
      body: `Hi [First Name],

Thanks for getting back to me! I completely understand that now isn't the right time for [Company Name] to advertise on AIBurn.

No pressure at all – I just wanted to keep you in the loop on a few things:

**What's coming:**
• We're launching [new feature/tool] next month that will bring in [specific audience]
• Our traffic is growing 40% MoM – we'll hit [milestone] by [date]
• We're adding [new ad format/option] that might be more aligned with your goals

**I'll check back in:**
I'll reach out again in [2-3 months] to see if timing is better. In the meantime, feel free to use AIBurn for your own cost calculations – would love to hear your feedback!

If anything changes or you'd like to revisit this sooner, just reply to this email.

Best of luck with [specific thing they mentioned]!

Best,
[Your Name]
AIBurn Partnerships

P.S. If you know any other AI tool companies that might benefit from reaching our audience, I'd be grateful for an intro. Happy to offer a referral bonus!`
    },
    'case-study-request': {
      subject: 'Featured Partner Spotlight – Interested?',
      body: `Hi [First Name],

Your ads on AIBurn have been performing exceptionally well (3.8% CTR – way above our average!), and I wanted to propose something special.

**Opportunity: Featured Partner Spotlight**

We'd love to feature [Company Name] as a case study on our blog and in our upcoming newsletter (sent to 15K+ subscribers).

**What this includes:**
• Dedicated blog post about how AI builders use [your product]
• Featured placement in our "Tools We Love" section
• Social media promotion across our channels
• Link back to your site (great for SEO)
• Your logo on our partners page

**What we need from you:**
• 30-minute interview about your product and target customers
• 2-3 quotes we can use
• Your logo and product screenshots
• Permission to share anonymized performance data from your ads

This is completely free – we just think our audience would love to learn more about [Company Name], and it's a great way to amplify your existing ad investment.

Interested? I can send over more details and we can schedule that interview.

Best,
[Your Name]
AIBurn Partnerships`
    },
    'seasonal-promotion': {
      subject: 'Black Friday Special: 2 Months Free on AIBurn Ads',
      body: `Hi [First Name],

Quick note – we're running our only promotion of the year and I wanted to make sure you saw it.

**Black Friday Special (This Week Only):**
Sign up for 6 months of advertising on AIBurn and get 2 months free.

**Standard Package:**
• Normally: $1,499/month × 6 = $8,994
• Black Friday: Pay for 4 months = $5,996
• **You save: $2,998**

**Why now?**
• Q1 is our highest traffic period (budget planning season)
• Lock in this rate before our 2025 price increase
• Get your brand in front of 15K+ AI builders during peak season

**This offer expires:** [Date] at midnight

If you've been considering advertising with us, this is the time. I only have 3 slots available at this rate.

Want to claim one? Just reply "I'm in" and I'll send over the details.

Best,
[Your Name]
AIBurn Partnerships

P.S. This is a one-time offer – we won't run another promotion until next year.`
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Templates for Advertisers</h2>
        <p className="text-slate-600 mb-6">Ready-to-use email templates for every stage of the sales cycle</p>
        
        <div className="grid md:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedTemplate('cold-outreach')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'cold-outreach'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-sm">Cold Outreach</span>
            </div>
            <p className="text-xs text-slate-600">Initial contact with prospects</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('follow-up')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'follow-up'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-sm">Follow-Up</span>
            </div>
            <p className="text-xs text-slate-600">For prospects who haven't responded</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('demo-follow-up')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'demo-follow-up'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm">Demo Follow-Up</span>
            </div>
            <p className="text-xs text-slate-600">After a sales call or demo</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('renewal')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'renewal'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-sm">Renewal</span>
            </div>
            <p className="text-xs text-slate-600">For existing advertisers</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('rejection-nurture')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'rejection-nurture'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="font-semibold text-sm">Soft Rejection</span>
            </div>
            <p className="text-xs text-slate-600">When they say "not now"</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('case-study-request')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'case-study-request'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-sm">Case Study</span>
            </div>
            <p className="text-xs text-slate-600">Request for success story</p>
          </button>

          <button
            onClick={() => setSelectedTemplate('seasonal-promotion')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedTemplate === 'seasonal-promotion'
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-sm">Promotion</span>
            </div>
            <p className="text-xs text-slate-600">Seasonal sales campaigns</p>
          </button>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Email Preview</span>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded text-sm transition-colors">
              Copy Template
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Subject Line */}
          <div className="mb-6 pb-4 border-b border-slate-200">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Subject Line</label>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="font-semibold text-slate-900">{templates[selectedTemplate].subject}</p>
            </div>
          </div>

          {/* Email Body */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Email Body</label>
            <div className="bg-slate-50 p-6 rounded-lg font-mono text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {templates[selectedTemplate].body}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 Pro Tips for This Template:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {selectedTemplate === 'cold-outreach' && (
                <>
                  <li>• Research the company first – mention something specific about their product</li>
                  <li>• Keep it under 200 words – busy founders skim emails</li>
                  <li>• Lead with value, not features</li>
                  <li>• Include a clear CTA with calendar link</li>
                </>
              )}
              {selectedTemplate === 'follow-up' && (
                <>
                  <li>• Wait 3-5 days before following up</li>
                  <li>• Add new information (like sample stats) they didn't see in first email</li>
                  <li>• Create urgency with limited slots</li>
                  <li>• Make it easy to book a call</li>
                </>
              )}
              {selectedTemplate === 'demo-follow-up' && (
                <>
                  <li>• Send within 24 hours of the call</li>
                  <li>• Recap what you discussed to show you were listening</li>
                  <li>• Make next steps crystal clear</li>
                  <li>• Remove friction – tell them exactly what you need</li>
                </>
              )}
              {selectedTemplate === 'renewal' && (
                <>
                  <li>• Send 2 weeks before renewal date</li>
                  <li>• Lead with their results, not your pitch</li>
                  <li>• Offer optimization recommendations to add value</li>
                  <li>• Include upgrade options for upsell opportunity</li>
                </>
              )}
              {selectedTemplate === 'rejection-nurture' && (
                <>
                  <li>• Be gracious and understanding</li>
                  <li>• Stay top of mind without being pushy</li>
                  <li>• Ask for referrals – they might know someone who's interested</li>
                  <li>• Set a specific follow-up date</li>
                </>
              )}
              {selectedTemplate === 'case-study-request' && (
                <>
                  <li>• Only reach out to high-performing advertisers</li>
                  <li>• Make it clear this is free additional exposure</li>
                  <li>• Keep time commitment minimal (30 min interview)</li>
                  <li>• Offer to write everything – they just review and approve</li>
                </>
              )}
              {selectedTemplate === 'seasonal-promotion' && (
                <>
                  <li>• Create genuine urgency with deadline</li>
                  <li>• Show the math so savings are clear</li>
                  <li>• Limit availability to create scarcity</li>
                  <li>• Make saying yes incredibly easy ("just reply 'I'm in'")</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Customization Guide */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Personalization Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Before Sending:</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>☐ Replace [First Name] with actual name</li>
              <li>☐ Replace [Company Name] throughout</li>
              <li>☐ Customize industry/product mentions</li>
              <li>☐ Add your calendar link</li>
              <li>☐ Update stats if they've changed</li>
              <li>☐ Add your signature</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Increase Reply Rate:</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>☐ Reference their recent product launch/news</li>
              <li>☐ Mention mutual connections if any</li>
              <li>☐ Use their product and share feedback</li>
              <li>☐ Send Tuesday-Thursday 10AM-2PM</li>
              <li>☐ Keep subject line under 50 characters</li>
              <li>☐ A/B test different subject lines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}