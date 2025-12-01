# AIBurn Calculator - Production Handoff

**Last Updated:** December 2025  
**Status:** Production Ready (Nearly Deployed)  
**Live URL:** https://aiburn.howstud.io  
**Repository:** https://github.com/BRecycledWood/aiburn-calculator

---

## Current State

### ✅ Completed
- React 18.3 + Vite 7 SPA
- All pages: Home, /advertise, /privacy, /terms
- Cost calculator with 9 AI models (GPT-4, Claude, Llama, DeepSeek, etc.)
- Advertiser contact form (using Nodemailer + Zoho Mail SMTP)
- Security hardening: DOMPurify, Sentry, CSP headers, HSTS
- E2E testing: Playwright with accessibility checks
- Load testing: K6 scripts ready
- Smoke tests: Node.js script validates endpoints post-deploy
- Analytics: Google Analytics (dynamically loaded)
- Email service: Nodemailer via `/api/contact` endpoint
- CI/CD: GitHub Actions workflow

### 🔴 Pending
1. **Tailwind CSS styling** - Currently restored via CDN, but styling may be broken on fresh deploy
2. **Contact form testing** - Verify Zoho SMTP credentials work in production
3. **Smoke tests post-deploy** - Run `npm run smoke-test https://aiburn.howstud.io`
4. **Load tests post-deploy** - Run `npm run k6:prod` (requires k6 installed locally)

---

## Deployment Checklist

### Before Final Deploy
- [ ] Verify Vercel project settings match Project Settings (not Production Overrides)
- [ ] Confirm Framework Preset = **Vite**
- [ ] Confirm Install Command = `npm install` (no --legacy-peer-deps)
- [ ] Click **Save** on Project Settings
- [ ] Click **Redeploy**

### After Deploy
1. **Immediate (0-5 min)**
   ```bash
   npm run smoke-test https://aiburn.howstud.io
   ```
   Should see: `✅ All smoke checks passed`

2. **Within 24 hours**
   - Check Sentry dashboard for errors
   - Test advertiser contact form (submit at `/advertise`)
   - Verify email arrives at `aiburnads@howstud.io`
   - Check Google Analytics tracking in DevTools

3. **Load test (optional)**
   ```bash
   npm run k6:prod
   # Requires: brew install k6
   ```

---

## Environment Variables (Vercel Secrets)

Required in **Vercel → Settings → Environment Variables**:

```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=aiburnads@howstud.io
SMTP_PASS=[your-zoho-app-password]
ADVERTISE_EMAIL=aiburnads@howstud.io
VITE_SENTRY_DSN=[your-sentry-dsn]
```

**Note:** Generate Zoho app password at: Zoho Mail Settings → Security → App Passwords

---

## Key Files & Directories

```
aiburn-website/
├── src/
│   ├── components/
│   │   ├── AdvertisePage.jsx        (Contact form)
│   │   ├── CalculatorPage.jsx       (Main app)
│   │   └── ErrorBoundary.jsx
│   ├── utils/
│   │   ├── sanitizer.js             (DOMPurify)
│   │   ├── sentry.js                (Error tracking)
│   │   └── analytics.js             (GA initialization)
│   ├── main.jsx
│   └── index.css                    (Custom styles)
├── api/
│   ├── contact.js                   (Advertiser form handler)
│   ├── csp-report.js                (CSP violation logging)
│   └── usage.js                     (AI pricing API)
├── e2e/
│   ├── calculator.spec.js           (Playwright tests)
│   └── accessibility.spec.js        (A11y tests)
├── scripts/
│   ├── smoke-test.js                (Post-deploy validation)
│   └── load-test.js                 (Basic load testing)
├── vercel.json                      (Deployment config, CSP headers)
├── package.json                     (Dependencies)
├── tailwind.config.js               (Tailwind v3)
├── postcss.config.js                (PostCSS)
└── index.html                       (Entry point, includes Tailwind CDN)
```

---

## Common Tasks

### Run Locally
```bash
npm install
npm run dev        # Starts at http://localhost:5173
```

