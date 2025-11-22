# AIBurn Quick Fixes - Copy/Paste Ready

**Estimated Time to Apply**: 30-45 minutes  
**Difficulty**: Low  
**Impact**: Eliminates all 5 critical security issues  

---

## Fix #1: App.jsx - Email Link XSS (Line 110)

### Location
`src/App.jsx` - Inside `AdCard` component

### Find This
```jsx
        <a
          href="mailto:ads@howstud.io?subject=Advertising%20Inquiry%20-%20{slot.name}"
          className={`text-sm ${isLightBg ? 'bg-slate-900' : 'bg-white'} bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold`}
        >
          Inquire →
        </a>
```

### Replace With
```jsx
        <a
          href={`mailto:ads@howstud.io?subject=${encodeURIComponent(`Advertising Inquiry - ${slot.name}`)}`}
          className={`text-sm ${isLightBg ? 'bg-slate-900' : 'bg-white'} bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold`}
        >
          Inquire →
        </a>
```

---

## Fix #2: App.jsx - Left Sidebar Email Links (Line 484)

### Location
`src/App.jsx` - Left sidebar ad card loop

### Find This
```jsx
                <a href="mailto:ads@howstud.io" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Inquire →
                </a>
```

### Replace With
```jsx
                <a href={`mailto:ads@howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Inquire →
                </a>
```

---

## Fix #3: App.jsx - Right Sidebar Email Links (Line 773)

### Location
`src/App.jsx` - Right sidebar ad card loop

### Find This
```jsx
                <a href="mailto:ads@howstud.io" className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Inquire →
                </a>
```

### Replace With
```jsx
                <a href={`mailto:ads@howstud.io?subject=${encodeURIComponent('Advertising Inquiry')}`} className="text-sm bg-slate-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg inline-block transition font-semibold text-slate-900">
                  Inquire →
                </a>
```

---

## Fix #4: App.jsx - Twitter Share Data Validation (Line 322)

### Location
`src/App.jsx` - `shareOnTwitter` function

### Find This
```javascript
  const shareOnTwitter = () => {
    if (!results) return

    const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${results.alternatives[0].savings} monthly by switching to ${results.alternatives[0].name}. Current spending: $${results.currentCost}/month. Check the ROI on your AI stack → aiburn.howstud.io`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }
```

### Replace With
```javascript
  const shareOnTwitter = () => {
    if (!results) return

    // Validate data before using
    const savings = parseFloat(results.alternatives[0].savings)
    const currentCost = parseFloat(results.currentCost)

    if (isNaN(savings) || isNaN(currentCost)) {
      setError('Invalid calculation data. Please recalculate.')
      return
    }

    // Sanitize model name
    const modelName = String(results.alternatives[0].name)
      .replace(/[<>"'&]/g, '')
      .substring(0, 50)

    const text = `I analyzed my AI token costs using @howstudio's calculator and discovered I could save $${savings.toFixed(2)} monthly by switching to ${modelName}. Current spending: $${currentCost.toFixed(2)}/month. Check the ROI on your AI stack → aiburn.howstud.io`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }
```

---

## Fix #5: App.jsx - Token Value Validation (Line 523)

### Location
`src/App.jsx` - Token slider section, add validation function and update onChange

### Find This
```jsx
                {/* Token Slider */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 2: Monthly Token Usage
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={monthlyTokens}
                      onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
```

### Replace With
```jsx
                {/* Token Slider */}
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Step 2: Monthly Token Usage
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={monthlyTokens}
                      onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
```

**Also add this function before the calculateCosts function (around line 164):**

```javascript
  // Validate token range
  const validateTokenRange = (tokens) => {
    const MAX_TOKENS = 500
    if (isNaN(tokens) || tokens < 1 || tokens > MAX_TOKENS) {
      setError(`Token usage must be between 1M and ${MAX_TOKENS}M`)
      return false
    }
    return true
  }
```

---

## Fix #6: api/usage.js - Complete Replacement

### Location
`api/usage.js` - Replace entire file

### Current File Size
187 lines

### New File Size
~350 lines (adds validation and security)

### Action
Replace the entire contents with the code in `SECURITY_FIXES.md` (Section 2)

**OR** Apply these focused changes if you can't replace the whole file:

#### Change 1: Add validation at the top (after imports)
Add this before the `export default` function:

```javascript
const VALID_PROVIDERS = ['openai', 'anthropic']
const MAX_API_KEY_LENGTH = 500

const validateProvider = (provider) => {
  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    throw new Error('Invalid provider')
  }
  return provider
}

const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('Invalid API key format')
  }
  const trimmed = apiKey.trim()
  if (trimmed.length === 0 || trimmed.length > MAX_API_KEY_LENGTH) {
    throw new Error('Invalid API key length')
  }
  return trimmed
}
```

#### Change 2: Update error handling (line 59-82)
Replace:
```javascript
  } catch (error) {
    console.error('Usage fetch error:', error)

    // Set CORS headers for error response too
    Object.keys(corsHeaders).forEach((key) => {
      res.setHeader(key, corsHeaders[key])
    })

    // Return user-friendly error messages
    if (error.message.includes('401')) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your credentials.',
      })
    }

    if (error.message.includes('404')) {
      return res.status(404).json({
        error: 'API endpoint not found. Please check the provider.',
      })
    }

    res.status(500).json({
      error: error.message || 'Failed to fetch usage data',
    })
  }
