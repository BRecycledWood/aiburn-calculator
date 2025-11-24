# Manual Testing Instructions - AIBurn Cost Calculator

**Status:** Ready for Testing  
**Date:** November 24, 2025  
**Build:** ✅ Verified (82.69 KB gzipped)

---

## 🎯 Quick Start

The development server is running at:
```
http://localhost:5173
```

Open this URL in your browser to begin testing.

---

## 📋 Testing Checklist (90 minutes total)

### SECTION 1: Quick Calculator (15 minutes)

**Goal:** Verify basic calculations work accurately

1. **Model Selection**
   - Open app in browser
   - Click "Quick Mode" tab
   - Select GPT-4o from dropdown
   - Verify pricing displays: Input $0.000003/token, Output $0.000006/token
   - Switch to 3 other models and verify prices update

2. **Token Slider**
   - Move slider to minimum (100 tokens)
   - Move slider to maximum (10M tokens)
   - Manually enter 500,000 in input field
   - Verify slider follows the input

3. **Accuracy Test (Calculate 3 scenarios)**
   ```
   Scenario A: GPT-4o, 100,000 tokens
   Expected: $0.30 (100K × $0.000003)
   Actual: _______
   ✓ Pass ☐ Fail
   
   Scenario B: o1, 1,000,000 tokens
   Expected: $15.00 (1M × $15)
   Actual: _______
   ✓ Pass ☐ Fail
   
   Scenario C: Claude 3.5, 500,000 tokens
   Expected: $1.50 (500K × $3/1M)
   Actual: _______
   ✓ Pass ☐ Fail
   ```

**Status:** ☐ Pass ☐ Fail

---

### SECTION 2: Exact Usage Mode (20 minutes)

**Goal:** Test OpenAI API integration

1. **Setup (requires OpenAI API key)**
   - Click "Exact Usage" tab
   - Paste valid OpenAI API key in input field
   - Verify API key input works (should not show text)

2. **Valid API Test**
   - Keep valid API key in field
   - Wait for calculation to complete
   - Verify results display with actual token usage
   - Check that cost matches calculation

3. **Invalid API Test**
   - Replace with invalid API key
   - Try to calculate
   - Verify error message displays (friendly, no credentials exposed)
   - Verify app doesn't crash

4. **Security Check**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Search for your API key - should NOT appear
   - Search for sensitive data - should NOT appear

**Status:** ☐ Pass ☐ Fail

---

### SECTION 3: Share & Download (10 minutes)

**Goal:** Verify sharing and reporting features

1. **Share on X (Twitter)**
   - Calculate any amount
   - Click "Share Results on X"
   - Verify Twitter/X window opens
   - Check tweet preview includes:
     - Calculation results
     - Model name
     - Cost
     - AIBurn link
   - ✓ Tweet looks professional ☐ Needs fix

2. **Download Report**
   - Calculate any amount
   - Click "Download Report"
   - Verify PNG file downloads
   - Open PNG and verify:
     - Title: "AIBurn Cost Report"
     - Model name correct
     - Cost figures correct
     - Image is readable
   - ✓ Report looks good ☐ Needs fix

**Status:** ☐ Pass ☐ Fail

---

### SECTION 4: Responsive Design (15 minutes)

**Goal:** Verify works on all device sizes

**Desktop Test (1440px+)**
- Verify 20-60-20 layout visible
- Left sidebar with ads (20%)
- Calculator in center (60%)
- Right sidebar with ads (20%)
- All elements aligned

**Tablet Test (768px)**
- Landscape: Layout should adapt
- Portrait: Should still be readable
- Ads should not block calculator

**Mobile Test (375px - iPhone)**
- Switch to single column (ads stack)
- Text readable without zoom
- Buttons tappable (>44px height)
- No horizontal scrolling
- Slider works with touch

**Instructions for responsive testing:**
```
Chrome DevTools:
1. Press F12 to open DevTools
2. Click device toggle icon (top-left of DevTools)
3. Select "iPhone SE" for mobile (375px)
4. Select "iPad" for tablet (768px)
5. Select "Responsive" and set to 1440px for desktop
```

**Status:** ☐ Pass ☐ Fail

---

### SECTION 5: Navigation & Pages (10 minutes)

**Goal:** Verify all pages load and links work

1. **Footer Navigation**
   - Scroll to bottom of page
   - Click "Privacy Policy" link
   - Verify /privacy page loads
   - Read a paragraph, verify content
   - Click footer link back home

2. **Terms of Service**
   - Go to footer
   - Click "Terms of Service" link
   - Verify /terms page loads
   - Check that content displays

3. **Advertise Page**
   - Go to footer or sidebar
   - Click "Advertise" or "Contact Us" button
   - Verify /advertise page loads
   - Check that page content displays

