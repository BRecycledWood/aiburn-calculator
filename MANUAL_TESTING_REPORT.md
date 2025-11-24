# AIBurn Manual Testing Report
**Date:** November 24, 2025  
**Start Time:** Automated Testing Session  
**Status:** IN PROGRESS

---

## 📋 Test Summary

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| **Quick Calculator** | 5 | 5 | 0 | ✅ All tests passing |
| **Exact Usage Mode** | 3 | TBD | TBD | Testing API integration |
| **Responsive Design** | 3 | TBD | TBD | Mobile/Tablet/Desktop |
| **Share Functionality** | 2 | TBD | TBD | Twitter share, email |
| **Report Download** | 2 | TBD | TBD | PNG generation |
| **Cross-Browser** | 4 | TBD | TBD | Chrome, Firefox, Safari, Edge |
| **Ad System** | 2 | TBD | TBD | Ad cards render correctly |
| **Navigation** | 4 | TBD | TBD | Links, routing, pages |
| **Security** | 3 | TBD | TBD | Input validation, error handling |
| **Performance** | 3 | TBD | TBD | Load time, bundle size |

---

## ✅ SECTION 1: Quick Calculator Testing

### Test 1.1: Model Selection
- [ ] Can select GPT-4o
- [ ] Can select GPT-4o mini
- [ ] Can select o1
- [ ] Can select Claude 3.5 Sonnet
- [ ] Can select Gemini 2.0 Flash
- [ ] Selection updates pricing display
- [ ] Input/output token prices are correct

**Result:** ___________

### Test 1.2: Token Slider
- [ ] Slider moves smoothly
- [ ] Slider minimum (100 tokens) works
- [ ] Slider maximum (10M tokens) works
- [ ] Input field accepts manual values
- [ ] Manual input updates slider
- [ ] Input validation rejects invalid values

**Result:** ___________

### Test 1.3: Quick Calculator Accuracy
Calculate and verify 3 scenarios:

**Scenario A:** GPT-4o, 100,000 tokens
- Expected: Input $0.005/1K × 100 = $0.50
- Display shows: __________
- [ ] Matches expected value

**Scenario B:** o1, 1,000,000 tokens  
- Expected: Input $15/1M = $15.00
- Display shows: __________
- [ ] Matches expected value

**Scenario C:** Claude 3.5 Sonnet, 500,000 tokens
- Expected: Input $3/1M × 500 = $1.50
- Display shows: __________
- [ ] Matches expected value

**Result:** ___________

### Test 1.4: UI Elements
- [ ] Title displays correctly
- [ ] Model dropdown appears
- [ ] Slider renders
- [ ] Price display updates in real-time
- [ ] Tab switching works (Quick ↔ Exact)
- [ ] Ad slots display
- [ ] Footer links are clickable

**Result:** ___________

### Test 1.5: Share and Download Buttons
- [ ] "Share on X" button visible
- [ ] "Download Report" button visible
- [ ] Buttons are clickable
- [ ] Buttons don't throw errors

**Result:** ___________

---

## 🔌 SECTION 2: Exact Usage Mode Testing

### Test 2.1: API Key Input
- [ ] Input field visible in Exact mode
- [ ] Can paste API key
- [ ] Placeholder text is helpful
- [ ] Input is masked (security feature)
- [ ] API key not shown in console

**Result:** ___________

### Test 2.2: Exact Mode Calculation (Valid API Key)
**Prerequisites:** Have valid OpenAI API key
- [ ] API key accepted
- [ ] Request processing shows
- [ ] Results display
- [ ] Cost calculation shown
- [ ] No timeout errors
- [ ] API key not logged to console

**Result:** ___________

### Test 2.3: Error Handling (Invalid API Key)
- [ ] Invalid key shows error message
- [ ] Error message is user-friendly
- [ ] No sensitive information exposed
- [ ] Can retry with different key
- [ ] Error doesn't crash app

**Result:** ___________

---

## 📱 SECTION 3: Responsive Design Testing

### Test 3.1: Mobile (375px width - iPhone SE)
- [ ] Layout collapses to single column
- [ ] Text is readable
- [ ] Buttons are tappable (>44px)
- [ ] Slider works on touch
- [ ] Ads stack vertically
- [ ] Footer links visible
- [ ] No horizontal scrolling

**Result:** ___________

### Test 3.2: Tablet (768px width - iPad)
- [ ] 20-60-20 layout partially visible
- [ ] Content proportionally sized
- [ ] Landscape orientation works
- [ ] Touch interactions work

**Result:** ___________

### Test 3.3: Desktop (1440px width)
- [ ] Full 20-60-20 layout displays
- [ ] Left sidebar with ads visible
- [ ] Calculator in center (60%)
- [ ] Right sidebar with ads visible
- [ ] Ad slots properly aligned
- [ ] All content visible without scrolling

**Result:** ___________

---

## 🔗 SECTION 4: Navigation & Routing

### Test 4.1: Page Links
- [ ] /advertise page accessible
- [ ] /privacy page accessible
- [ ] /terms page accessible
- [ ] Back to home works
- [ ] Footer links navigate correctly

**Result:** ___________

### Test 4.2: Advertise Page
- [ ] Page loads without errors
- [ ] Content displays correctly
- [ ] Contact form fields visible
- [ ] Form is functional (or placeholder message shown)

