# AIBurn v10 Task List & Development Roadmap
**Owner:** HOW Ops Agent  
**Status:** Active Development  
**Last Updated:** November 16, 2025

---

## Quick Navigation

- **Phase 1 (MVP):** Tasks for v10 launch (in progress)
- **Phase 2 (Growth):** v11–v12 expansion tasks
- **Phase 3 (Scale):** Long-term feature roadmap

---

## Phase 1: MVP (v10 - Launch Target: EOW Nov 20, 2025)

### Core Features - Development

#### 1.1 Quick Calculator
- [x] Model grid layout & selection state
- [x] Token range slider (1M–200M)
- [x] Cost calculation logic (input/output ratio assumption)
- [x] Alternative models sorted by savings
- [x] Responsive grid layout (mobile-first)
- [ ] Unit tests for calculation accuracy (target: ±0.05%)
- [ ] Keyboard navigation (Tab through models)

**Owner:** Frontend  
**Blocked By:** None  
**Estimated Effort:** 4 hours (complete)

---

#### 1.2 Exact Usage API Integration
- [x] Mode toggle (Quick | Exact)
- [x] Provider selection (OpenAI | Anthropic)
- [x] Secure API key input (password field)
- [x] OpenAI usage API fetch & parsing
- [x] Model breakdown display
- [x] Error handling (invalid keys, network errors)
- [ ] Anthropic API support (blocked by Anthropic – planned TBD)
- [ ] Rate limiting (prevent key abuse)
- [ ] Request retry logic (exponential backoff)

**Owner:** Frontend + Backend  
**Blocked By:** Anthropic public usage API release  
**Estimated Effort:** 6 hours (OpenAI complete, Anthropic blocked)

---

#### 1.3 Results Display & Sharing
- [x] Current cost card (purple gradient, large typography)
- [x] Token breakdown (input/output display)
- [x] Alternatives table (sortable, color-coded)
- [x] Savings badges (green/red conditional)
- [x] Twitter share button + URL encoding
- [x] Screenshot download (Canvas-based, 1200×630px)
- [ ] Tweet preview / preview modal
- [ ] Screenshot quality testing (retina displays)
- [ ] Mobile screenshot layout (mobile card format)

**Owner:** Frontend  
**Blocked By:** None  
**Estimated Effort:** 5 hours (complete)

---

#### 1.4 Pricing Table
- [x] Static table with 7 models (OpenAI 4, Anthropic 3, Groq 1, DeepSeek 1)
- [x] Pricing data (Nov 2025 rates)
- [x] Quality badges (Highest/High/Good)
- [x] Provider links for verification
- [x] Hover effects & responsive scroll
- [ ] Pricing history log (version control)
- [ ] Automated pricing import script (future)

**Owner:** Frontend + Data  
**Blocked By:** None  
**Estimated Effort:** 2 hours (complete)

---

#### 1.5 Ad Network Framework
- [x] `sponsorSlots` config object with 6 slots
- [x] Premium static slots (header, sidebar)
- [x] Featured rotating carousel (10s intervals)
- [x] In-content banners (top/bottom)
- [x] Footer banner
- [x] Ad metrics dashboard (total slots, sold, available)
- [x] Sponsor management CMS structure (no code edits needed)
- [ ] Ad click tracking (Google Analytics events)
- [ ] Ad impression logging
- [ ] Sponsor reporting dashboard

**Owner:** Frontend + Growth  
**Blocked By:** None  
**Estimated Effort:** 3 hours (config complete, tracking TBD)

---

### Testing & QA

#### 1.6 Unit & Integration Tests
- [ ] Quick Calculator calculation accuracy tests
- [ ] OpenAI API parsing tests (mock responses)
- [ ] Savings calculation verification
- [ ] Model selection state tests
- [ ] Sharing URL encoding tests
- [ ] Test coverage target: ≥80%

**Owner:** QA + Frontend  
**Blocked By:** None  
**Estimated Effort:** 8 hours

---

#### 1.7 Browser & Device Testing
- [x] Chrome/Edge (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Mobile viewports: 375px, 768px, 1024px, 1440px+
- [ ] Screenshot generation on different OS (macOS, Windows, Linux)
- [ ] Touch interactions (slider, buttons)

**Owner:** QA  
**Blocked By:** None  
**Estimated Effort:** 6 hours

---

#### 1.8 Performance & Accessibility
- [ ] Lighthouse audit: ≥90 score
- [ ] First Contentful Paint (FCP): <1.5s
- [ ] Interaction to Next Paint (INP): <100ms
- [ ] Cumulative Layout Shift (CLS): <0.1
- [ ] WCAG 2.1 AA compliance
  - [ ] Color contrast (4.5:1 text, 3:1 graphics)
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] Screen reader testing (NVDA, JAWS)
  - [ ] ARIA labels on all interactive elements

