# AIBurn Cost Calculator - Revised PRD (v10)
**Document Version:** 2.0  
**Last Updated:** November 16, 2025  
**Status:** Active Development  
**Owner:** HOW Ops Agent

---

## Executive Summary

AIBurn is a real-time, browser-based AI token cost comparison tool that helps developers and founders identify cost optimization opportunities across major LLM providers (OpenAI, Anthropic, Groq, DeepSeek). The tool operates in two modes:

1. **Quick Calculator** – Estimate costs based on monthly token volume
2. **Exact Usage** – Analyze real API usage data (OpenAI only; Anthropic planned)

**Current State:** v10 includes dual-mode operation, live pricing tables, ad network framework, and secure API key handling.

---

## Problem Statement

**Target User:** AI-powered application developers and startup founders

**Pain Points:**
- Unclear how much they're spending on LLM APIs month-over-month
- Difficult to compare pricing across providers with different token structures
- Fear of exposing API keys to third-party tools
- No simple way to model cost savings from provider switching

**Market Opportunity:**
- 10,000+ monthly visitors (per code comments: "Reach: 10,000+ AI founders & developers monthly")
- Average dev spending $500–$2,000/month on LLM tokens (addressable through sponsorships & upsells)

---

## Product Goals

### Primary Goal
**Enable rapid cost discovery and optimization** so users can make informed LLM provider decisions in seconds, not hours of spreadsheet work.

### Secondary Goals
1. Build an ad-supported revenue stream ($199–$1,499/month per slot)
2. Establish HOWstud.io brand authority in the AI cost-optimization niche
3. Create a reusable cost-calculator pattern for other AI tools (receptionist ROI, etc.)

---

## Core Features (v10)

### Feature 1: Quick Calculator
**Description:** User selects current model + monthly token count; tool calculates cost and shows alternatives.

**User Flow:**
1. User lands on page → sees mode toggle (Quick | Exact)
2. Clicks "Quick Calculator"
3. Selects from model grid (e.g., GPT-4, Claude 3.5 Sonnet, Groq Llama)
4. Slides monthly token range (1M–200M)
5. Clicks "Calculate My Costs"
6. Sees current cost + savings grid sorted by highest savings first

**Technical Implementation:**
- React state: `selectedModel`, `monthlyTokens`, `results`
- Calculation: `(inputTokens / 1M) * inputRate + (outputTokens / 1M) * outputRate`
- Assumes 70% input / 30% output token ratio (configurable)

**Supported Models (v10):**
- OpenAI: GPT-4, GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo
- Anthropic: Claude 3 Opus, Claude 3.5 Sonnet, Claude 3 Haiku
- Groq: Llama 3.1 70B
- DeepSeek: Chat

**Success Metrics:**
- ✓ Calculation completes in <1.5s
- ✓ User can identify #1 alternative provider in <10 seconds
- ✓ Savings displayed as both $ amount and % comparison

---

### Feature 2: Exact Usage (API Integration)
**Description:** User connects API key to fetch real 30-day usage breakdown and calculate actual costs + alternatives.

**User Flow:**
1. Selects "Exact Usage" mode
2. Chooses provider (OpenAI button / Anthropic button)
3. Enters read-only API key
4. Clicks "Analyze Exact Usage"
5. Sees actual token breakdown by model + cost alternatives

**Technical Implementation:**
- **OpenAI Path:** Fetches from `https://api.openai.com/v1/usage` with Bearer token
- **Anthropic Path:** Planned (Anthropic usage API not yet public; prompts users to use Quick Calculator)
- **Security:** API key used once, client-side analysis, no storage
- **Parsing:** Extracts model name, input tokens, output tokens from 30-day window

**API Key Safety:**
- Blue info box warns: "Your API key is used once to fetch usage data and is never stored. All analysis happens in your browser."
- No server-side logging of keys
- HTTPS enforced

**Success Metrics:**
- ✓ OAuth/read-only key acceptance without security warnings
- ✓ Model breakdown shown with % of total tokens
- ✓ Results match official API usage dashboard (±2% acceptable)

