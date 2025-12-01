# 🎯 AIBurn Cost Calculator - Action Items

**Generated:** December 1, 2025  
**Based on:** Comprehensive QC Audit Report  
**Overall Status:** ✅ PRODUCTION READY (with 3 immediate fixes)

---

## 🚀 UPDATE: ALL 3 CRITICAL FIXES COMPLETED (Dec 1, 2025)

**All critical security fixes have been implemented, tested, and committed.**

- ✅ CORS restricted on contact API
- ✅ Request body size limits enforced (10KB)  
- ✅ CSP policy hardened (unsafe-inline removed)
- ✅ All 178 tests passing
- ✅ Build succeeds (95.83 KB gzipped)

**See:** `CRITICAL_FIXES_COMPLETED.md` for detailed verification

---

## 🔴 CRITICAL - FIX BEFORE PRODUCTION DEPLOYMENT

### [x] 1. Restrict CORS on Contact API ✅ COMPLETED
**Priority:** 🔴 CRITICAL  
**Time Estimate:** 30 minutes  
**Risk Level:** Medium (Form spam/abuse)

**Task Description:**
Contact form endpoint currently accepts requests from ANY origin (`Access-Control-Allow-Origin: '*'`). This should be restricted to known domains only.

**Files to Change:**
- `api/contact.js` (lines 11-15)

**Implementation Steps:**
1. Update `setCORSHeaders` function to accept origin parameter
2. Create allowlist of approved origins
3. Return 403 if origin not in allowlist
4. Test with curl/Postman from unauthorized origin

**Acceptance Criteria:**
- ✅ Contact form works from aiburn.howstud.io
- ✅ Contact form works from localhost (dev)
- ✅ Requests from random.domain.com are blocked
- ✅ CORS headers only include approved origin

**Code Change:**
```javascript
// Before
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
};

// After
const setCORSHeaders = (res, origin) => {
  const allowedOrigins = [
    'https://aiburn.howstud.io',
    'https://aiburn-cost-calculator.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
};

// Update handler
setCORSHeaders(res, req.headers.origin);
```

---

### [x] 2. Add Request Body Size Limit ✅ COMPLETED
**Priority:** 🔴 CRITICAL  
**Time Estimate:** 45 minutes  
**Risk Level:** Medium (DoS attacks)

**Task Description:**
No limit on request body size could allow attackers to send large payloads and exhaust server resources.

**Files to Change:**
- `api/contact.js` (add validation at handler start)

**Implementation Steps:**
1. Add MAX_PAYLOAD constant (10 KB recommended)
2. Check Content-Length header
3. Return 413 if exceeded
4. Test with curl sending large payloads

**Acceptance Criteria:**
- ✅ Normal form submissions work (<1KB)
- ✅ 10KB payload rejected with 413 status
- ✅ Error message is helpful
- ✅ Load test with 1000 normal requests succeeds

**Code Change:**
```javascript
const MAX_PAYLOAD_SIZE = 10 * 1024; // 10KB

export default async (req, res) => {
  setCORSHeaders(res, req.headers.origin);
  
  // Check payload size
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({ 
      error: 'Request payload too large. Maximum 10KB allowed.' 
    });
  }
  
  // ... rest of handler
};
```

---

### [x] 3. Enforce CSP - Remove unsafe-inline Scripts ✅ COMPLETED
**Priority:** 🔴 CRITICAL (for maximum security)  
**Time Estimate:** 2-3 hours  
**Risk Level:** High (XSS vulnerability)  
**Alternative:** Can deploy as-is with plan to fix in next sprint

**Task Description:**
Current CSP policy includes `'unsafe-inline'` which defeats XSS protection. All inline event handlers should be replaced with event delegation.

**Files to Change:**
- `vercel.json` (line 39) - Remove `'unsafe-inline'`
- `src/App.jsx` - Multiple inline onClick handlers
- `src/components/AdvertisePage.jsx` - Inline handlers

**Implementation Steps:**
1. Option A (Quick): Add Vite nonce generation to CSP
2. Option B (Proper): Refactor inline handlers to use event delegation
3. Update vercel.json CSP policy
4. Test all form submissions and buttons work

**Acceptance Criteria:**
- ✅ CSP no longer allows `'unsafe-inline'`
- ✅ All buttons and forms still work
- ✅ No console CSP warnings
- ✅ Security headers validation passes

**For Next Sprint If Not Done Now:**
```
// Temporary solution until refactored
script-src 'self' 'nonce-{RANDOM}' https://cdn.tailwindcss.com ...
```

---

## 🟡 HIGH PRIORITY - FIX IN NEXT SPRINT

### [ ] 4. Remove Development Logs from Production
**Priority:** 🟡 HIGH  
**Time Estimate:** 30 minutes  
**Risk Level:** Low

**Task Description:**
Console.log statements visible in production could leak debug information.

**Files to Change:**
- `src/App.jsx` (line 1099)
- `src/utils/sentry.js` (lines 77, 88)

**Implementation:**
```javascript
// Wrap in environment check
if (process.env.NODE_ENV === 'development') {
  console.log('✓ Pricing data loaded from JSON');
}
```

**Acceptance Criteria:**
- ✅ No console.log visible in production build
- ✅ Logs still appear in development
- ✅ Sentry initialization still works

---

### [ ] 5. Add Request Size Validation Middleware
**Priority:** 🟡 HIGH  
**Time Estimate:** 1 hour

