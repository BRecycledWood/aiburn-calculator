# AIBurn v10 – Launch Checklist
**Pre-Production Deployment Verification**

**Target Launch:** November 20, 2025  
**Status:** Pre-Launch (as of Nov 16)

---

## Code & Functionality

### Core Calculator
- [x] Quick Calculator mode fully functional
- [x] Model selection & state management
- [x] Token slider (1M–200M range)
- [x] Cost calculation logic accurate
- [ ] Unit tests written (calculation ±0.05% accuracy)
- [ ] Edge case handling (0 tokens, max tokens, invalid input)

**Owner:** Frontend Team  
**Status:** ✅ Functional (Tests pending)

---

### API Integrations

#### OpenAI Usage API
- [x] API endpoint configured (`https://api.openai.com/v1/usage`)
- [x] Bearer token authentication
- [x] Usage data parsing (30-day window)
- [x] Model breakdown extraction
- [x] Error handling (invalid keys, network errors)
- [ ] Rate limiting implemented (prevent abuse)
- [ ] Request retry logic (exponential backoff, max 3 attempts)
- [ ] API response caching (1 hour TTL)

**Owner:** Backend Team  
**Status:** ✅ Functional (Rate limiting pending)

---

#### Anthropic API
- [ ] Waiting for public Anthropic usage API release
- [ ] Mark as "Coming Soon" in UI
- [ ] Link to Anthropic docs page

**Owner:** Backend Team  
**Status:** ⏸️ Blocked (Anthropic dependency)

---

### Results Display
- [x] Current cost card (gradient, responsive)
- [x] Token breakdown display
- [x] Alternatives table (sorted by savings)
- [x] Savings badges (color-coded: green/red)
- [x] Provider links (verify pricing)
- [ ] Accessibility: ARIA labels on all badges
- [ ] Mobile optimization: Stack table into cards on <600px

**Owner:** Frontend Team  
**Status:** ✅ Complete

---

### Sharing Features
- [x] Twitter/X share button
- [x] Tweet pre-population with cost + savings
- [x] URL encoding validation
- [ ] Tweet preview modal (optional)
- [x] Screenshot download (Canvas-based)
- [ ] Screenshot quality validation (retina displays)
- [ ] Mobile screenshot layout test

**Owner:** Frontend Team  
**Status:** ✅ Complete

---

### Pricing Reference Table
- [x] All 7 models with Nov 2025 pricing
- [x] Quality badges (Highest/High/Good)
- [x] Provider links
- [x] Hover effects
- [x] Responsive table scroll (mobile)
- [ ] Pricing source documentation (where rates came from)
- [ ] Version control for pricing updates

**Owner:** Data Team  
**Status:** ✅ Complete

---

### Ad Network
- [x] `sponsorSlots` configuration object
- [x] 6 ad slot definitions (premium, rotating, in-content, footer)
- [x] Ad metrics dashboard
- [x] Rotating carousel logic (10s interval)
- [ ] Ad click tracking (Google Analytics event)
- [ ] Ad impression logging
- [ ] Sponsor self-service management UI (defer to Phase 2)

**Owner:** Frontend + Growth  
**Status:** ✅ Framework complete (tracking pending)

---

## Testing & QA

### Browser Compatibility
- [ ] Chrome/Chromium (latest 2 versions)
  - [ ] Desktop
  - [ ] Mobile (Android)
- [ ] Safari (macOS latest)
  - [ ] Desktop
  - [ ] Mobile (iOS)
- [ ] Firefox (latest 2 versions)
  - [ ] Desktop
- [ ] Edge (latest 2 versions)
  - [ ] Desktop

**Owner:** QA Team  
**Status:** ⏳ In Progress

---

### Device & Viewport Testing
- [ ] Mobile: 375px (iPhone SE)
- [ ] Tablet: 768px (iPad)
- [ ] Laptop: 1024px, 1440px
- [ ] Desktop: 1920px, 2560px (ultra-wide)
- [ ] Screenshot testing on different OS (macOS, Windows)
- [ ] Touch interactions: slider, buttons, links