---

### Feature 3: Results & Sharing
**Description:** Display actionable cost comparison and enable one-click sharing.

**Display:**
- Current monthly cost (large, bold)
- Input/output token counts
- Model breakdown (if exact usage)
- Sortable alternatives table
  - Model name + provider
  - Price per 1M tokens (input/output)
  - Total monthly cost
  - **Savings badge** (green if positive, red if negative)
  - % cheaper calculation

**Sharing:**
- **Share on 𝕏 (Twitter):** Pre-populated tweet with cost + best savings alternative
- **Download Screenshot:** Canvas-based image export (1200×630px social media card)

**Success Metrics:**
- ✓ Tweet opens in new window with proper URL encoding
- ✓ Screenshot renders in <2s, includes brand logo
- ✓ Conversion: 15–20% of users click share button

---

### Feature 4: Pricing Reference Table
**Description:** Static, sortable table of all supported models with live pricing (last updated Nov 2025).

**Table Columns:**
- Model
- Provider
- Input ($/1M tokens)
- Output ($/1M tokens)
- Quality badge (Highest/High/Good)

**Interactivity:**
- Hover to highlight row
- Clickable links to provider pricing pages for verification

**Maintenance:**
- Pricing updated quarterly (Q4 2025, Q1 2026, etc.)
- Version note: "Last updated: November 2025"

---

### Feature 5: Ad Network & Sponsorship
**Description:** Multiple ad slots with flexible pricing to fund tool development.

**Ad Slots (v10 Framework):**

| Slot | Type | Placement | Price | Visibility |
|------|------|-----------|-------|-----------|
| Premium Header | Static banner | Top of page | $1,499 | 100% |
| Sidebar Premium | Static card | Right sidebar | $999 | Always |
| Featured Rotating (×3) | Rotating carousel | Sidebar, 10s each | $499 each | 33% |
| In-Content Top | Banner | Between calculator & results | $399 | When results shown |
| In-Content Bottom | Banner | Below results | $299 | When results shown |
| Footer Banner | Static | Page bottom | $199 | 100% |

**Sponsor Management:**
- CMS-style config object (`sponsorSlots`) with `active` flag + sponsor data
- No code changes needed to add/swap sponsors
- Rotating ads auto-cycle every 10s
- Dashboard displays: total slots, sold, available, starting price

**Success Metrics:**
- ✓ 2–3 premium slots sold by Month 1
- ✓ 3 rotating sponsors by Month 2
- ✓ $2,000–$4,000/month recurring revenue by Month 3

---

### Feature 6: Sidebar Tools & Cross-Promotion
**Description:** Secondary navigation to related HOWstud.io products.

**Links:**
- Howstud.io main site
- AI Receptionist ROI calculator (companion tool)

**Purpose:**
- Increase time-on-site
- Drive traffic to other revenue streams
- Reinforce brand ecosystem

---

## Technical Architecture (v10)

### Frontend
- **Framework:** React (TypeScript)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Charts/Export:** HTML5 Canvas (for screenshot generation)

### Data Model
```typescript
models = {
  'gpt-4': { name: string, provider: string, input: number, output: number, ... },
  ...
}

results = {
  inputTokens: number,
  outputTokens: number,
  currentCost: number,
  currentModel?: ModelData,
  modelBreakdown?: Array<{ name, inputTokens, outputTokens, percentage }>,
  alternatives: Array<{ key, model, cost, savings, savingsPercent }>,
  mode: 'quick' | 'exact'
}
```

### API Integrations
- **OpenAI Usage API** – Bearer token, GET `/v1/usage`
- **Provider Pricing** – Manual quarterly updates (no live feeds)

### Security
- No backend authentication required
- Client-side only computation
- HTTPS enforced
- API keys not logged or stored

### Performance
- Initial load: <1s (static HTML + Tailwind)
- Quick Calculator calculation: <1.5s (setTimeout mock; ready for real compute)
- Exact Usage API call: 2–5s (network dependent)
- Screenshot generation: <2s

---

## Success Metrics & KPIs

