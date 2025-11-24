# 🔧 Recommended Fixes & Improvements

**Priority:** HIGH (Fix before production)  
**Time to implement:** ~15 minutes  
**Difficulty:** Easy

---

## 🎯 Single Critical Fix Required

### Fix #1: Add Request Timeout (10 seconds)

**File:** `aiburn-website/src/App.jsx`  
**Function:** `analyzeExactUsage()`  
**Current Line:** ~278  
**Priority:** HIGH

**Why:** Prevent users from waiting indefinitely if API hangs

**Current code (REMOVE):**
```javascript
const response = await fetch('/api/usage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ apiKey, provider }),
})

if (!response.ok) {
  throw new Error(response.statusText || 'Failed to fetch usage data')
}
```

**New code (REPLACE WITH):**
```javascript
// Add timeout protection
const controller = new AbortController()
const timeoutId = setTimeout(() => {
  controller.abort()
}, 10000) // 10 second timeout

let response

try {
  response = await fetch('/api/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, provider }),
    signal: controller.signal,
  })

  clearTimeout(timeoutId)

  if (!response.ok) {
    throw new Error(response.statusText || 'Failed to fetch usage data')
  }
} catch (err) {
  clearTimeout(timeoutId)

  if (err.name === 'AbortError') {
    throw new Error('Request took too long. Please check your connection and try again.')
  }
  throw err
}
```

---

## 📋 Step-by-Step Implementation

### Step 1: Open the file
```bash
code aiburn-website/src/App.jsx
# or
nano aiburn-website/src/App.jsx
```

### Step 2: Find the analyzeExactUsage function
Search for: `const analyzeExactUsage = async () =>`

### Step 3: Locate the fetch call
Search for: `const response = await fetch('/api/usage'`

### Step 4: Add timeout wrapper
The entire try/catch block should have:
- AbortController setup at start
- signal: controller.signal in fetch options
- clearTimeout after response OK
- AbortError handling in catch

### Step 5: Test it
```bash
npm run build
npm run dev
```

Then test in browser (open to http://localhost:5173)

---

## ✅ Verification Checklist

After implementing the fix:

- [ ] Code compiles without errors
- [ ] npm run build succeeds
- [ ] No console warnings
- [ ] Exact Usage mode still works
- [ ] Quick mode still works
- [ ] Share/Download still work

---

## 🧪 How to Test the Timeout

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Throttle connection** to "Slow 3G"
4. **Go to Exact Usage mode**
5. **Paste fake API key:** `sk-test1234567890`
6. **Click Calculate**
7. **Verify:**
   - ✅ After 10 seconds, shows "Request took too long" error
   - ❌ Does NOT wait forever
   - ❌ Does NOT crash app

---

## 📊 Optional Improvements (Can do after)

### Improvement 1: Better Error Messages
**File:** `App.jsx` line 348

**Current:**
```javascript
} catch (err) {
  setError(err.message)
}
```

**Better:**
```javascript
} catch (err) {
  // Map technical errors to user-friendly messages
  const userMessage = 
    err.message === 'Invalid API key' ? 'Invalid API key. Please check and try again.' :
    err.message.includes('timeout') ? 'Request timed out. Please try again.' :
    err.message.includes('network') ? 'Network error. Please check your connection.' :
    'Something went wrong. Please try again.'
  
  setError(userMessage)
}
```

### Improvement 2: Show loading state during timeout
**Current:** User doesn't know what's happening

**Better:** Add message like "Loading... (10 second timeout)"

### Improvement 3: Add rate limiting info
**Show:** "You can make 3 requests per minute"

---

## 🚀 Deployment After Fix

Once timeout fix is implemented:

1. ✅ Run final build
   ```bash
   npm run build
   ```

2. ✅ Test locally
   ```bash
   npm run dev
   # Test at http://localhost:5173
   ```

3. ✅ Commit to git
   ```bash
   git add src/App.jsx
   git commit -m "fix: add 10 second timeout to API requests"
   ```

4. ✅ Push to GitHub
   ```bash
   git push origin main
   ```

5. ✅ Deploy to Vercel
   - Auto-deploys from GitHub

---

## 📝 Optional: Post-Launch Improvements

**Can implement anytime, not blocking launch:**

1. **Analytics tracking** (track which models users select)
2. **Rate limiting** (prevent abuse)
3. **Caching** (cache results for same inputs)
4. **Better UI** (show loading spinner during timeout)
5. **Mobile optimization** (improve mobile UX)

---

## ✅ Summary

**What needs fixing:** Request timeout (10 sec)  
**Time required:** ~5 minutes  
**Difficulty:** Easy  
**Blocking launch:** Yes  
**Risk if not fixed:** Users wait forever on slow API  

**After fix:** ✅ READY FOR PRODUCTION

---

Generated: November 24, 2025

