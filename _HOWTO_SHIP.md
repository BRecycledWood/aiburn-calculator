# AIBurn - How to Ship: Launch Guide

**Version:** 1.0  
**Last Updated:** November 20, 2025  
**Status:** READY FOR DEPLOYMENT  
**Estimated Time to Launch:** 7-8 hours of focused work

---

## 🚀 Pre-Launch Checklist

### Prerequisites (Before Starting)
- [ ] Access to `/Users/bkerwood/projects/aiburn-cost-calculator/`
- [ ] GitHub account with push access
- [ ] Vercel account connected to GitHub
- [ ] Real Twitter handle, email, and domain values ready
- [ ] Code review approval from team

---

## Phase 1: Pre-Deployment Preparation (1.5 hours)

### Step 1.1: Finish Dynamic Price Loading (1 hour)

**Status:** Started Nov 20, 2025

**Remaining Tasks:**
1. [ ] Create `public/data/prices.json` with pricing data
2. [ ] Add `useEffect` hook to load prices on app mount
3. [ ] Display "last updated" timestamp
4. [ ] Show age warning if >7 days old
5. [ ] Add manual refresh button

**Implementation Reference:**
- See: `COMPLETE_TODO_LIST.md` sections 3.1-3.4 for detailed steps
- Time: ~1.5 hours with testing

### Step 1.2: Update Configuration Values (0.5 hours)

**CRITICAL:** Update before any public deployment

**Files to Update:** `aiburn-website/src/App.jsx`

```javascript
// Line ~110 (AdCard email link)
// CHANGE FROM:
const email = encodeURIComponent('Advertising Inquiry')
// CHANGE TO:
const email = encodeURIComponent('Advertising Inquiry')
// (Also update the href email address)

// Line ~325 (Twitter share)
// CHANGE FROM:
text: `${costText} with ${selectedModel}. I found cheaper alternatives! `
// (May already be good)

// Lines ~484, 773 (Left/right sidebar email)
// UPDATE email address to real email

// Line ~790 (Company link)
// CHANGE FROM:
howstud.io
// CHANGE TO:
[your-real-domain]
```

**Real Values Needed:**
- [ ] Twitter Handle: `@[your-handle]`
- [ ] Email Address: `[your-email]@[domain]`
- [ ] Domain: `[subdomain].howstud.io` or custom
- [ ] Company Website: `[company-domain]`

### Step 1.3: Verify Build (0.25 hours)

```bash
cd /Users/bkerwood/projects/aiburn-cost-calculator/aiburn-website
npm install              # If dependencies changed
npm run build           # Should take ~800ms
```

**Expected Output:**
```
✓ Built in 778ms

dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js (66.76 KB gzipped)
  │   └── index-[hash].css
  └── vite.svg
```

**Success Criteria:**
- [x] Build completes with 0 errors
- [x] 0 build warnings
- [x] dist/ folder created
- [x] Bundle size ~66-67 KB gzipped

---

## Phase 2: Testing (2.5 hours)

### Step 2.1: Quick Manual Testing (1 hour)

**Local Development Server:**
```bash
cd aiburn-website
npm run dev
# Opens http://localhost:5173
```

**Test Checklist:**

#### Quick Calculator Mode
- [ ] Load page, no console errors
- [ ] Select a model (GPT-4o)
- [ ] Adjust token slider (1, 10K, 1M, 500M)
- [ ] Results update instantly
- [ ] Cost calculation looks reasonable
- [ ] Top alternatives display
- [ ] Savings calculation correct

#### Exact Usage Mode
- [ ] Switch to "Exact Usage" tab
- [ ] See API key input field
- [ ] Enter invalid key → see error message
- [ ] API key input is password-masked
- [ ] Error doesn't expose sensitive data

#### Share & Export
- [ ] Click "Share on X" button
- [ ] Twitter/X opens with pre-filled text
- [ ] Tweet includes model name
- [ ] Tweet includes cost estimate
- [ ] Close and return to site

- [ ] Click "Download Report"
- [ ] PNG file downloads
- [ ] Image is readable (shows cost, savings)
- [ ] File size reasonable (~50-150 KB)

#### Ad System
- [ ] Header banner visible
- [ ] Left sidebar ads display
- [ ] Right sidebar ads display
- [ ] Footer banner visible
- [ ] All ads styled consistently (light gray)
- [ ] Ad "Inquire" buttons don't error