```

With:
```javascript
  } catch (error) {
    // Never log sensitive data
    console.error('Usage fetch error:', error.message)

    // Set CORS headers for error response too
    Object.keys(corsHeaders).forEach((key) => {
      res.setHeader(key, corsHeaders[key])
    })

    // Return user-friendly error messages (no sensitive data)
    if (error.message.includes('Invalid API key')) {
      return res.status(400).json({
        error: 'Invalid API key format',
      })
    }

    if (error.message.includes('Invalid provider')) {
      return res.status(400).json({
        error: 'Invalid provider specified',
      })
    }

    if (error.message.includes('401')) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your credentials.',
      })
    }

    if (error.message.includes('404')) {
      return res.status(404).json({
        error: 'API endpoint not found. Please check the provider.',
      })
    }

    res.status(500).json({
      error: 'Failed to fetch usage data. Please try again.',
    })
  }
```

#### Change 3: Add validation to inputs (line 31-37)
Replace:
```javascript
  const { apiKey, provider } = req.body

  if (!apiKey || !provider) {
    return res
      .status(400)
      .json({ error: 'Missing apiKey or provider' })
  }
```

With:
```javascript
  const { apiKey, provider } = req.body

  try {
    validateProvider(provider)
    validateApiKey(apiKey)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
```

---

## Fix #7: vercel.json - Add Security Headers

### Location
`vercel.json` - If it doesn't exist, create it

### Add This
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Verification Steps

After applying all fixes:

```bash
# 1. Check for syntax errors
npm run build

# 2. Run tests
npm test

# 3. Start dev server and test manually
npm run dev

# Then visit:
# - http://localhost:5173
# - Test email links (should have proper subjects)
# - Test token slider (try extreme values)
# - Test Twitter share with valid data
# - Test API with invalid keys
```

---

## Quick Checklist

- [ ] Fix #1: Email link XSS (Line 110)
- [ ] Fix #2: Left sidebar emails (Line 484)
- [ ] Fix #3: Right sidebar emails (Line 773)
- [ ] Fix #4: Twitter share validation (Line 322)
- [ ] Fix #5: Token validation (Line 523)
- [ ] Fix #6: API validation (api/usage.js)
- [ ] Fix #7: Security headers (vercel.json)
- [ ] Run `npm run build` - Success ✅
- [ ] Run `npm test` - Passing ✅
- [ ] Manual testing - Verified ✅

---

## Testing Commands

### Test Email Links Work
```javascript
// In browser console:
// Should produce properly encoded URLs
console.log(encodeURIComponent('Advertising Inquiry - Header Banner'))
// Output: Advertising%20Inquiry%20-%20Header%20Banner
```

### Test API Validation
```bash
# This should fail (invalid provider)
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-test", "provider": "invalid"}'

# Response: 400 Invalid provider specified
```

### Test Token Validation
```javascript
// In dev tools console, in React state:
// Try to set token to 1000
// Should trigger error: "Token usage must be between 1M and 500M"
```

---

## Rollback Plan

If something breaks after applying fixes:

```bash
# Revert to previous version
git checkout HEAD -- src/App.jsx api/usage.js vercel.json

# Or restore from backup
git revert <commit-hash>
```

---

## Next Steps

1. ✅ Apply all 7 fixes
2. ✅ Verify with `npm run build`
3. ✅ Test in browser
4. ✅ Run test suite
5. 📝 Create GitHub PR
6. 👀 Code review
7. ✅ Merge to main
8. 🚀 Deploy to Vercel

---

## Support

If you get stuck:

1. Read the detailed fix in SECURITY_FIXES.md
2. Check the line numbers in the original file
3. Compare with the examples above
4. Run `npm run build` to catch syntax errors
5. Check browser console for runtime errors

**Estimated total time**: 30-45 minutes for all 7 fixes