### User Engagement
| Metric | Target | Notes |
|--------|--------|-------|
| Monthly Users | 10,000+ | Current reach |
| Avg Session Duration | 3–5 min | Quick calc = 1 min, exact = 5 min |
| % Quick Calc Users | 60% | Lower friction |
| % Exact Usage Users | 40% | Higher engagement |
| Share Rate (Twitter/Download) | 10–15% | Viral coefficient |

### Business Impact
| Metric | Target | Notes |
|--------|--------|-------|
| Ad Slots Sold | 6–8 by Month 3 | Start with 2–3 premium |
| MRR (Monthly Recurring) | $2,000–$4,000 | Sponsorship revenue |
| CTR to HOWstud.io | 5–8% | Cross-product funnel |

### Technical
| Metric | Target | Notes |
|--------|--------|-------|
| Page Load (FCP) | <1.5s | Optimized bundle |
| Calculation Accuracy | ±0.1% | vs. official APIs |
| Uptime | 99.5%+ | CDN-hosted |
| Mobile Responsive | 100% | Tailwind mobile-first |

---

## Design & UX Principles

1. **Trust First:** Blue security banner + "never stored" language
2. **Speed:** Results in seconds, not minutes
3. **Clarity:** Large, scannable numbers + color-coded savings
4. **Shareability:** One-click Twitter/screenshot export
5. **Non-Intrusive Ads:** Sponsorships enhance, don't distract
6. **Accessibility:** WCAG 2.1 AA (color contrast, keyboard nav, ARIA labels)

---

## User Stories

### Story 1: Quick Cost Check (Persona: SaaS Founder)
**As a** SaaS founder using GPT-4o  
**I want to** quickly see if switching to Claude could save money  
**So that** I can report ROI to my CFO

**Acceptance Criteria:**
- ✓ Land on page, select GPT-4o, enter monthly tokens
- ✓ See current cost + Claude alternatives in <2 seconds
- ✓ Identify top 3 savings options at a glance

### Story 2: Detailed API Analysis (Persona: DevOps Engineer)
**As a** DevOps engineer managing multiple AI models  
**I want to** analyze my last 30 days of OpenAI API usage  
**So that** I can justify a provider migration to my CTO

**Acceptance Criteria:**
- ✓ Enter read-only API key securely
- ✓ See breakdown by model used (GPT-4 vs 3.5, etc.)
- ✓ Compare total cost vs. alternatives
- ✓ Download report for presentation

### Story 3: Brand Awareness (Persona: AI Tool Vendor)
**As a** sponsor (e.g., alternative LLM provider)  
**I want to** reach 10,000 AI developers with my pricing  
**So that** I can increase API signups

**Acceptance Criteria:**
- ✓ Premium sidebar spot displays my logo + CTA
- ✓ CTR tracked & reported monthly
- ✓ Rotating slot shows my offer 33% of the time

---

## Roadmap & Phases

### Phase 1: MVP (v10 - Current)
- ✓ Dual-mode calculator (Quick + Exact OpenAI)
- ✓ Cost comparison grid
- ✓ Social sharing
- ✓ Ad network framework (slots defined, 0 sponsors)
- ✓ Pricing table (7 models, Nov 2025 rates)

**Launch Target:** November 2025 (Go-live)

### Phase 2: Growth (v11–v12, Dec 2025 – Jan 2026)
- [ ] Anthropic usage API integration (when public)
- [ ] Additional providers (OpenRouter, Replicate, Hugging Face)
- [ ] User accounts + saved reports (Supabase auth)
- [ ] 3–4 paying sponsors onboarded
- [ ] A/B test ad placements

**Goals:** 2–3x traffic, $1,000+/mo ad revenue

### Phase 3: Scale (v13+, Q1 2026+)
- [ ] Historical cost trending (month-over-month graphs)
- [ ] Budget alerts & threshold notifications
- [ ] Team sharing & multi-account support
- [ ] Premium tier (detailed analytics, API exports)
- [ ] Affiliate program (monetize calculator referrals)

