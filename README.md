# AIBurn – AI Token Cost Calculator

## Overview
AIBurn is a free, browser-based tool that helps AI developers optimize their LLM costs. Compare pricing across 7+ providers (OpenAI, Anthropic, Groq, DeepSeek) in seconds using our **Quick Calculator** or analyze your actual API usage with **Exact Usage** mode. Ad-supported business model with built-in sponsorship framework.

## Current Status
- **Stage:** v10 (Pre-Launch, Ready for Production)
- **Target Launch:** November 20, 2025
- **Last Update:** November 16, 2025

## Key Links
- **Live App:** https://aiburn.howstud.io (pending launch)
- **Staging:** TBD (Vercel preview)
- **GitHub Repo:** TBD
- **Design File:** TBD (Figma)
- **Code:** `/Users/bkerwood/projects/AIBurn Cost Calculator/_docs/ai-cost-calculator-v10.tsx`

## Documentation (Required Reading)

### Start Here
1. **[Executive Summary](/_docs/v10_EXECUTIVE_SUMMARY.md)** – One-page overview for stakeholders
2. **[Full PRD](/_docs/AIBURN_COST_CALCULATOR_v10_REVISED_PRD.md)** – Complete product specification
3. **[Task List](/_docs/AIBURN_v10_TASK_LIST.md)** – Development roadmap + Phase 2/3 plans
4. **[Launch Checklist](/_docs/v10_LAUNCH_CHECKLIST.md)** – Pre-deployment verification

### Reference
- **Pricing Data:** See `models` object in v10.tsx (last updated Nov 2025)
- **Ad Configuration:** See `sponsorSlots` object in v10.tsx (6 available slots)
- **Changelog:** `CHANGELOG.md`

## Technology Stack
- **Frontend:** React (TypeScript) + Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Deployment:** Vercel (auto-deploy from GitHub)
- **Monitoring:** Sentry (errors) + Google Analytics 4 (usage)
- **Integrations:** OpenAI Usage API, Anthropic API (planned)

## API Keys & Secrets
- **Sentry DSN:** Stored in `.env.local` (not synced)
- **GA4 Property ID:** Injected via HTML head
- **Sponsor Config:** Managed via `sponsorSlots` object (no secrets)

**Note:** No backend required; all computation client-side for security.

## Hosting & Deployment
- **Platform:** Vercel (serverless/static)
- **Domain:** `aiburn.howstud.io` (pending registration)
- **CI/CD:** GitHub → Vercel auto-deploy on main branch
- **CDN:** Vercel Edge Network (global distribution)
- **Uptime Target:** 99.5%

## Project Metrics (v10)

### Success Criteria
| Metric | Target | Notes |
|--------|--------|-------|
| Monthly Users | 10,000+ | Current reach |
| Calculation Accuracy | ±0.1% | vs. official APIs |
| Page Load (FCP) | <1.5s | Lighthouse optimized |
| Mobile Responsive | 100% | 375px–2560px |
| Share Rate | 10–15% | Twitter + screenshots |
| Ad Revenue (Year 1) | $24K–$50K+ | 2–4 sponsors × $499–$1,499/mo |

### Roadmap
- **Phase 1 (v10):** Quick & Exact calculators, ad framework (Nov 2025) ✅
- **Phase 2 (v11–v12):** Anthropic API, user accounts, sponsor onboarding (Dec 2025–Jan 2026)
- **Phase 3 (2026+):** Premium tier, team features, mobile apps, international expansion

## Team & Ownership
- **Product Lead:** TBD (owns PRD, feature prioritization)
- **Frontend Lead:** TBD (React, UI/UX, performance)
- **Backend Lead:** TBD (API integrations, Supabase, Stripe)
- **DevOps Lead:** TBD (deployment, monitoring, infrastructure)
- **Growth Lead:** TBD (sponsor recruitment, marketing)

## Quick Start (Local Development)
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel (auto on GitHub push to main)
git push origin main
```

## Environment Variables
```
# .env.local (never commit)
SENTRY_DSN=https://...
NEXT_PUBLIC_GA_ID=G-...
```

## Important Notes
- **Security:** API keys not logged, stored, or sent to backend
- **Pricing:** Updated quarterly (Q4 2025, Q1 2026, etc.)
- **Sponsorships:** Config-driven; no code changes needed to add sponsors
- **Anthropic API:** Blocked until Anthropic releases public usage API

## Launch Checklist
See **[v10_LAUNCH_CHECKLIST.md](/_docs/v10_LAUNCH_CHECKLIST.md)** for detailed pre-deployment tasks.

**Sign-Offs Needed:**
- [ ] Product Lead ✅ Pending
- [ ] Engineering Lead ✅ Pending
- [ ] Finance Lead ✅ Pending

## Questions & Support
- **Technical Issues:** Create issue in GitHub repo
- **Sponsor Inquiries:** ads@howstud.io
- **Feature Requests:** GitHub discussions or community Slack

---

**Last Updated:** November 16, 2025  
**Version:** 2.0 (v10 revision)  
**Status:** Pre-Launch (Awaiting Final Sign-Off)
