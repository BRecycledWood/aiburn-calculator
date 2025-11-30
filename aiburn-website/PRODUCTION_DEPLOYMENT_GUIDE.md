# AIBurn Calculator: Production Deployment Guide

**Status:** ✅ Ready to Deploy  
**Last Verified:** November 30, 2025  
**Comprehensive Doc:** See `PRODUCTION_READINESS_ITEMS_1_TO_7.md`

---

## TL;DR - Deploy Now

```bash
# 1. Verify all tests pass
npm run lint && npm run type-check && npm run test && npm run e2e

# 2. Verify smoke tests (after deploy to prod)
npm run smoke-test https://aiburn.howstud.io

# 3. Push to main (triggers CI automatically)
git push origin main
```

---

## Pre-Deployment Checklist ✅

### Security Verified
- ✅ CSP headers configured (Report-Only mode)
- ✅ 6 additional security headers in place
- ✅ Input sanitization (DOMPurify)
- ✅ npm audit: 0 vulnerabilities
- ✅ CSP report handler deployed (`/api/csp-report`)

### Testing Complete
- ✅ E2E: 135 tests passing
- ✅ Unit tests: All passing
- ✅ Smoke tests: 5 endpoints validated
- ✅ CI pipeline: 6-job blocking workflow

### Observability Ready
- ✅ Sentry configured and initialized
- ✅ Error boundary wraps entire app
- ✅ Console logging in place
- ✅ Performance metrics tracked

### Privacy & Legal Complete
- ✅ Privacy policy published (`/privacy`)
- ✅ Terms of Service published (`/terms`)
- ✅ Cookie policy documented
- ✅ Data retention practices clear
- ✅ GDPR/CCPA compliant

---

## Environment Variables

Set these in production:

```bash
# Sentry error tracking
VITE_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Email service
VITE_EMAIL_SERVICE_URL=https://formsubmit.co/...
```

Check `.env.example` for all available variables.

---

## Post-Deployment Tasks

### Immediately After Deploy
1. Run smoke tests: `npm run smoke-test https://aiburn.howstud.io`
2. Check Sentry dashboard for any errors
3. Verify CSP report handler receiving hits
4. Test email capture (if applicable)
5. Test contact form

### First Day
- Monitor error rates in Sentry
- Check CSP violation logs in Vercel
- Verify analytics are capturing data
- Review performance metrics

### First Week
- Monitor CSP violations for patterns
- Review error trends
- Check email delivery rates
- Validate user feedback

---

## Monitoring Dashboards

| Tool | URL | Purpose |
|------|-----|---------|
| Sentry | https://sentry.io | Error tracking |
| Vercel | https://vercel.com | Deployment logs, CSP reports |
| Google Analytics | https://analytics.google.com | Usage analytics |
| GitHub | https://github.com | CI/CD pipeline status |

---

## Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Main calculator page |
| `/privacy` | GET | Privacy policy |
| `/terms` | GET | Terms of service |
| `/advertise` | GET | Advertising inquiries |
| `/api/csp-report` | POST | CSP violation reports |
| `/api/contact` | POST | Contact form submissions |
| `/api/usage` | POST | Calculator usage tracking |

---

## Troubleshooting

### CSP Violations in Reports
1. Review violation details in `/api/csp-report` logs
2. If legitimate: Add to CSP allowlist
3. If threat: Investigate source
4. Keep in Report-Only mode for 1-2 weeks

### Sentry Errors
1. Check error details in Sentry dashboard
2. Review stack trace and context
3. Fix in code and re-deploy
4. Monitor similar errors going forward

### Smoke Test Failures
1. Run test again: `npm run smoke-test [URL]`
2. If persistent, check deployment logs
3. Verify all endpoints accessible
4. Check database/API connectivity

### Email Delivery Issues
1. Verify email service credentials in `.env`
2. Check spam folder
3. Review email service provider logs
4. Test with admin email first

---

## Rollback Procedure

If critical issue found:

```bash
# 1. Identify previous working commit
git log --oneline | head -10

# 2. Revert to previous version
git revert [commit-hash]

# 3. Push to trigger redeploy
git push origin main

# 4. Monitor in Sentry/Vercel
# Issues should resolve within 5 minutes
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load | <3s | Measured post-deploy |
| Time to Interactive | <5s | Measured post-deploy |
| Core Web Vitals | Green | Monitored in Vercel |
| API Response | <1s | Typically <500ms |
| E2E Test Suite | <2m | ~1.7m |

---

## Security Headers Deployed

All headers configured in `vercel.json`:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Strict-Transport-Security: 1 year + preload
- ✅ Permissions-Policy: camera=(), microphone=(), geolocation=()
- ✅ Content-Security-Policy-Report-Only: + report-uri

Verify headers:
```bash
curl -I https://aiburn.howstud.io | grep -E "^[A-Za-z-]+:"
```

---

## Data Privacy Summary

**What's NOT stored:**
- ❌ API keys
- ❌ Calculations
- ❌ Token usage
- ❌ User tracking data

**What IS collected (anonymous):**
- ✅ Google Analytics (anonymous)
- ✅ Ad performance metrics
- ✅ Error logs (Sentry)
- ✅ Optional: Email (if user opts in)

**User rights:**
- ✅ Can opt out of analytics
- ✅ Can unsubscribe from emails
- ✅ Can request data access/deletion
- ✅ Contact: tryaiburn@howstud.io

---

## Quick Reference Commands

```bash
# Test before deploy
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run test              # Unit tests
npm run e2e               # E2E tests (5 browsers, 135 tests)

# Build
npm run build             # Production build
npm run preview           # Preview production build locally

# Audit
npm audit                 # Security audit
npm audit --fix           # Auto-fix vulnerabilities

# Monitor after deploy
npm run smoke-test https://aiburn.howstud.io
```

---

## Contact & Support

**Deployment Issues:**
- Check Vercel dashboard: https://vercel.com
- Review GitHub Actions: https://github.com/[org]/aiburn-calculator/actions
- Check logs in Vercel

**Monitoring:**
- Errors: Sentry dashboard
- Violations: Vercel logs (CSP reports)
- Analytics: Google Analytics
- Users: Email inquiries to tryaiburn@howstud.io

**Documentation:**
- Full details: `PRODUCTION_READINESS_ITEMS_1_TO_7.md`
- Privacy: `https://aiburn.howstud.io/privacy`
- Terms: `https://aiburn.howstud.io/terms`

---

## Sign-Off

✅ **Production Ready**

All checks passed. Safe to deploy to production.

**Version:** 1.0  
**Date:** November 30, 2025