**Goals:** 50K+ monthly users, $5,000+/mo revenue

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| Provider API changes | Outdated pricing | Medium | Quarterly refresh + alerts |
| User API key security concerns | Low adoption of Exact mode | Medium | Clear security language + blog post |
| Ad blindness / low CTR | Ad revenue below target | Medium | Premium placements, sponsor support |
| Mobile UX friction | Mobile bounce rate >50% | Low | Responsive design, mobile testing |
| Competitor tools (similar calc) | Market share erosion | High | Brand moat = simplicity + sponsorships |

---

## Success Criteria for v10 Launch

### Functional (Code)
- [x] Quick Calculator functional, <1.5s response
- [x] Exact Usage API integration works (OpenAI)
- [x] Sharing (Twitter + screenshot export) works
- [x] Ad framework deployed, 0 active sponsors
- [x] Pricing table accurate (Nov 2025 rates)
- [x] Mobile responsive (375px–2560px viewports)
- [ ] Lighthouse score ≥90 (performance)
- [ ] 0 console errors, accessibility audit pass

### UX / Product
- [ ] First-time users understand dual modes within 10s
- [ ] 80%+ calculate at least once
- [ ] 10%+ attempt exact usage mode
- [ ] 5%+ share results

### Business
- [ ] 0 major bugs in first week
- [ ] HOWstud.io traffic increase of 15%+
- [ ] 1–2 sponsor inquiries by Week 2

---

## Deployment & Maintenance

### Hosting
- **Platform:** Vercel / Netlify (auto-deploy from repo)
- **CDN:** Global edge cache (automatic with Vercel)
- **Monitoring:** Sentry (error tracking), Google Analytics (usage)

### Pricing Updates
- **Frequency:** Quarterly (Nov, Feb, May, Aug)
- **Process:** Verify rates on provider sites → update `models` object → deploy
- **Communication:** In-app note "Last updated: [date]"

### Sponsor Onboarding
- **Intake:** Email ads@howstud.io with brief + creative
- **Setup:** Update `sponsorSlots` config, test visually
- **Billing:** Monthly invoice, net-30 terms

---

## Appendix A: Detailed Pricing Model (v10)

**Pricing Last Updated:** November 2025

```
OpenAI:
  - GPT-4:       $30/$60 per 1M tokens (input/output)
  - GPT-4 Turbo: $10/$30
  - GPT-4o:      $2.50/$10
  - GPT-3.5:     $0.50/$1.50

Anthropic:
  - Claude 3 Opus:      $15/$75
  - Claude 3.5 Sonnet:  $3/$15
  - Claude 3 Haiku:     $0.25/$1.25

Groq:
  - Llama 3.1 70B: $0.05/$0.08

DeepSeek:
  - Chat: $0.14/$0.28
```

---

## Appendix B: Code Structure Overview

**Main Component:** `AITokenCalculator()` (React)

**Key Props/State:**
- `mode` – "quick" or "exact"
- `selectedModel` – current model key
- `monthlyTokens` – slider value (1M–200M)
- `apiKey` – user input (exact mode)
- `results` – calculation output
- `sponsorSlots` – ad configuration object

**Key Functions:**
- `calculateCosts()` – quick mode logic
- `analyzeExactUsage()` – OpenAI API call + parsing
- `shareOnTwitter()` – URL encoding + window.open
- `downloadReport()` – Canvas-based image export
- `calculateAdMetrics()` – sponsorship dashboard

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-XX | Initial | Original PRD |
| 2.0 | 2025-11-16 | HOW Ops Agent | v10 revision: dual modes, ad framework, roadmap, success metrics |

---

**Sign-Off:**
- [ ] Product Lead (Review & Approve)
- [ ] Engineering Lead (Technical Feasibility)
- [ ] Design Lead (UX Sign-off)
- [ ] Finance (Ad Revenue Model)

**Next Steps:**
1. Circulate PRD for stakeholder review (3 days)
2. Finalize pricing model with finance (2 days)
3. Schedule Phase 2 planning session (week of Nov 25)
4. Launch v10 to production (target: EOW Nov 20)
