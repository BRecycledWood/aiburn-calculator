# Deployment Security Checklist

## Pre-Deployment Security Verification

Use this checklist before deploying to production.

### Code Security Review

- [ ] No hardcoded secrets in code
  ```bash
  # Run this to check
  grep -r "sk-\|AKIA\|password=" . --exclude-dir=node_modules --exclude-dir=.git
  ```

- [ ] All API calls sanitized
  - [ ] DOMPurify integrated for input
  - [ ] FormData properly constructed
  - [ ] No eval() or dynamic code execution

- [ ] No XXS vulnerabilities
  - [ ] User input sanitized with DOMPurify
  - [ ] No dangerouslySetInnerHTML
  - [ ] Content escaped properly

- [ ] Dependencies audited
  ```bash
  npm audit --audit-level=high
  npm outdated  # Check for updates
  ```

### Environment Variables

- [ ] All secrets stored in Vercel/GitHub Secrets
  - [ ] SENTRY_DSN configured
  - [ ] SMTP credentials secure
  - [ ] No API keys in .env file
  - [ ] VITE_ prefixed vars not containing secrets

- [ ] Production environment configured
  - [ ] NODE_ENV=production
  - [ ] VITE_API_URL points to production

- [ ] Verify no secrets in build output
  ```bash
  npm run build
  # Check dist/ for any sensitive strings
  grep -r "sk-\|AKIA\|password=" dist/
  ```

### Build Validation

- [ ] Build succeeds without warnings
  ```bash
  npm run build
  ```

- [ ] Bundle size acceptable (<1MB gzipped)
- [ ] Source maps generated for error tracking
- [ ] No console errors/warnings

### Security Headers

- [ ] CSP header configured
  - [ ] Report-only mode enabled for validation
  - [ ] CSP report URI configured

- [ ] Other headers verified in vite.config.js
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] Strict-Transport-Security enabled
  - [ ] Referrer-Policy: strict-origin-when-cross-origin

### HTTPS & TLS

- [ ] HTTPS enforced (no HTTP)
- [ ] TLS 1.2+ required
- [ ] Certificate valid
- [ ] HSTS enabled
  - [ ] max-age appropriate (31536000 = 1 year)
  - [ ] includeSubDomains set
  - [ ] preload option considered

### API Security

- [ ] POST endpoint validates request method
- [ ] API keys not returned in responses
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting implemented (if needed)
- [ ] CORS properly configured (if applicable)

### Error Tracking

- [ ] Sentry configured and tested
  ```bash
  # Test error capture
  console.error("Test Sentry error");
  ```

- [ ] Sensitive data redaction working
  - [ ] API keys redacted from errors
  - [ ] Email addresses redacted
  - [ ] No PII in error messages

- [ ] Source maps uploaded to Sentry
- [ ] Release tracking enabled

### Monitoring & Alerts

- [ ] Error tracking dashboard set up
- [ ] Alert configured for high error rates
- [ ] Sentry team members added
- [ ] Escalation process defined

### Accessibility & Compliance

- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Cookie banner visible (if analytics enabled)
- [ ] Accessibility standards met (WCAG 2.1 Level AA)

### Deployment Configuration

#### Vercel Deployment

- [ ] vercel.json configured
  ```json
  {
    "buildCommand": "npm run build",
    "installCommand": "npm install --legacy-peer-deps",
    "framework": "react"
  }
  ```

- [ ] Environment secrets set in Vercel Project
  - [ ] VITE_SENTRY_DSN
  - [ ] SENTRY_AUTH_TOKEN
  - [ ] Any other production secrets

- [ ] Domains configured
  - [ ] Primary domain (aiburn.howstud.io)
  - [ ] Aliases (if any)
  - [ ] SSL certificate auto-renewed

- [ ] Automatic deployments configured
  - [ ] Main branch deploys to production
  - [ ] Develop branch deploys to preview
  - [ ] PR previews enabled

- [ ] Build settings verified
  - [ ] Node version: 18+
  - [ ] Build timeout: 45s+ (for large bundles)
  - [ ] Function region configured

#### GitHub Configuration

- [ ] Branch protection rules enabled
  - [ ] Require PR reviews
  - [ ] Require status checks
  - [ ] Dismiss stale reviews on push
  - [ ] Require branches up to date

- [ ] Required status checks
  - [ ] CI pipeline must pass
  - [ ] Security scan must pass
  - [ ] Build must succeed

- [ ] Secrets configured
  - [ ] PRODUCTION_URL (for smoke tests)
  - [ ] SENTRY_AUTH_TOKEN

### Post-Deployment Verification

- [ ] Run smoke tests
  ```bash
  npm run smoke-test https://aiburn.howstud.io
  ```

- [ ] Verify core functionality
  - [ ] Home page loads
  - [ ] Calculator works
  - [ ] Forms submit correctly
  - [ ] Links navigate properly

- [ ] Check security headers
  ```bash
  curl -I https://aiburn.howstud.io | grep -i "content-security\|x-frame\|x-content-type\|strict-transport"
  ```

- [ ] Verify HTTPS
  - [ ] All content served over HTTPS
  - [ ] No mixed content warnings
  - [ ] Certificate details correct

- [ ] Monitor Sentry
  - [ ] No unusual error spikes
  - [ ] New release tracked
  - [ ] Source maps accessible

- [ ] Performance check
  - [ ] Page load times acceptable
  - [ ] No major performance regressions
  - [ ] Lighthouse score >= 80

### Ongoing Security

- [ ] Weekly dependency updates check
- [ ] Monthly security audit
- [ ] Quarterly penetration testing (planned)
- [ ] Annual security compliance review

---

## Incident Response

If security issues found post-deployment:

1. **Assess Severity**
   - Critical: Vulnerability affecting user data
   - High: Vulnerability affecting functionality
   - Medium: Vulnerability affecting performance

2. **Immediate Actions**
   - For critical: Consider taking site offline
   - Gather logs and evidence
   - Notify security team

3. **Response**
   - Fix vulnerability
   - Run full security audit
   - Deploy patch
   - Monitor for exploitation

4. **Communication**
   - If user data affected: Notify within 72 hours (GDPR)
   - Document incident
   - Post-mortem analysis

---

## Useful Commands

```bash
# Check for secrets in code
grep -r "sk-[A-Za-z0-9-]\{20,\}" . --exclude-dir=node_modules

# Audit dependencies
npm audit --audit-level=high

# Run security scan
npm run security:audit

# Run smoke tests
npm run smoke-test https://aiburn.howstud.io

# Check bundle size
npm run build && du -sh dist/

# Verify CSP headers
curl -I https://aiburn.howstud.io | grep CSP
```

---

**Last Updated:** Nov 29, 2025  
**Next Review:** [Enter date]