**Owner:** QA + Frontend  
**Blocked By:** None  
**Estimated Effort:** 10 hours

---

### Launch & Deployment

#### 1.9 Deployment Pipeline
- [x] Vercel project setup
- [x] Environment variables (.env.local)
- [x] Auto-deploy on main branch
- [ ] Production domain setup (aiburn.howstud.io)
- [ ] HTTPS certificate validation
- [ ] DNS propagation check
- [ ] CDN cache headers configured

**Owner:** DevOps + Frontend  
**Blocked By:** Domain registration  
**Estimated Effort:** 3 hours

---

#### 1.10 Monitoring & Analytics
- [ ] Sentry error tracking connected
- [ ] Google Analytics 4 event tracking:
  - [ ] Page views
  - [ ] Quick calc runs
  - [ ] Exact usage attempts
  - [ ] Share button clicks
  - [ ] Ad impressions/clicks
- [ ] Uptime monitoring (Pingdom or similar)
- [ ] Daily standup dashboard

**Owner:** DevOps + Growth  
**Blocked By:** None  
**Estimated Effort:** 4 hours

---

#### 1.11 Launch Checklist
- [ ] Final PRD sign-off (all stakeholders)
- [ ] Security audit complete (no key logging, HTTPS enforced)
- [ ] API rate limiting tested (no DoS vulnerability)
- [ ] Error messages user-friendly
- [ ] Help text / onboarding clear
- [ ] Social preview cards (OG tags)
- [ ] Launch blog post drafted (technical deep-dive)
- [ ] Launch tweet prepared
- [ ] Slack notification (internal)

**Owner:** Product + Marketing  
**Blocked By:** None  
**Estimated Effort:** 2 hours

---

## Phase 1 Summary

| Task | Status | Owner | ETA |
|------|--------|-------|-----|
| Core calculator & API | Complete | Frontend | Nov 18 |
| Testing & QA | In Progress | QA | Nov 19 |
| Deployment & launch | Ready | DevOps | Nov 20 |

**Phase 1 Total Effort:** ~48 hours (6 days @ 8 hrs/day)  
**Launch Date:** November 20, 2025 (EOW target)

---

## Phase 2: Growth (v11–v12, Dec 2025 – Jan 2026)

### Feature Development

#### 2.1 Anthropic Usage API Integration
- [ ] Wait for Anthropic to release public usage API
- [ ] Implement API parsing (similar to OpenAI)
- [ ] Update mode selection UI (enable Anthropic button)
- [ ] Test with live Anthropic accounts
- [ ] Documentation update

**Owner:** Frontend + Backend  
**Blocked By:** Anthropic API release  
**Estimated Effort:** 4 hours (when unblocked)  
**Target Launch:** Q4/Q1 2025-26 (TBD)

---

#### 2.2 Additional LLM Providers
- [ ] OpenRouter support (meta-provider aggregator)
- [ ] Replicate integration (serverless model endpoint)
- [ ] Hugging Face Inference API
- [ ] Together.ai
- [ ] Model price fetching from public APIs

**Owner:** Frontend + Backend  
**Blocked By:** Provider API documentation  
**Estimated Effort:** 20 hours (4–5 hours per provider)  
**Target Launch:** January 2026

---

#### 2.3 User Accounts & Report Persistence
- [ ] Supabase project setup (auth + database)
- [ ] User registration/login flow (email + OAuth)
- [ ] Save calculation history
- [ ] Report storage (JSON + PDF export)
- [ ] Retrieve past reports
- [ ] User dashboard (list of reports)

**Owner:** Backend + Frontend  
**Blocked By:** None  
**Estimated Effort:** 24 hours  
**Target Launch:** December 2025

---

#### 2.4 Sponsor Onboarding & Management
- [ ] Sponsor intake form (name, logo, CTA URL, budget)
- [ ] Billing integration (Stripe)
- [ ] Monthly invoice generation
- [ ] Sponsor portal (self-service slot management)
- [ ] A/B testing slots (CTR comparison)
- [ ] Monthly reporting email

**Owner:** Growth + Backend  
**Blocked By:** None  
**Estimated Effort:** 16 hours  
**Target Launch:** December 2025 (sponsor onboarding)

---

#### 2.5 Cost Trending & Historical Data
- [ ] Trend chart (monthly cost over 3–6 months)
- [ ] Savings projection (if user switched providers)
- [ ] Model usage timeline (which models used each month)
- [ ] Download historical data (CSV export)

