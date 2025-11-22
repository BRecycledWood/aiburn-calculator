# AIBurn Deployment Checklist

## Pre-Deployment Tasks

### Configuration Updates (Required Before Deploy)
- [ ] Update Twitter handle in `shareOnTwitter()` function
  - Current: `@howstudio`
  - Location: `src/App.jsx` line 325
  
- [ ] Update email address throughout codebase
  - Current: `ads@howstud.io`
  - Files: `src/App.jsx` (lines 110, 484, 773)
  
- [ ] Update domain references
  - Current: `aiburn.howstud.io`
  - Files: `src/App.jsx` (lines 325, 399)
  - If custom domain: update accordingly

- [ ] Update footer link
  - Current: `https://howstud.io`
  - Location: `src/App.jsx` line 790

### Testing (Required)
- [ ] Test Quick Calculator on desktop
  - [ ] Model selection works
  - [ ] Token slider functions
  - [ ] Calculations are accurate
  - [ ] Results display correctly
  
- [ ] Test Exact Usage mode
  - [ ] OpenAI API integration works
  - [ ] Error handling displays properly
  - [ ] API key is not logged/stored
  
- [ ] Test Share functionality
  - [ ] Twitter share opens correct URL
  - [ ] Tweet pre-fill is readable
  
- [ ] Test Download Report
  - [ ] PNG generates without errors
  - [ ] Canvas rendering is high quality
  - [ ] File naming is correct
  
- [ ] Test responsive design
  - [ ] Mobile layout collapses to single column
  - [ ] Tablet layout displays correctly
  - [ ] Desktop 20-60-20 layout intact
  
- [ ] Test on actual mobile devices (not just browser emulation)
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] iOS Chrome
  
- [ ] Cross-browser testing
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### Optimization
- [ ] Check bundle size (current: 66.76 KB gzipped) ✅
- [ ] Verify CSS is optimized ✅
- [ ] Check for unused dependencies
- [ ] Minification enabled ✅

### Content Review
- [ ] Verify all model pricing is current
  - Current as of: Nov 2025
- [ ] Check all UI copy for typos
- [ ] Verify category labels are accurate
- [ ] Review placeholder ad copy

## Deployment Steps

### Vercel Deployment
1. [ ] Ensure `vercel.json` is configured correctly
2. [ ] Connect GitHub repo to Vercel (if using Git)
3. [ ] Set environment variables (if any)
4. [ ] Run `npm run build` locally to verify
5. [ ] Deploy to Vercel
6. [ ] Verify production build loads correctly
7. [ ] Test all functionality on production URL

### Post-Deployment
1. [ ] Test live URL in browser
2. [ ] Verify API endpoints work
3. [ ] Check Twitter share link works
4. [ ] Download report from production
5. [ ] Monitor performance metrics
6. [ ] Set up error tracking (Sentry or similar)
7. [ ] Consider adding analytics (Plausible, Fathom, etc.)

## Rollback Plan
- Keep previous build in archive
- Note deployment timestamp
- Have rollback command ready: `vercel rollback` (if using Vercel)

## Post-Launch
- [ ] Monitor user feedback
- [ ] Track calculator usage
- [ ] Monitor error rates
- [ ] Plan next features (analytics, Anthropic integration)
- [ ] Schedule mobile testing feedback
- [ ] Plan featured ad rotation visibility improvements

## Sign-Off Checklist
- [ ] All configuration updated
- [ ] All tests passed
- [ ] Build successful
- [ ] Production deploy successful
- [ ] Post-deploy tests passed
- [ ] Ready for traffic

---

**Notes**:
- Current build size is excellent (66.76 KB gzipped)
- No environment variables currently needed
- API keys are user-provided, not stored server-side
- Consider enabling advanced analytics before promoting heavily