**Task Description:**
Implement size validation for both `/api/contact` and `/api/usage` endpoints.

**Files to Change:**
- `api/contact.js`
- `api/usage.js`

**Acceptance Criteria:**
- ✅ Both endpoints reject >10KB
- ✅ Error messages clear
- ✅ Rate limiting still works

---

### [ ] 6. Add Email Validation on Backend
**Priority:** 🟡 HIGH (defense-in-depth)  
**Time Estimate:** 30 minutes

**Current Status:** Email validated in sanitizer, but could be more strict.

**Implementation:**
Use email-validator package or stricter regex.

---

## 🟢 MEDIUM PRIORITY - FIX NEXT SPRINT

### [ ] 7. Increase Test Coverage to 70%
**Priority:** 🟢 MEDIUM  
**Time Estimate:** 4-6 hours  
**Current Coverage:** 0% of utility files

**Tasks:**
- [ ] Add tests for `utils/sanitizer.js` (edge cases, XSS attempts)
- [ ] Add tests for `utils/sentry.js` (initialization, error handling)
- [ ] Add tests for `hooks/usePrices.js` (loading, error states)
- [ ] Add tests for `utils/analytics.js` (event tracking)

**Target:** 70% coverage threshold

---

### [ ] 8. Add Image Lazy Loading
**Priority:** 🟢 MEDIUM  
**Time Estimate:** 30 minutes

**Files to Change:**
- `src/App.jsx` (logo image)
- `src/components/AdvertisePage.jsx` (logo)

**Implementation:**
```jsx
<img 
  src="/images/logo-full.png"
  alt="AIBurn Logo"
  loading="lazy"
  width={64}
  height={64}
/>
```

---

### [ ] 9. Add Code Splitting for Routes
**Priority:** 🟢 MEDIUM  
**Time Estimate:** 1-2 hours

**Benefits:** Reduce initial bundle by ~5-10%

**Implementation:**
```javascript
const AdvertisePage = lazy(() => import('./components/AdvertisePage'));

<Suspense fallback={<LoadingSpinner />}>
  <AdvertisePage />
</Suspense>
```

---

### [ ] 10. Document API Endpoints
**Priority:** 🟢 MEDIUM  
**Time Estimate:** 1 hour

**Create:** `docs/API.md` with:
- POST /api/contact
- POST /api/usage
- Response formats
- Error codes
- Rate limits

---

## ✅ ALREADY IMPLEMENTED & VERIFIED

- ✅ Input sanitization (XSS prevention)
- ✅ Error boundaries
- ✅ Rate limiting (10 req/min per IP)
- ✅ API key cleanup on unmount
- ✅ HTTPS enforcement
- ✅ Security headers (HSTS, X-Frame-Options, etc)
- ✅ ARIA labels and accessibility
- ✅ Responsive design
- ✅ Privacy policy
- ✅ Terms of service
- ✅ Comprehensive documentation
- ✅ Environment variable management
- ✅ Error handling in async functions
- ✅ No hardcoded secrets
- ✅ Email validation

---

## 📋 DEPLOYMENT CHECKLIST

Before going to production, ensure:

**Code Quality:**
- [ ] All 3 CRITICAL fixes implemented
- [ ] npm run build succeeds
- [ ] npm run test passes (178+ tests)
- [ ] npm run lint has no errors

**Security:**
- [ ] CORS restricted to known origins
- [ ] Request size limit enforced
- [ ] CSP properly configured
- [ ] API keys never logged
- [ ] Environment variables set in Vercel

**Monitoring:**
- [ ] Sentry DSN configured
- [ ] Error tracking active
- [ ] Rate limiting verified
- [ ] HTTPS enforced

**Documentation:**
- [ ] README.md up to date
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment steps clear

**Testing:**
- [ ] Manual smoke test of contact form
- [ ] Manual smoke test of calculator
- [ ] Manual test on mobile
- [ ] Verify email notifications sent
- [ ] Test error handling

---

## 🚀 SPRINT PLANNING

**Sprint 1 (This Week):**
- Implement 3 CRITICAL fixes
- Manual testing
- Deploy to production
- Monitor for issues

**Sprint 2 (Next Week):**
- Remove dev logs
- Add request validation middleware
- Increase test coverage to 50%

**Sprint 3:**
- Reach 70% test coverage
- Code splitting for routes
- CSP unsafe-inline removal (if not done)

---

## 📊 SUCCESS METRICS

Track these metrics after each change:

| Metric | Current | Target |
|--------|---------|--------|
| Test Pass Rate | 88% | 95%+ |
| Test Coverage | 0% | 70%+ |
| Bundle Size (gzipped) | 95 KB | <100 KB |
| Security Issues | 2 🟡 | 0 ✅ |
| CLS (Layout Shift) | Good | Good |
| FCP (Load Time) | 1.2s | <1.5s |

---

## 👥 RESPONSIBILITY

| Task | Owner | Due Date |
|------|-------|----------|
| CORS Fix | Developer | Before Deployment |
| Request Limit | Developer | Before Deployment |
| CSP Removal | Developer | Next Sprint |
| Test Coverage | QA Lead | Next Sprint |
| Documentation | Tech Writer | Next Sprint |

---

## 📞 QUESTIONS?

Refer to detailed report: `QC_AUDIT_REPORT.md`  
Summary: `QC_SUMMARY.txt`

---

**Status:** ✅ Ready for Production (with fixes)  
**Last Updated:** December 1, 2025  
**Next Review:** After deploying critical fixes