**Owner:** Frontend + Backend  
**Blocked By:** User accounts (2.3)  
**Estimated Effort:** 12 hours  
**Target Launch:** January 2026

---

### Growth & Marketing

#### 2.6 Sponsor Recruitment (Growth)
- [ ] Identify 10 target sponsors (LLM providers + alternative models)
- [ ] Personalized pitch emails
- [ ] Case studies (if v10 generates early revenue)
- [ ] Success metrics documentation
- [ ] Goal: 3–4 paying sponsors

**Owner:** Growth + Sales  
**Blocked By:** None  
**Estimated Effort:** 8 hours (research + outreach)  
**Target:** December 2025

---

#### 2.7 Content Marketing
- [ ] Blog post: "The True Cost of AI Models" (thought leadership)
- [ ] Case study: "$XXX saved by switching to Claude" (user story)
- [ ] Social series: 5 tips for LLM cost optimization (Twitter/LinkedIn)
- [ ] Technical deep-dive: How pricing changes affect your budget
- [ ] Product update email to mailing list

**Owner:** Marketing + Content  
**Blocked By:** Launch completion (Phase 1)  
**Estimated Effort:** 12 hours  
**Target:** Late November / Early December

---

#### 2.8 Community & Feedback Loop
- [ ] Community Slack channel (AIBurn beta testers)
- [ ] Monthly feature request voting (Canny or similar)
- [ ] User feedback surveys (email + in-app)
- [ ] Office hours / live demo (Zoom, monthly)
- [ ] Target: 100+ active community members by Jan 2026

**Owner:** Product + Community  
**Blocked By:** None  
**Estimated Effort:** 6 hours (setup + moderation)  
**Target:** December 2025

---

### Optimization & Experimentation

#### 2.9 A/B Testing Framework
- [ ] Split testing on ad placements (rotate vs. static)
- [ ] CTA copy testing (e.g., "Calculate My Costs" vs. "Find My Savings")
- [ ] Pricing page variations (different color schemes)
- [ ] Sharing incentive testing (reward if share?)
- [ ] Goal: Identify top-performing variants

**Owner:** Growth + Frontend  
**Blocked By:** None  
**Estimated Effort:** 8 hours (framework setup)  
**Target:** January 2026

---

## Phase 2 Summary

| Task | Status | Owner | ETA |
|------|--------|-------|-----|
| Anthropic API | Blocked | Backend | Q4/Q1 |
| Additional providers | Planned | Backend | Jan 2026 |
| User accounts | Ready | Backend | Dec 2025 |
| Sponsor management | Ready | Growth | Dec 2025 |
| Content & marketing | Ready | Marketing | Nov–Dec |

**Phase 2 Total Effort:** ~108 hours (14 days @ 8 hrs/day, spread over 2 months)  
**Target Revenue:** $1,000–$3,000/mo (2–4 sponsors × $499–$1,499)

---

## Phase 3: Scale & Platform (Q1 2026+)

### Platform Features

#### 3.1 Premium Tier & API Access
- [ ] Premium user tier ($9/mo or similar)
  - [ ] Detailed analytics dashboard
  - [ ] Historical data access
  - [ ] API key (JSON export)
  - [ ] Priority email support
- [ ] Public API for embed or programmatic access
- [ ] Affiliate program (creators monetize calculator)

**Estimated Effort:** 24 hours  
**Target Launch:** Q1 2026

---

#### 3.2 Team & Organization Features
- [ ] Multi-user accounts (invite team members)
- [ ] Organization dashboard (aggregate costs across team)
- [ ] Usage alerts & budget thresholds (email notifications)
- [ ] Role-based access (admin, viewer, editor)
- [ ] SSO support (Google / Microsoft / GitHub)

**Estimated Effort:** 32 hours  
**Target Launch:** Q2 2026

---

#### 3.3 Mobile Apps (iOS / Android)
- [ ] React Native port or Flutter app
- [ ] Native push notifications for cost alerts
- [ ] Offline support (cached model data)
- [ ] Home screen widget (quick cost check)

**Estimated Effort:** 40 hours (or partner with agency)  
**Target Launch:** Q2–Q3 2026

---

### Monetization & Business

#### 3.4 Affiliate & Partner Program
- [ ] Commissions for referred sign-ups (5–10%)
- [ ] Creator marketplace (YouTubers, bloggers promote AIBurn)
- [ ] Partner integrations (e.g., LLM provider dashboards link to AIBurn)
- [ ] Revenue share model (30–50% of sponsor fees)

**Estimated Effort:** 8 hours (business development)  
**Target Launch:** Q1 2026