4. **Home Link**
   - From any page, click AIBurn logo
   - Verify returns to calculator

**Status:** ☐ Pass ☐ Fail

---

### SECTION 6: Ad System (5 minutes)

**Goal:** Verify ads display correctly

- [ ] Left sidebar shows 3+ ad cards
- [ ] Right sidebar shows 3+ ad cards
- [ ] Each ad card shows "Advertise Here"
- [ ] Each ad card has "Contact Us" button
- [ ] Ad cards link to /advertise page
- [ ] Ad styling matches design
- [ ] Ads scale properly on responsive layouts

**Status:** ☐ Pass ☐ Fail

---

### SECTION 7: Security & Error Handling (5 minutes)

**Goal:** Verify app handles errors gracefully

1. **Input Validation**
   - Try entering -1000 tokens
   - Try entering "abc" in token field
   - Try entering 99999999999 (very large number)
   - Verify app handles all gracefully

2. **Error Handling**
   - Deliberately cause an error (if possible)
   - Verify error message is user-friendly
   - Verify app doesn't crash
   - Verify can recover and continue

3. **No Credential Exposure**
   - Open DevTools Console (F12)
   - Calculate something
   - Search for any API keys or sensitive data
   - Should find NONE

**Status:** ☐ Pass ☐ Fail

---

### SECTION 8: Cross-Browser (10 minutes)

**Goal:** Verify works in major browsers

Test in at least 3 browsers:

**Browser 1: Chrome/Chromium**
- Quick Calculator: ✓ Pass ☐ Fail
- Exact Mode: ✓ Pass ☐ Fail
- Download Report: ✓ Pass ☐ Fail
- Console clean: ✓ Pass ☐ Fail

**Browser 2: Firefox**
- Quick Calculator: ✓ Pass ☐ Fail
- PNG Download: ✓ Pass ☐ Fail (Canvas rendering critical)
- Console clean: ✓ Pass ☐ Fail

**Browser 3: Safari (or Edge)**
- Quick Calculator: ✓ Pass ☐ Fail
- Share to X: ✓ Pass ☐ Fail
- Navigation: ✓ Pass ☐ Fail

**Status:** ☐ Pass ☐ Fail

---

### SECTION 9: Configuration Verification (5 minutes)

**Goal:** Verify all contact info is correct

1. **Email Address**
   - Check ad cards: contact@aiburn.howstud.io ✓ ☐
   - Check sidebar: contact@aiburn.howstud.io ✓ ☐
   - Check footer: contact@aiburn.howstud.io ✓ ☐
   - (Update if needed)

2. **Links & Branding**
   - Check logo displays in header ✓ ☐
   - Check Twitter share mentions AIBurn ✓ ☐
   - Check footer link to howstud.io works ✓ ☐

**Status:** ☐ Pass ☐ Fail

---

### SECTION 10: Performance Check (5 minutes)

**Goal:** Verify site loads fast

1. **Load Time**
   - Hard refresh (Ctrl+Shift+R on Windows/Cmd+Shift+R on Mac)
   - Time from click to page interactive: _____ seconds
   - Target: <2 seconds ✓ ☐

2. **Bundle Size**
   - Should be ~82 KB gzipped (verified ✓)

3. **Smoothness**
   - Slider movement smooth (60 FPS)? ✓ ☐
   - No stuttering on interactions? ✓ ☐

**Status:** ☐ Pass ☐ Fail

---

## 🎯 Pass/Fail Criteria

### ✅ PASS Requirements
- [ ] All 10 sections completed
- [ ] Quick Calculator accurate (±$0.01)
- [ ] No critical bugs found
- [ ] Security verified (no API keys exposed)
- [ ] Mobile/tablet/desktop layouts work
- [ ] All pages load and navigate correctly
- [ ] No console errors

### ❌ FAIL - Stop and Fix
- [ ] Quick Calculator gives wrong results
- [ ] App crashes
- [ ] API keys exposed in logs
- [ ] Mobile layout broken
- [ ] Share/Download not working

---

## 📊 Final Verdict

**Overall Result:** ☐ PASS (Ready for Deployment) ☐ FAIL (Needs Fixes)

**Time Spent:** _____ minutes  
**Tester Name:** _____________  
**Date:** November 24, 2025

**Critical Issues Found:**
(List any blockers here)
1. _________________________________
2. _________________________________
3. _________________________________

**Minor Issues Found:**
(Non-blocking improvements)
1. _________________________________
2. _________________________________

---

## 🚀 Next Steps (if PASS)

1. ✅ Manual testing complete
2. → Push code to GitHub
3. → Deploy to Vercel staging
4. → Run production smoke tests
5. → Deploy to production
6. → Monitor 48 hours

---

**Questions or Issues?**
Check `MANUAL_TESTING_REPORT.md` for detailed test scenarios.

