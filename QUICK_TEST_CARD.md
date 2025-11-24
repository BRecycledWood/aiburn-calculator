# 🎯 AIBurn Testing - Quick Reference Card

**Date:** Nov 24, 2025 | **Build:** ✅ Verified | **Duration:** ~90 min

---

## 📍 Access Point
```
http://localhost:5173
```

---

## 🧪 10 Core Tests (Priority Order)

### 1️⃣ Quick Calculator - CRITICAL
```
Test: GPT-4o + 100,000 tokens
Expected: $0.30
Your result: ___________
Status: ✓ Pass ☐ Fail
```

### 2️⃣ Model Selection - CRITICAL
```
- Select GPT-4o ✓ ☐
- Select o1 ✓ ☐
- Select Claude 3.5 ✓ ☐
- Prices update correctly ✓ ☐
```

### 3️⃣ Responsive Design - CRITICAL
```
Mobile (375px):   ✓ ☐
Tablet (768px):   ✓ ☐
Desktop (1440px): ✓ ☐
No horizontal scroll: ✓ ☐
```

### 4️⃣ Share to X - CRITICAL
```
- Click "Share Results on X" ✓ ☐
- Tweet opens ✓ ☐
- Content looks professional ✓ ☐
```

### 5️⃣ Download Report - CRITICAL
```
- Click "Download Report" ✓ ☐
- PNG downloads ✓ ☐
- Image readable ✓ ☐
- Numbers match calculator ✓ ☐
```

### 6️⃣ Navigation - HIGH
```
/advertise page loads: ✓ ☐
/privacy page loads:   ✓ ☐
/terms page loads:     ✓ ☐
Back to home works:    ✓ ☐
```

### 7️⃣ Security - HIGH
```
- No console errors ✓ ☐
- API key not exposed ✓ ☐
- Error messages safe ✓ ☐
```

### 8️⃣ Exact Mode (if API available) - MEDIUM
```
- Valid API key accepted ✓ ☐
- Results display ✓ ☐
- Invalid key shows error ✓ ☐
```

### 9️⃣ Browser Compatibility - MEDIUM
```
Chrome:   ✓ ☐
Firefox:  ✓ ☐
Safari:   ✓ ☐
Edge:     ✓ ☐
```

### 🔟 Configuration - LOW
```
- Email: contact@aiburn.howstud.io ✓ ☐
- Logo displays ✓ ☐
- Footer links work ✓ ☐
```

---

## ⚡ Accuracy Tests (Must Match)

| Model | Tokens | Expected | Actual | Pass |
|-------|--------|----------|--------|------|
| GPT-4o | 100K | $0.30 | ______ | ✓ ☐ |
| o1 | 1M | $15.00 | ______ | ✓ ☐ |
| Claude 3.5 | 500K | $1.50 | ______ | ✓ ☐ |

---

## 🚨 If Any Test Fails

**STOP** - Don't deploy until fixed.

1. Check browser console (F12)
2. Document error in `MANUAL_TESTING_REPORT.md`
3. Fix in code
4. Run `npm run build` again
5. Refresh browser and retest

---

## ✅ Final Verdict

**All tests passed?** 

☐ YES → Ready for GitHub + Vercel deployment  
☐ NO  → Fix issues first, retest

**Tester:** _____________  
**Time:** _____ min  
**Date:** Nov 24, 2025

---

## 🚀 Next (If All Pass)

1. `git push` to GitHub
2. Vercel auto-deploys
3. Test on staging
4. Deploy to production
5. Monitor 48 hours

**Est. time:** 2-3 hours total