---

#### 3.5 Enterprise Licensing
- [ ] Custom pricing for teams 50+ members
- [ ] Self-hosted option (on-premise calculator)
- [ ] SLA & dedicated support
- [ ] Private sponsor slots (white-label)

**Estimated Effort:** 16 hours (sales + technical)  
**Target Launch:** Q2 2026

---

### International Expansion

#### 3.6 Localization & Multi-Currency
- [ ] Support for EUR, GBP, JPY, CAD, AUD (+ local APIs)
- [ ] UI translation (English → Spanish, French, German, Simplified Chinese)
- [ ] Regional provider support (e.g., European LLMs like Aleph Alpha)
- [ ] GDPR & data residency compliance

**Estimated Effort:** 20 hours  
**Target Launch:** Q2–Q3 2026

---

## Phase 3 Summary

| Epic | Effort | Target Launch | Potential Revenue |
|------|--------|----------------|-------------------|
| Premium tier | 24h | Q1 2026 | $500–$2K/mo (100 @ $9) |
| Team features | 32h | Q2 2026 | $5K–$15K/mo (500+ teams) |
| Mobile apps | 40h | Q2–Q3 2026 | $1K–$5K/mo (ads + IAP) |
| Affiliate program | 8h | Q1 2026 | $2K–$8K/mo (partner rev share) |
| Enterprise | 16h | Q2 2026 | $5K–$20K/mo (5–10 deals) |
| Localization | 20h | Q2–Q3 2026 | +30–50% growth (intl) |

**Phase 3 Total Effort:** ~140 hours (18 days @ 8 hrs/day, spread over 6+ months)  
**Target Revenue (Combined):** $15K–$50K+/mo by end of 2026

---

## Dependencies & Blockers

| Blocker | Impact | Status | Resolution |
|---------|--------|--------|-----------|
| Anthropic API release | Exact usage for Anthropic | Waiting | TBD by Anthropic |
| Domain registration | Production deployment | Not started | Register aiburn.howstud.io |
| Supabase credentials | User accounts (Phase 2) | Ready | Create project ASAP |
| Stripe integration | Sponsor billing (Phase 2) | Ready | Set up Stripe account |
| OpenRouter API keys | Additional providers (Phase 2) | Ready | Obtain test keys |

---

## Team Assignments & Ownership

| Role | Name | Responsibilities | Availability |
|------|------|------------------|--------------|
| Product Lead | TBD | PRD ownership, feature prioritization | TBD |
| Frontend Lead | TBD | UI/UX, React components, performance | TBD |
| Backend Lead | TBD | API integrations, Supabase, Stripe | TBD |
| QA/Testing | TBD | Test plans, browser testing, A/B setup | TBD |
| Growth/Marketing | TBD | Sponsor recruitment, content, analytics | TBD |
| DevOps | TBD | Deployment, monitoring, infrastructure | TBD |

---

## Success Metrics Dashboard

**Phase 1 (Launch, Nov 20):**
- [ ] 0 critical bugs in first week
- [ ] 1,000+ users visit in Day 1
- [ ] 80%+ complete a calculation
- [ ] 5%+ share results

**Phase 2 (Growth, by Jan 31):**
- [ ] 10,000+ monthly users
- [ ] 3–4 paying sponsors ($2K–$4K MRR)
- [ ] 5%+ conversion to user accounts
- [ ] 15% share rate

**Phase 3 (Scale, by Dec 31, 2026):**
- [ ] 50K+ monthly users
- [ ] 10+ paying sponsors + premium tier ($15K+ MRR)
- [ ] 10 international markets supported
- [ ] Mobile app downloads: 5K+

---

## Appendix: Week-by-Week v10 Schedule

### Week of Nov 18 (Final Push)
| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | QA testing across browsers | QA | In Progress |
| Tue | Performance optimization (Lighthouse) | Frontend | In Progress |
| Wed | Accessibility audit (WCAG 2.1) | QA | Todo |
| Thu | Launch checklist + dry-run deployment | DevOps | Todo |
| Fri | Deploy to production + monitor | DevOps + Product | Todo |

### Week of Nov 25 (Post-Launch Support)
| Day | Task | Owner | Status |
|-----|------|--------|--------|
| Mon | Monitor errors, user feedback | Product + QA | Todo |
| Tue–Thu | Hot fixes + minor improvements | Frontend | Todo |
| Fri | Phase 2 planning session | All leads | Todo |

---

## Document Revision History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2025-11-16 | HOW Ops Agent | Initial v10 task breakdown |

**Next Review:** November 20, 2025 (post-launch retrospective)
