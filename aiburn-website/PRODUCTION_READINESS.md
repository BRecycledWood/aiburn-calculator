# Production Readiness Checklist

## Status: IN PROGRESS

Last Updated: Nov 29, 2025

## High Priority (Must Do Before Production)

### 1. E2E Testing ✅ SETUP COMPLETE
- [x] Playwright installed and configured
- [x] E2E test suite created (130+ tests)
- [x] Multiple browser support (Chrome, Firefox, Safari, Mobile)
- [ ] E2E tests passing and stable
- [ ] CI/CD integration for E2E tests

### 2. Automated Smoke Tests (Post-Deploy)
- [ ] Create smoke test script for production validation
- [ ] Test URL reachability
- [ ] Test key endpoints return 200 status
- [ ] Test form submission flows
- [ ] Integration with deployment pipeline

### 3. Security Hardening
- [ ] Install and integrate DOMPurify for input sanitization
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Verify API keys never leak to client bundles
- [ ] Ensure env vars stored in Vercel/GitHub Secrets
- [ ] Run `npm audit` with high severity threshold
- [ ] Consider Snyk or Dependabot integration

### 4. CI Pipeline Completeness
- [ ] Lint checks (ESLint)
- [ ] Unit tests gated on PR
- [ ] Build validation
- [ ] SCA (Software Composition Analysis)
- [ ] E2E tests in CI
- [ ] Block merges on failing tests

### 5. Observability & Error Tracking
- [ ] Sentry integration for JS errors
- [ ] Performance monitoring (optional: Datadog APM)
- [ ] Release tracking
- [ ] Error context and breadcrumbs

### 6. CSP Reports & Security Reporting
- [ ] Configure CSP report-uri endpoint
- [ ] Set up monitoring for CSP violations
- [ ] Create incident response plan

### 7. Privacy & Legal Compliance
- [ ] Cookie banner (if analytics present)
- [ ] Privacy policy review and accessibility
- [ ] Cookie consent implementation
- [ ] Data retention verification
- [ ] GDPR/CCPA compliance checks

## Implementation Notes

### Security Keys to Check
- OpenAI API key handling in `/api/usage`
- FormSubmit integration security
- Email addresses in code

### Files to Update
- `/api/usage.js` - API key handling
- `vite.config.js` - CSP headers
- `vercel.json` - deployment config
- GitHub Actions workflows

### Testing Strategy
1. Fix E2E test selectors to match actual UI
2. Run full test suite locally
3. Validate in staging environment
4. Create smoke test for production

## Next Steps
1. Implement DOMPurify for input sanitization
2. Configure CSP headers
3. Create smoke test script
4. Set up Sentry
5. Configure GitHub Actions CI/CD