### Build for Production
```bash
npm run build      # Creates dist/
npm run preview    # Preview dist/ locally
```

### Run Tests
```bash
npm test           # Unit tests (Jest)
npm run e2e        # E2E tests (Playwright)
npm run a11y       # Accessibility tests
npm run smoke-test http://localhost:5173
npm run k6:local   # Load test locally
```

### Deploy
```bash
git push origin main  # Triggers GitHub Actions → Vercel
```

---

## Known Issues & Workarounds

### 1. Tailwind CSS Styling
**Issue:** Switching between Tailwind CDN and PostCSS broke styling  
**Current:** Using Tailwind CDN (https://cdn.tailwindcss.com)  
**CSP:** Whitelisted in vercel.json  
**Action if broken:** Verify Tailwind CDN loads in DevTools Network tab

### 2. Sentry startTransaction Error
**Issue:** `@sentry/react` doesn't export `startTransaction`  
**Status:** Non-blocking (build succeeds)  
**Action:** Remove unused imports from `src/utils/sentry.js` lines 149-150 if needed

### 3. Contact Form Zoho SMTP
**Issue:** Credentials required in Vercel environment  
**Fallback:** Email link at bottom of form: `aiburnads@howstud.io`  
**Test:** Submit from `/advertise` page after deploy

### 4. Google Analytics
**Status:** Loaded dynamically via `src/utils/analytics.js`  
**Check:** DevTools → Network → should see `gtag.js` request

---

## Rollback Procedure

**Level 1 (Easiest):**
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "Redeploy" (takes 30-60 seconds)

**Level 2 (Git-based):**
```bash
git log --oneline    # Find last good commit
git revert <hash>    # Or: git reset --hard <hash>
git push origin main # Triggers re-deploy
```

---

## Monitoring & Alerts

### Sentry (Error Tracking)
- Dashboard: https://sentry.io
- DSN: Check `VITE_SENTRY_DSN` in Vercel
- Alerts: Email + Slack (if configured)

### Vercel Logs
- Dashboard: https://vercel.com
- Runtime Logs: Deployments → [Latest] → Runtime Logs
- Watch for API errors: `/api/contact` 500 errors

### Google Analytics
- Dashboard: https://analytics.google.com
- Property ID: `G-FPK0Y02B8F`
- Events: Track form submissions, page views

---

## Contact Form Flow

1. User fills form at `/advertise`
2. Submits → POST `/api/contact`
3. Nodemailer sends via Zoho SMTP
4. Email to admin: `aiburnads@howstud.io`
5. Confirmation email to user
6. UI shows "Thank you" message for 3 seconds

**Debug:** Check Vercel Runtime Logs if 500 error on submit

---

## Next Steps (Post-Deploy)

1. **Smoke test immediately**
   ```bash
   npm run smoke-test https://aiburn.howstud.io
   ```

2. **Monitor for 24 hours**
   - Check Sentry for errors
   - Monitor Vercel logs
   - Test contact form manually

3. **Run load test** (optional)
   ```bash
   npm run k6:prod
   ```

4. **Setup SEO** (if not done)
   - Add robots.txt and sitemap.xml
   - Submit to Google Search Console
   - Add dynamic meta tags for routes

5. **Configure alerts** (Slack/Discord optional)
   - Sentry: https://sentry.io → Integrations
   - Vercel: https://vercel.com → Integrations

---

## Support & Documentation

- **README:** `/Users/bkerwood/projects/aiburn-cost-calculator/aiburn-website/README.md`
- **Build Logs:** Check `FINAL_PRODUCTION_SUMMARY.md` and related docs
- **Test Results:** See `TEST_SUITE.md`, `TESTING_SECURITY_DEPLOYMENT_COMPLETE.md`
- **GitHub:** https://github.com/BRecycledWood/aiburn-calculator

---

## Last Deployment Log

```
Commit: dc2ec4b
Message: fix: restore Tailwind CDN approach, add to CSP whitelist
Date: Dec 1, 2025
Status: Ready for Vercel redeploy
```

---

**Handoff Complete** ✅  
All systems ready for production deployment.