**Owner:** QA Team  
**Status:** ⏳ In Progress

---

### Functional Testing

#### Quick Calculator
- [ ] Model selection state persists across mode switch
- [ ] Token slider min/max bounds enforced
- [ ] Calculation produces expected output
- [ ] All 7 models calculate correctly
- [ ] Sorting (highest savings first) works

**Owner:** QA Team  
**Effort:** 2 hours  
**Status:** ⏳ Todo

#### Exact Usage
- [ ] OpenAI key validation (valid vs. invalid)
- [ ] Error messages user-friendly
- [ ] 30-day window parsing correct
- [ ] Model breakdown percentages sum to 100%
- [ ] Network timeout handling (>5s)
- [ ] Concurrent requests handled

**Owner:** QA Team  
**Effort:** 3 hours  
**Status:** ⏳ Todo

#### Sharing
- [ ] Twitter button opens correct URL
- [ ] Tweet includes cost + alternative
- [ ] Screenshot downloads without errors
- [ ] Image renders on different screens
- [ ] Screenshot includes brand logo

**Owner:** QA Team  
**Effort:** 2 hours  
**Status:** ⏳ Todo

---

### Performance Testing

#### Metrics Target
- [ ] **First Contentful Paint (FCP):** <1.5s
- [ ] **Largest Contentful Paint (LCP):** <2.5s
- [ ] **Interaction to Next Paint (INP):** <100ms
- [ ] **Cumulative Layout Shift (CLS):** <0.1
- [ ] **Time to Interactive (TTI):** <3s
- [ ] **Lighthouse Score:** ≥90

**Tools:** Chrome DevTools, Lighthouse, WebPageTest  
**Owner:** Frontend + QA  
**Status:** ⏳ In Progress

---

### Accessibility Audit (WCAG 2.1 Level AA)

#### Color & Contrast
- [ ] Text contrast ratio ≥4.5:1 (AA standard)
- [ ] Graphics contrast ratio ≥3:1 (AA standard)
- [ ] Color not sole means of conveying info (alternative: text, icon)
- [ ] Savings badge: red/green + text label (not color alone)

**Owner:** QA  
**Status:** ⏳ Todo

#### Keyboard Navigation
- [ ] Tab order logical (left-to-right, top-to-bottom)
- [ ] Focus visible on all interactive elements
- [ ] Model grid selectable via Tab + Enter
- [ ] Slider operable with arrow keys
- [ ] Buttons responsive to Enter/Space
- [ ] Escape key closes modals (if any)

**Owner:** QA  
**Status:** ⏳ Todo

#### Screen Reader
- [ ] Page title descriptive
- [ ] Heading hierarchy correct (H1, H2, H3)
- [ ] ARIA labels on icon-only buttons
- [ ] Form labels associated with inputs
- [ ] Data table headers properly marked
- [ ] Alternative text for images (logo, badges)
- [ ] Skip to main content link (optional but recommended)

**Tools:** NVDA (Windows), JAWS (if available), VoiceOver (macOS)  
**Owner:** QA  
**Status:** ⏳ Todo

---

### Security Testing

#### API Key Handling
- [ ] API key NOT logged to console
- [ ] API key NOT sent to backend (client-side only)
- [ ] API key NOT stored in localStorage
- [ ] API key cleared on page reload
- [ ] HTTPS enforced (no mixed content)
- [ ] Content Security Policy (CSP) headers configured

**Owner:** Security Team / Backend  
**Status:** ⏳ Review needed