#### Responsive Design
- [ ] Browser width 1280px: 20-60-20 layout
- [ ] Browser width 768px: 2-column layout
- [ ] Browser width 375px: 1-column layout
- [ ] All elements readable at each size
- [ ] No horizontal scrolling on mobile

#### Accessibility
- [ ] Tab through form: logical order
- [ ] All buttons keyboard accessible
- [ ] Text contrast acceptable
- [ ] No console a11y warnings

---

### Step 2.2: Cross-Browser Testing (1 hour)

**Test in Multiple Browsers:**

#### Chrome/Chromium
- [ ] Load site (no errors)
- [ ] Calculate costs
- [ ] Share to X
- [ ] Download report

#### Firefox
- [ ] Load site (no errors)
- [ ] Quick calculations work
- [ ] Form inputs responsive
- [ ] Share functionality works

#### Safari (macOS)
- [ ] Load site
- [ ] Basic functionality
- [ ] Share button (may need permission)
- [ ] Download works

#### Edge (if available)
- [ ] Load site
- [ ] Basic functionality
- [ ] No IE-specific issues

**Success Criteria:**
- [x] No JavaScript errors in console
- [x] No CSS rendering issues
- [x] Forms work across browsers
- [x] Calculations consistent

---

### Step 2.3: Mobile Device Testing (0.5 hours)

**Desktop Responsive Testing** (in browser DevTools):
- [ ] iPhone 13 (390×844)
- [ ] iPhone SE (375×667)
- [ ] iPad (768×1024)
- [ ] iPad Pro (1024×1366)
- [ ] Galaxy S21 (360×800)

**Real Device Testing** (if possible):
- [ ] iPhone/iPad (Safari + Chrome)
- [ ] Android device (Chrome)
- [ ] Portrait and landscape
- [ ] Touch interactions work
- [ ] Share button works
- [ ] Download works

**Recommended But Optional:**
- Real iPhone testing
- Real Android testing
- Can be done post-launch if needed

---

## Phase 3: Code Review & Approval (1 hour)

### Step 3.1: Get Code Review

**For Team Lead/Code Reviewer:**

1. [ ] Review `src/App.jsx` for:
   - No console.log statements
   - No TODO comments
   - Configuration values updated
   - Security fixes in place

2. [ ] Review `api/usage.js` for:
   - Input validation present
   - Error messages sanitized
   - CORS configured
   - No credentials in logs

3. [ ] Review `vercel.json` for:
   - Build command correct
   - Output directory: dist/
   - Security headers present
   - API function timeout set

4. [ ] Verify:
   - [ ] Code builds without errors
   - [ ] No security vulnerabilities
   - [ ] Bundle size acceptable
   - [ ] All TODOs addressed

5. [ ] Sign Off:
   - [ ] Code review: APPROVED
   - [ ] Security check: APPROVED
   - [ ] Ready for staging: YES

---

## Phase 4: Staging Deployment (1 hour)

### Step 4.1: Push to GitHub

```bash
cd /Users/bkerwood/projects/aiburn-cost-calculator

# Check status
git status

# Stage changes
git add -A

# Commit with conventional message
git commit -m "feat: complete dynamic pricing and prepare for launch"

# Push to main (triggers Vercel deployment)
git push origin main
```

**Expected:**
- GitHub shows commit pushed
- Vercel starts build automatically
- Build should complete in ~2 minutes

### Step 4.2: Verify Staging Build

**In Vercel Dashboard:**
1. [ ] Login to Vercel
2. [ ] Select AIBurn project
3. [ ] Wait for "READY" status (green checkmark)
4. [ ] Check build logs for errors (should be none)
5. [ ] Click preview URL

**In Preview:**
```
URL: https://aiburn-cost-calculator-[random].vercel.app
```

1. [ ] Site loads without errors
2. [ ] Run quick smoke tests:
   - [ ] Quick calculator works
   - [ ] Slider adjusts costs
   - [ ] Share button works
   - [ ] Download works
3. [ ] Check performance (should be fast)
4. [ ] Check for errors in console (should be none)

---

## Phase 5: Production Deployment (1 hour)

### Step 5.1: Final Approval

**Before Proceeding:**
- [ ] Staging tests passed
- [ ] Code review approved
- [ ] Configuration values updated
- [ ] Domain is ready
- [ ] Team agrees to launch