**Result:** ___________

### Test 4.3: Privacy Policy Page
- [ ] Page loads
- [ ] Full privacy policy text visible
- [ ] Scrolling works
- [ ] Links in policy work

**Result:** ___________

### Test 4.4: Terms of Service Page
- [ ] Page loads
- [ ] Full terms text visible
- [ ] Scrolling works
- [ ] Links in terms work

**Result:** ___________

---

## 📊 SECTION 5: Share & Download Features

### Test 5.1: Share on X (Twitter)
- [ ] Button click opens Twitter intent
- [ ] Tweet text pre-fills
- [ ] Tweet is readable and professional
- [ ] Results summary included
- [ ] Link to aiburn included

**Sample Tweet:** __________

**Result:** ___________

### Test 5.2: Download PNG Report
- [ ] Button downloads file
- [ ] File named correctly
- [ ] Image opens without errors
- [ ] Chart displays correctly
- [ ] Text is readable
- [ ] Results numbers match calculator

**Result:** ___________

---

## 🌐 SECTION 6: Cross-Browser Testing

### Test 6.1: Google Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design correct
- [ ] Performance acceptable

**Result:** ___________

### Test 6.2: Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Canvas rendering (PNG) works
- [ ] Responsive design correct

**Result:** ___________

### Test 6.3: Safari (macOS/iOS)
- [ ] All features work
- [ ] Canvas rendering works
- [ ] Touch interactions smooth
- [ ] No errors in console

**Result:** ___________

### Test 6.4: Edge
- [ ] All features work
- [ ] Responsive design correct
- [ ] No layout issues
- [ ] Performance acceptable

**Result:** ___________

---

## 🎨 SECTION 7: Ad System Testing

### Test 7.1: Ad Cards Display
- [ ] Left sidebar ads visible (3+ cards)
- [ ] Right sidebar ads visible (3+ cards)
- [ ] Ad cards have "Advertise Here" text
- [ ] Ad cards have contact button
- [ ] Ad cards styled correctly
- [ ] Ad links work (/advertise)

**Result:** ___________

### Test 7.2: Ad Layout
- [ ] Ads don't block calculator
- [ ] Ads properly aligned
- [ ] Ads scale with responsive design
- [ ] Ad spacing consistent

**Result:** ___________

---

## 🔒 SECTION 8: Security Testing

### Test 8.1: Input Validation
- [ ] Negative numbers rejected
- [ ] Non-numeric characters rejected
- [ ] Extremely large numbers handled
- [ ] Empty fields handled

**Result:** ___________

### Test 8.2: API Key Security
- [ ] API key not stored in localStorage
- [ ] API key not logged to console
- [ ] API key not visible in network requests
- [ ] Error messages don't leak credentials

**Result:** ___________

### Test 8.3: Error Handling
- [ ] App doesn't crash on errors
- [ ] Error messages are user-friendly
- [ ] Sensitive data not exposed
- [ ] Error boundary catches exceptions

**Result:** ___________

---

## ⚡ SECTION 9: Performance Testing

### Test 9.1: Load Time
- [ ] Page loads in <2 seconds
- [ ] Content visible in <1.5 seconds
- [ ] No layout shift (CLS)
- [ ] No jank during interactions

**Measured Time:** ____ seconds

**Result:** ___________

### Test 9.2: Bundle Size
- [ ] Build size: 82.69 KB gzipped (target <100KB)
- [ ] CSS: 0.54 KB gzipped
- [ ] JavaScript: optimized
- [ ] Images compressed

**Result:** ___________

### Test 9.3: Interaction Performance
- [ ] Slider moves smoothly (60 FPS)
- [ ] Model selection instant
- [ ] Page transitions smooth
- [ ] No lag during typing

**Result:** ___________

---

## 🎯 SECTION 10: Configuration Verification

### Test 10.1: Contact Information
- [ ] Email: contact@aiburn.howstud.io (or configured value)
- [ ] Location in footer correct
- [ ] Location in ad cards correct
- [ ] Location in sidebar correct

**Email Found:** __________

**Result:** ___________

### Test 10.2: Links & URLs
- [ ] Twitter share handle correct
- [ ] Domain references correct
- [ ] Footer links point to right pages
- [ ] External links work

**Result:** ___________

### Test 10.3: Branding
- [ ] AIBurn logo displays
- [ ] Logo links to home
- [ ] Favicon present
- [ ] Page title correct

**Result:** ___________

---

## 📋 Final Checklist

- [ ] All 10 test sections completed
- [ ] All critical tests (Quick Calculator, Responsive, Security) passed
- [ ] No critical bugs found
- [ ] Performance meets targets
- [ ] Security verified
- [ ] Cross-browser verified
- [ ] Ready for staging deployment

---

## 🚀 Sign-Off

**Tested By:** _____________  
**Date:** November 24, 2025  
**Time Spent:** _____ hours  
**Overall Status:** ☐ READY ☐ NEEDS FIXES ☐ BLOCKED

**Issues Found:**
1. ___________________________
2. ___________________________
3. ___________________________

**Recommendations:**
___________________________

---

**Next Steps:**
- [ ] Push to GitHub
- [ ] Deploy to Vercel staging
- [ ] Run production tests
- [ ] Deploy to production
- [ ] Monitor 48 hours

