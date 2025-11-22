# AIBurn - Private AI Cost Calculator

**The only AI cost calculator that respects your privacy. Zero data retention. 100% anonymous.**

---

## 🔒 Privacy First

AIBurn is built on a simple principle: **your data is your data**. Here's what makes us different:

### Zero Data Retention
- **Your API key is NEVER stored.** It's transmitted directly to fetch your usage data, then immediately discarded.
- **Your usage data is NEVER saved.** We don't log, track, or store any information about your calculations.
- **You remain completely anonymous.** We don't collect names, emails, or any identifying information.
- **No cookies, no tracking, no analytics.** You get complete privacy.

### What Stays Private
✅ Your OpenAI API key  
✅ Your usage statistics  
✅ Your cost calculations  
✅ Your AI model preferences  
✅ Everything else

---

## 🚀 Features

### Quick Calculator
Compare AI model costs instantly without connecting to any API:
- **9 AI Models:** GPT-4, GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo, Claude 3 Opus, Claude 3.5 Sonnet, Claude 3 Haiku, Llama 3.1 70B, DeepSeek Chat
- **Real-time Pricing:** Updated daily from official provider APIs
- **Instant Results:** See all alternatives and potential savings in seconds
- **No API Key Required:** Pure client-side calculation

### Exact Usage Analysis
Analyze your actual OpenAI API usage privately:
- **Connect Your Account:** Use your OpenAI API key (one-time only)
- **Zero Storage:** Key is never saved, only used to fetch usage data
- **Instant Cleanup:** Your key is discarded immediately after fetching
- **Real Analysis:** See how much you spent and what alternatives cost

### Results You Can Use
- **Share on X (Twitter):** Post your savings to social media
- **Download PNG Report:** Create a visual report of your analysis
- **Export Anytime:** Results stay in your browser, ready to share

---

## 🎯 How It Works

### Quick Mode
```
1. Select your current AI model
2. Enter your monthly token usage
3. Click "Calculate"
4. See all alternatives ranked by savings
5. Share or download results
```

### Exact Usage Mode
```
1. Enter your OpenAI API key
2. Click "Analyze My Usage"
3. We fetch your actual usage (no storage)
4. Compare alternatives based on your patterns
5. See potential monthly savings
6. Share or download results
```

**Your API key is discarded after step 3. We never see it again.**

---

## 💾 Data Handling

### What We Do
- Fetch your OpenAI usage data using your provided API key
- Calculate cost comparisons locally in your browser
- Display results for you to share or download

### What We Don't Do
- ❌ Store your API key
- ❌ Log your usage data
- ❌ Save your calculations
- ❌ Track you across sessions
- ❌ Use analytics (Google, Mixpanel, Segment, etc.)
- ❌ Sell or share your data

### Security
- All connections use HTTPS encryption
- API keys transmitted directly to OpenAI (not through our servers)
- No local storage of sensitive information
- Content Security Policy enabled
- Secure headers configured

---

## 🤔 Why AIBurn?

### Privacy
Unlike other cost calculators, AIBurn respects your privacy. Your API key and usage data are yours alone.

### Accuracy
Pricing is updated daily from official OpenAI, Anthropic, and other providers. Our calculations match their billing systems.

### Simplicity
No accounts. No signups. No tracking. Just pure calculation.

### Transparency
See exactly how much each model costs and how much you could save.

### Speed
Results in milliseconds. No waiting for server responses.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Calculation:** Client-side (no server needed)
- **Bundle:** 67 KB gzipped (fast even on slow networks)
- **Testing:** 35+ unit & integration tests
- **Security:** No vulnerabilities, security headers enabled

---

## 📋 Supported Models

### OpenAI
- GPT-4
- GPT-4 Turbo
- GPT-4o (Latest)
- GPT-3.5 Turbo

### Anthropic
- Claude 3 Opus
- Claude 3.5 Sonnet (Latest)
- Claude 3 Haiku

### Open Source
- Llama 3.1 70B (via Groq)
- DeepSeek Chat

**Pricing updated:** November 2025  
**Update frequency:** Daily (via GitHub Actions)

---

## 🔐 Legal

Your privacy is protected by law:

- **Privacy Policy:** See `/pages/privacy.html`
- **Terms of Service:** See `/pages/terms.html`
- **GDPR Compliant:** No personal data collection
- **CCPA Compliant:** No personal data to sell
- **WCAG 2.1 Level AA:** Accessible to all users

---

## 🚀 Getting Started

### Use It Online
Visit: **https://aiburn.howstud.io**

### Run It Locally
```bash
# Clone the repo
git clone <repo-url>
cd aiburn-cost-calculator/aiburn-website

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Examples

### Quick Calculator
1. Select "GPT-4o"
2. Enter "50" million tokens/month
3. See that you could save $45/month by switching to GPT-3.5 Turbo

### Exact Usage
1. Add your OpenAI API key
2. See your actual spending ($1,234/month)
3. Discover you could save $340/month with Claude 3.5 Sonnet
4. Download the PNG report
5. Share it on X with one click

---

## 🎓 Features for Teams

### Share Your Analysis
- **Twitter/X:** Post results with context
- **Slack:** Download PNG, share in channels
- **Email:** Forward the PNG report
- **Presentation:** Use the report in deck reviews

### Make Data-Driven Decisions
- Know your exact costs
- Compare alternatives objectively
- Present ROI to leadership
- Optimize your AI stack

---

## 🤝 Support

Questions about AIBurn?
- **Privacy concerns:** privacy@howstud.io
- **Technical issues:** privacy@howstud.io
- **General feedback:** privacy@howstud.io

---

## 📈 What's Next?

**Coming Soon:**
- [ ] Anthropic usage API support (when available)
- [ ] Price history and trends
- [ ] Budget alerts
- [ ] Team collaboration features
- [ ] Advanced analytics (opt-in only)

---

## 📝 License

AIBurn is built by HowStudios and is free to use.

---

## 🙏 Why We Care About Privacy

We believe that:
- Your data belongs to you
- Privacy is a right, not a privilege
- You shouldn't have to trade privacy for insights
- Transparency builds trust

That's why AIBurn is built with privacy-first principles. We don't store your data because **we don't need to**. Your calculations happen in your browser, and that's where they stay.

---

**The calculator that respects your privacy.** 🔒

---

**Live:** https://aiburn.howstud.io  
**Built by:** HowStudios  
**Updated:** November 2025