#### Rate Limiting
- [ ] API calls rate-limited (e.g., 1 request per 5 seconds)
- [ ] Concurrent requests prevented (e.g., only 1 active fetch)
- [ ] DoS protection (user can't spam 1000s of API calls)
- [ ] Error message for rate limit exceeded

**Owner:** Backend  
**Status:** ⏳ Todo

#### Input Validation
- [ ] Model selection: only allowed values
- [ ] Token input: integers only, within bounds
- [ ] API key: basic validation (length > 0, looks like API key)
- [ ] No code injection possible (inputs are validated/sanitized)

**Owner:** Frontend + Backend  
**Status:** ⏳ Todo

---

## Deployment & Infrastructure

### Vercel Setup
- [x] Project created on Vercel
- [x] GitHub repo connected (auto-deploy on `main` push)
- [x] Environment variables configured (`.env.local`)
- [ ] Build logs reviewed (no errors/warnings)
- [ ] Deployment size <2MB (bundle size optimized)
- [ ] Preview deployment working

**Owner:** DevOps  
**Status:** ✅ Complete (ready for final deploy)

---

### Domain & DNS
- [ ] Domain registered: `aiburn.howstud.io`
- [ ] DNS A record points to Vercel IP
- [ ] DNS propagation verified (ping domain)
- [ ] HTTPS certificate issued (auto via Vercel)
- [ ] Certificate renewal auto-enabled

**Owner:** DevOps  
**Status:** ⏳ Pending (register domain if not done)

---

### CDN & Caching
- [ ] Vercel Edge Network enabled (global distribution)
- [ ] Cache headers configured (static assets: 1 year, HTML: 1 hour)
- [ ] Cache invalidation tested (push to main = cache clear)
- [ ] Gzip compression enabled (automatic with Vercel)

**Owner:** DevOps  
**Status:** ✅ Vercel defaults

---

### Monitoring & Observability

#### Error Tracking
- [ ] Sentry project created & configured
- [ ] Sentry key injected into frontend code
- [ ] Source maps uploaded for stack traces
- [ ] Alerts configured (critical errors → Slack/email)
- [ ] Test error reported to verify integration

**Owner:** DevOps  
**Status:** ⏳ Todo

#### Analytics
- [ ] Google Analytics 4 property created
- [ ] GA code injected into HTML
- [ ] Events defined:
  - [ ] `calculator_quick_run` (Quick mode calculation)
  - [ ] `calculator_exact_run` (Exact usage attempt)
  - [ ] `share_twitter_click` (Share button)
  - [ ] `share_screenshot_click` (Screenshot download)
  - [ ] `ad_impression` (Ad shown)
  - [ ] `ad_click` (Sponsor click)
  - [ ] `model_selected` (Model chosen)
- [ ] Real-time dashboard setup
- [ ] Test events sent & verified

**Owner:** Growth + DevOps  
**Status:** ⏳ Todo

#### Uptime Monitoring
- [ ] Uptime monitoring service (Pingdom, Checkly, UptimeRobot)
- [ ] Alerts to Slack/PagerDuty on downtime
- [ ] Health check endpoint configured (`/health` or similar)
- [ ] 99.5% uptime SLA target

**Owner:** DevOps  
**Status:** ⏳ Todo

---

### Backup & Disaster Recovery
- [ ] GitHub repo is source of truth (backed up)
- [ ] Vercel auto-deploys from GitHub
- [ ] Data persistence: none required (stateless app)
- [ ] Disaster recovery plan: redeploy from GitHub <5 min

**Owner:** DevOps  
**Status:** ✅ Complete (GitHub + Vercel = automatic)

---

## Documentation & Handoff

### Code Documentation
- [ ] README.md updated (setup, deployment, local dev)
- [ ] Component comments (why, not what)
- [ ] Complex logic documented (API parsing, calculations)
- [ ] Env variables documented (which ones, what they do)

**Owner:** Frontend  
**Status:** ⏳ Todo

### Operational Runbook
- [ ] Runbook created: "How to deploy & monitor AIBurn"
- [ ] Common issues documented (e.g., "My API key doesn't work")
- [ ] Escalation path defined (who to contact if downtime)
- [ ] Manual deployment steps (if Vercel auto-deploy fails)

**Owner:** DevOps  
**Status:** ⏳ Todo

### Sponsor Onboarding Docs
- [ ] Sponsor inquiry form created (email template: ads@howstud.io)
- [ ] Pricing sheet (slot descriptions, pricing, terms)
- [ ] Setup instructions (how to add sponsor to code)
- [ ] Reporting template (monthly impressions/clicks)

**Owner:** Growth + Marketing  
**Status:** ⏳ Todo

---

## Marketing & Launch

### Launch Assets
- [ ] Blog post written ("Launching AIBurn: AI Cost Calculator")
- [ ] Social media graphic designed (1200×630px for Twitter)
- [ ] Tweet drafted (concise, link to tool, CTA)
- [ ] LinkedIn post drafted (B2B angle, thought leadership)
- [ ] Email drafted (send to mailing list)
- [ ] Announcement in HOWstud.io Discord/Slack

**Owner:** Marketing  
**Status:** ⏳ Todo

### PR & Outreach
- [ ] Tech journalist/influencer outreach list
- [ ] Product Hunt submission (optional, if applicable)
- [ ] Reddit post (r/webdev, r/AIStartups, etc.)
- [ ] HN post (if novel/interesting)

**Owner:** Marketing  
**Status:** ⏳ Todo

### Launch Day Comms
- [ ] Twitter thread scheduled (5–7 tweets)
- [ ] Email blast sent (mailing list)
- [ ] Blog post published
- [ ] Slack announcement (team + community)
- [ ] Discord announcement (HOWstud.io community)

**Owner:** Marketing + Product  
**Status:** ⏳ Todo

---

## Sign-Offs & Approvals

### Technical Approval
- [ ] **Frontend Lead:** Code quality, performance, accessibility ✅ Pending
- [ ] **Backend Lead:** API integrations, security, error handling ✅ Pending
- [ ] **DevOps Lead:** Deployment, monitoring, infrastructure ✅ Pending

### Product Approval
- [ ] **Product Manager:** Feature completeness, user flow, success metrics ✅ Pending
- [ ] **Design Lead:** Visual design, mobile UX, brand consistency ✅ Pending

### Business Approval
- [ ] **Finance:** Ad pricing model, revenue targets ✅ Pending
- [ ] **Legal:** Terms of service (API key usage), privacy policy ✅ Pending

---

## Final Pre-Launch Checklist (48 Hours Before)

### Day Before Launch (Nov 19)
- [ ] QA final full regression test
- [ ] Performance audit (Lighthouse ≥90)
- [ ] Security audit sign-off
- [ ] All sign-offs collected
- [ ] Rollback plan documented
- [ ] Team on-call schedule confirmed

### Day of Launch (Nov 20)
- [ ] Morning: dry-run deployment to staging
- [ ] Verify staging = production parity
- [ ] Production deployment (coordinated with team)
- [ ] Monitor error dashboard (first 30 min: actively watch)
- [ ] Smoke test (manual verification of key flows)
- [ ] Launch blog post published
- [ ] Social media posts go live
- [ ] Slack announcement sent

### Post-Launch Monitoring (First Week)
- [ ] Daily standups (quick sync)
- [ ] Error dashboard reviewed (Sentry)
- [ ] Analytics dashboard monitored (GA)
- [ ] User feedback collected (email, support)
- [ ] Hot fixes deployed if critical issues found
- [ ] Weekly retrospective (what went well, what to improve)

---

## Risk Mitigation

| Risk | Contingency Plan |
|------|------------------|
| **Deployment fails** | Rollback to previous version via Vercel; revert GitHub commit |
| **API key security issue** | Take site offline; audit code; relaunch after fix |
| **High error rate** | Investigate in Sentry; deploy hot fix; communicate status |
| **Sponsor unhappy with CTR** | Review data; offer optimization; consider placement change |
| **DDoS / bot traffic** | Enable Cloudflare DDoS protection; implement rate limiting |

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Lead | _________________ | _________________ | _____ |
| Engineering Lead | _________________ | _________________ | _____ |
| DevOps Lead | _________________ | _________________ | _____ |
| Finance Lead | _________________ | _________________ | _____ |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-16 | HOW Ops Agent | Initial pre-launch checklist |

---

**Launch Date Target:** November 20, 2025  
**Status:** Ready for final review & sign-off  
**Questions?** Contact Product Lead

---

*Last updated: November 16, 2025 at 10:00 AM EST*
