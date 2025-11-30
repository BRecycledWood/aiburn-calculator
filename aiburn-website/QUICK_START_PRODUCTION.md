# Quick Start: Production Deployment Guide

## TL;DR - What You Need to Do

### 1. Set Up Sentry (Error Tracking)
```bash
# Go to https://sentry.io and create a new project
# Copy your DSN and add to Vercel environment secrets
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
SENTRY_AUTH_TOKEN=your_auth_token
```

### 2. Configure GitHub Branch Protection
Go to repo settings → Branches → Add rule for `main`:
- [x] Require pull request reviews (≥1)
- [x] Require status checks to pass:
  - `security-scan`
  - `lint`
  - `test`
  - `build`
  - `e2e`
- [x] Dismiss stale review approvals
- [x] Require branches to be up to date

### 3. Verify Environment Variables in Vercel
```
✓ VITE_SENTRY_DSN
✓ NODE_ENV=production
✓ VITE_API_URL=https://aiburn.howstud.io/api
```

### 4. Run Pre-Deployment Tests
```bash
# Unit tests
npm run test:ci

# E2E tests (locally first)
npm run e2e

# Build validation
npm run build

# Smoke test (after deploy)
npm run smoke-test https://aiburn.howstud.io
```

### 5. Deploy to Production
```bash
# Push to main branch
git push origin main

# GitHub Actions will:
# 1. Run security scan ✓
# 2. Run linting ✓
# 3. Run unit tests ✓
# 4. Build application ✓
# 5. Run E2E tests ✓
# 6. Deploy to Vercel automatically

# Once deployed, run smoke tests in CI/CD
```

## Key Files & Their Purpose

| File | Purpose | Priority |
|------|---------|----------|
| `security.config.js` | CSP & security headers | HIGH |
| `.github/workflows/ci.yml` | GitHub Actions pipeline | HIGH |
| `scripts/smoke-test.js` | Post-deploy validation | HIGH |
| `src/utils/sanitizer.js` | XSS prevention | HIGH |
| `src/utils/sentry.js` | Error tracking | HIGH |
| `.env.example` | Environment variables reference | MEDIUM |
| `DEPLOYMENT_SECURITY.md` | Pre-deployment checklist | MEDIUM |
| `PRIVACY_COMPLIANCE.md` | Legal compliance | MEDIUM |

## Security Measures Enabled

✅ XSS Prevention (DOMPurify)
✅ CSP Headers (Content Security Policy)
✅ Input Validation & Sanitization
✅ Error Tracking (Sentry with secret redaction)
✅ HTTPS/TLS Enforcement
✅ Security Headers (HSTS, X-Frame-Options, etc.)
✅ GitHub Actions CI/CD with security gates
✅ Secret scanning in code and build artifacts
✅ E2E Testing across multiple browsers
✅ Post-deploy smoke tests

## Testing Checklist Before Production

- [ ] Local: `npm run build` succeeds
- [ ] Local: `npm run test:ci` passes (or check GitHub Actions)
- [ ] Local: `npm run e2e` passes (or in GitHub Actions)
- [ ] GitHub Actions workflow runs successfully
- [ ] Build artifacts have no secrets
  ```bash
  grep -r "sk-\|AKIA\|password=" dist/ 2>/dev/null || echo "✓ No secrets found"
  ```
- [ ] Vercel environment variables set
- [ ] Sentry project created and DSN configured
- [ ] GitHub branch protection enabled
- [ ] Production URL passes smoke test
  ```bash
  npm run smoke-test https://aiburn.howstud.io
  ```

## Post-Deployment Tasks

1. **Monitor Sentry Dashboard**
   - Check for error spikes
   - Verify source maps are uploaded
   - Review performance metrics

2. **Monitor Application**
   - Check website is accessible
   - Verify HTTPS working
   - Test key user flows

3. **Verify Security Headers**
   ```bash
   curl -I https://aiburn.howstud.io | grep -i "content-security\|x-frame\|hsts"
   ```

4. **Check CI/CD Integration**
   - Make a test PR
   - Verify GitHub Actions runs
   - Verify PR preview deploys

## Common Issues & Fixes

### Issue: E2E Tests Failing on Selectors
**Fix**: Update selectors in `e2e/calculator.spec.js` to match actual UI
```javascript
// Before
page.locator('text=AI Model Cost Calculator')

// After  
page.locator('h1, text=/calculator|cost/i')
```

### Issue: Sentry not capturing errors
**Fix**: Ensure DSN is set in environment and `initSentry()` called in main.jsx
```javascript
import { initSentry } from './utils/sentry'
initSentry()
```

### Issue: GitHub Actions failing
**Fix**: Check workflow logs in GitHub Actions tab and verify:
- Node version ≥ 18
- npm dependencies install correctly
- All scripts exist in package.json

### Issue: Secrets in build output
**Fix**: Check `.env.local` is in `.gitignore` and Vercel has secrets configured
```bash
echo ".env.local" >> .gitignore
```

## Useful Commands

```bash
# Run all tests locally
npm run test:all

# Run only E2E tests
npm run e2e

# Run smoke test against URL
npm run smoke-test https://aiburn.howstud.io

# Security audit
npm run security:audit

# Check for hardcoded secrets
grep -r "sk-[A-Za-z0-9-]\{20,\}" . --exclude-dir=node_modules

# View Playwright test report
npm run e2e:report

# Build and check size
npm run build && du -sh dist/

# Run specific test file
npm run e2e -- e2e/calculator.spec.js
```

## Monitoring Dashboards

1. **Sentry**: https://sentry.io/organizations/your-org/issues/
2. **Vercel**: https://vercel.com/dashboard
3. **GitHub Actions**: https://github.com/your-repo/actions
4. **Uptime Monitoring**: Set up third-party (Pingdom, UptimeRobot, etc.)

## Escalation Procedures

### Critical Error (>10 errors/min)
1. Check Sentry dashboard
2. Investigate recent changes
3. Rollback if necessary
4. Notify team

### Data Breach Suspected
1. Check server logs
2. Review error tracking logs
3. Assess data exposure
4. Notify users if required (GDPR: 72 hours)

### Performance Degradation
1. Check Sentry performance tab
2. Review database/API logs
3. Check infrastructure metrics
4. Scale if necessary

## Production Runbook

### Weekly
- [ ] Review Sentry error trends
- [ ] Check dependency updates
- [ ] Monitor performance metrics

### Monthly
- [ ] Security audit (npm audit)
- [ ] Backup verification
- [ ] Compliance review
- [ ] Performance optimization

### Quarterly
- [ ] Full security assessment
- [ ] Penetration testing (planned)
- [ ] Disaster recovery drill
- [ ] Architecture review

## Documentation Links

- [GitHub Actions Workflow](../.github/workflows/ci.yml)
- [Security Configuration](../security.config.js)
- [Deployment Security Checklist](./DEPLOYMENT_SECURITY.md)
- [Privacy & Compliance](./PRIVACY_COMPLIANCE.md)
- [Production Readiness](./PRODUCTION_READINESS.md)

---

**Status**: Ready for production deployment
**Last Updated**: Nov 29, 2025
**Next Review**: [Date]