### Step 5.2: Configure Custom Domain (if needed)

**In Vercel Dashboard:**
1. [ ] Go to Project Settings → Domains
2. [ ] Add domain: `aiburn.howstud.io` or custom
3. [ ] Add DNS records (Vercel will provide instructions)
4. [ ] Wait for DNS propagation (5-48 minutes)
5. [ ] Verify domain resolves

**If using howstud.io subdomain:**
- Contact domain owner for DNS access
- Add Vercel nameservers or CNAME record
- Test with: `ping aiburn.howstud.io`

### Step 5.3: Production Deployment

**Option A: Automatic (Recommended)**
```bash
# Already deployed when you pushed to main
# Just verify it's on production URL
```

**Option B: Manual Deployment** (if needed)
```bash
cd aiburn-website
vercel deploy --prod
```

**Verification:**
1. [ ] Vercel shows "READY" status
2. [ ] Domain resolves (https://aiburn.howstud.io)
3. [ ] Site loads without errors
4. [ ] All features working

---

## Phase 6: Post-Deployment Testing (1 hour)

### Step 6.1: Smoke Test Production

```
URL: https://aiburn.howstud.io (or custom domain)
```

**Test These Flows:**

#### Flow 1: Quick Calculator
1. Load site → no console errors
2. Select model (GPT-4o)
3. Adjust slider to 50M tokens
4. Verify cost shows
5. Verify savings calculation

#### Flow 2: Share Results
1. Calculate costs
2. Click "Share on X"
3. Verify Twitter pre-fill works
4. Verify cost and savings in tweet

#### Flow 3: Download Report
1. Calculate costs
2. Click "Download Report"
3. Verify PNG downloads
4. Open PNG → verify content

#### Flow 4: Error Handling
1. Try invalid token (negative, very large)
2. Verify error message
3. Fix input, verify error clears
4. Calculation works again

#### Flow 5: Mobile
1. Open on phone/tablet
2. Verify single-column layout
3. All buttons clickable
4. Share/download work

### Step 6.2: Check Security Headers

**Using Online Tool:**
1. Visit https://securityheaders.com/
2. Enter: `https://aiburn.howstud.io`
3. Check for security headers
4. Should see "A+" grade (or similar)

**Headers to Verify:**
- [x] X-Content-Type-Options
- [x] X-Frame-Options
- [x] X-XSS-Protection
- [x] Content-Security-Policy

### Step 6.3: Check Performance

**Using Lighthouse:**
1. Open site in Chrome
2. DevTools → Lighthouse
3. Run audit
4. Check scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

---

## Phase 7: Monitoring (2 hours over 48 hours)

### Step 7.1: Monitor Error Logs

**In Vercel Dashboard:**
1. Check Monitoring section
2. Look for errors (should be 0)
3. Check API function logs
4. No credential exposure

**What to Look For:**
- [ ] JavaScript errors
- [ ] API failures
- [ ] Network errors
- [ ] Unusual activity

### Step 7.2: Monitor for 48 Hours

**During First 48 Hours:**
- [ ] Check logs every few hours
- [ ] Watch for error spikes
- [ ] Monitor API response times
- [ ] Check for user reports

**If Issues Found:**
1. Check error logs for details
2. Reproduce locally if possible
3. Review recent changes
4. Deploy fix if needed
5. Document in _LEDGER.md

### Step 7.3: Verify Core Functionality

**After 24 Hours:**
- [ ] Test calculator still works
- [ ] Share functionality works
- [ ] Download functionality works
- [ ] No console errors
- [ ] Performance acceptable

---

## 🎯 Launch Readiness Checklist

### Before Starting Phase 1
- [ ] Configuration values ready (Twitter, email, domain)
- [ ] Team agrees to launch date
- [ ] Code review process defined
- [ ] Monitoring setup (optional for v1)

### After Phase 1 (Pre-Deployment Prep)
- [ ] Dynamic pricing implemented
- [ ] Configuration values updated
- [ ] Build succeeds

### After Phase 2 (Testing)
- [ ] All manual tests pass
- [ ] Cross-browser testing complete
- [ ] Mobile responsive verified
- [ ] No console errors

### After Phase 3 (Code Review)
- [ ] Code review approved
- [ ] Security review passed
- [ ] No TODOs in code

### After Phase 4 (Staging)
- [ ] Staging build succeeds
- [ ] Staging deployment works
- [ ] Smoke tests pass on staging

### After Phase 5 (Production)
- [ ] Production deployment complete
- [ ] Custom domain resolves
- [ ] Site loads without errors

### After Phase 6 (Post-Deploy Test)
- [ ] Production smoke tests pass
- [ ] Security headers verified
- [ ] Performance acceptable
- [ ] 48-hour monitoring complete

---

## 📊 Time Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| **1** | Dynamic pricing + config | 1.5 hrs | TODO |
| **2** | Testing (manual, cross-browser, mobile) | 2.5 hrs | TODO |
| **3** | Code review & approval | 1 hr | TODO |
| **4** | Staging deployment | 1 hr | TODO |
| **5** | Production deployment | 1 hr | TODO |
| **6** | Post-deployment testing | 1 hr | TODO |
| **7** | Monitoring (spread over 48 hrs) | 2 hrs | TODO |
| **TOTAL** | **Full launch process** | **~10 hours** | TODO |

**Can be compressed to 7-8 hours with parallel activities**

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Stuck
```bash
# Check Vercel logs
vercel logs                 # See recent logs
vercel deploy --prod       # Force redeploy
```

### Site Shows Old Version
```bash
# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
# Or use incognito window
```

### Configuration Not Applied
```bash
# Verify changes saved
git diff src/App.jsx       # See changes
git status                 # See staged changes
git commit -m "fix: update configuration"
git push origin main       # Re-deploy
```

### API Key Issues
- Don't store API keys in code ✅ (already fixed)
- API key input is password field ✅
- Errors don't expose keys ✅ (already fixed)
- If user reports key leak, respond immediately

---

## 📞 Support During Launch

### If Something Goes Wrong
1. **Immediate:** Check error logs in Vercel
2. **Diagnosis:** Reproduce locally if possible
3. **Fix:** Deploy hotfix if critical
4. **Communication:** Update team on status

### Rollback Plan
```bash
# If critical issue after deploy
git revert HEAD              # Undo last commit
git push origin main         # Redeploy previous version
```

**Time to Rollback:** ~5 minutes

---

## ✅ Launch Success Criteria

### Deployment is Successful If
- ✅ Build passes without errors
- ✅ Site loads in browser
- ✅ Calculator works (Quick mode)
- ✅ Share to X works
- ✅ Download PNG works
- ✅ No console errors
- ✅ Security headers present
- ✅ <1 error per hour in logs

### Deployment is NOT Successful If
- ❌ Build fails
- ❌ Site doesn't load
- ❌ 500 errors in logs
- ❌ Calculator doesn't calculate
- ❌ Unhandled JavaScript errors
- ❌ API key exposed in errors

---

## 🎉 After Launch

### First Week
- Monitor error logs daily
- Watch for user feedback
- Check performance metrics
- Plan Phase 2 features

### First Month
- Announce on social media
- Reach out to sponsors
- Collect user feedback
- Plan future iterations

### Phase 2 (December 2025)
- Dynamic price updates
- Anthropic API integration
- Analytics implementation
- User accounts (optional)

---

## 📚 Reference Documents

| Document | Purpose | Link |
|----------|---------|------|
| _PRD.md | Product specification | View full details |
| _STATUS.md | Current project status | 69% complete |
| _TASK_LIST.md | Complete task list | 48 tasks, 33 done |
| _INVENTORY.md | Tech stack & structure | Full architecture |
| CODE_REVIEW.md | Security audit | 18 issues documented |
| SECURITY_FIXES.md | Fix implementation | All fixes explained |
| README.md | Project overview | Quick start guide |

---

## ✍️ Launch Sign-Off

**When Complete, Sign Off With:**

```markdown
## Launch Sign-Off

**Date:** [Date Deployed]
**Deployed By:** [Your Name]
**Duration:** [Hours Spent]
**Status:** ✅ SUCCESS

**Verified:**
- [x] Build successful
- [x] All tests passed
- [x] Site loads and functions
- [x] Security headers present
- [x] 48-hour monitoring complete
- [x] No critical errors

**Notes:** [Any issues or observations]

Next Steps: [Planning for Phase 2]
```

---

**Document Status:** ✅ Complete & Ready to Use  
**Created:** November 20, 2025  
**Maintained By:** Amp AI Launch Guide System  
**Version:** 1.0 (Production Ready)

Good luck with the launch! 🚀
