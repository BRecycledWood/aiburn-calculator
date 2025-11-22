# How to Integrate Auto-Updated Prices into App.jsx

This guide provides the exact code needed to load prices from the auto-update system.

---

## Step 1: Add Price State to App Component

**Location:** Top of your App component in `src/App.jsx`

**Find this:** `const [currentFeatureAd, setCurrentFeatureAd] = useState(0)`

**Add after it:**
```javascript
const [pricesLastUpdated, setPricesLastUpdated] = useState(null)
const [pricesLoaded, setPricesLoaded] = useState(false)
```

---

## Step 2: Add useEffect to Load Prices

**Location:** After your existing useEffect hooks in `src/App.jsx`

**Add this new useEffect:**
```javascript
// Load latest prices on app start
useEffect(() => {
  setPricesLoaded(false)
  
  fetch('/data/prices.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(data => {
      // Store the timestamp
      setPricesLastUpdated(data.timestamp)
      setPricesLoaded(true)
      
      // Optional: Log for debugging
      console.log('✅ Prices loaded from auto-update system', {
        timestamp: data.timestamp,
        models: Object.keys(data.models).length,
        successCount: data.metadata?.successCount
      })
      
      // Optional: Update MODELS if you want to use loaded prices
      // Note: This requires more complex state management
      // For now, we'll keep using hardcoded MODELS for calculations
      // But display the last updated timestamp
    })
    .catch(err => {
      console.warn('Failed to load prices from auto-update system', err)
      // App continues with hardcoded prices (no error shown to user)
      setPricesLoaded(true) // Mark as loaded even if fetch failed
      // Don't set lastUpdated - will show "N/A" or hide the component
    })
}, []) // Empty dependency array - runs once on mount
```

---

## Step 3: Display "Prices Updated" in Header

**Location:** In the header section, after the mode toggle buttons

**Current code looks like:**
```javascript
<div className="flex gap-2">
  <button onClick={() => { ... }}>Quick Calc</button>
  <button onClick={() => { ... }}>Exact Usage</button>
</div>
```

**Add after it:**
```javascript
{pricesLastUpdated && (
  <div className="text-xs text-slate-500 ml-auto">
    Prices: {new Date(pricesLastUpdated).toLocaleDateString()}
  </div>
)}
```

Full example:
```javascript
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    {/* ... existing logo code ... */}
  </div>
  <div className="flex items-center gap-4">
    <div className="flex gap-2">
      <button
        onClick={() => { ... }}
        className={...}
      >
        Quick Calc
      </button>
      <button
        onClick={() => { ... }}
        className={...}
      >
        Exact Usage
      </button>
    </div>
    {pricesLastUpdated && (
      <div className="text-xs text-slate-500 whitespace-nowrap">
        Prices: {new Date(pricesLastUpdated).toLocaleDateString()}
      </div>
    )}
  </div>
</div>
```

---

## Step 4: Optional - Add Status Indicator

**Location:** Same header area (if you want a visual indicator)

```javascript
{pricesLoaded && (
  <div className="flex items-center gap-1 text-xs">
    <div className={`w-2 h-2 rounded-full ${pricesLastUpdated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
    <span className="text-slate-600">
      {pricesLastUpdated ? 'Live' : 'Cached'}
    </span>
  </div>
)}
```

---

## Step 5: Optional - Add to Footer

**Location:** Footer section, near the "Build by..." text

```javascript
<div className="mt-4 text-center text-xs text-slate-500">
  {pricesLastUpdated && (
    <p>AI model prices updated: {new Date(pricesLastUpdated).toLocaleDateString()}</p>
  )}
  <p>
    Built by{' '}
    <a href="https://howstud.io" target="_blank" rel="noopener noreferrer" className="text-purple-600">
      HowStudios
    </a>
  </p>
</div>
```

---

## Complete Code Example

Here's what a minimal complete implementation looks like:

```javascript
import { useState, useEffect } from 'react'
// ... other imports ...

export default function App() {
  // ... existing state variables ...
  const [currentFeatureAd, setCurrentFeatureAd] = useState(0)
  
  // NEW: Add these two lines
  const [pricesLastUpdated, setPricesLastUpdated] = useState(null)
  const [pricesLoaded, setPricesLoaded] = useState(false)

  // ... existing useEffect for featured ads rotation ...

  // NEW: Add this useEffect
  useEffect(() => {
    setPricesLoaded(false)
    
    fetch('/data/prices.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setPricesLastUpdated(data.timestamp)
        setPricesLoaded(true)
        console.log('✅ Prices loaded:', data.timestamp)
      })
      .catch(err => {
        console.warn('Failed to load prices:', err)
        setPricesLoaded(true)
      })
  }, [])

  // ... rest of your component ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            {/* Logo section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-xl font-bold text-white">🔥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AIBurn</h1>
                <p className="text-slate-600 text-xs">Optimize your AI costs</p>
              </div>
            </div>
            
            {/* Mode toggle and price display */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('quick'); setResults(null); setError('') }}
                  className={...}
                >
                  Quick Calc
                </button>
                <button
                  onClick={() => { setMode('exact'); setResults(null); setError('') }}
                  className={...}
                >
                  Exact Usage
                </button>
              </div>
              
              {/* NEW: Add this section */}
              {pricesLastUpdated && (
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  Prices: {new Date(pricesLastUpdated).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ... rest of your JSX ... */}
    </div>
  )
}
```

---

## Testing the Integration

### 1. Local Test
```bash
# Start dev server
npm run dev

# Open browser DevTools (F12)
# Check console for "✅ Prices loaded" message
# Verify date shows in header
```

### 2. Fallback Test
```bash
# Temporarily rename the prices file to trigger fallback
mv public/data/prices.json public/data/prices.json.bak

# Refresh browser - should still work with cached prices
# Check console for "Failed to load prices" warning

# Restore the file
mv public/data/prices.json.bak public/data/prices.json
```

### 3. Production Test
```bash
# Build
npm run build

# Check that dist contains prices data
ls -la dist/data/prices.json

# Preview build
npm run preview

# Open browser and verify date shows
```

---

## Troubleshooting

### Prices Not Showing

**Problem:** Header shows no date
**Solution:**
1. Check if `public/data/prices.json` exists
2. Open DevTools Console (F12)
3. Look for error messages
4. Manually run: `npm run update-prices`

### Console Error: "404 Not Found"

**Problem:** `Failed to load prices` error in console
**Solution:**
1. Ensure `public/data/prices.json` exists
2. Check file isn't in `dist/` but outside (should be in `public/`)
3. Verify file path is correct (case-sensitive)

### Date Shows Wrong Format

**Problem:** Date doesn't display as expected
**Solution:**
```javascript
// Try different format:
{new Date(pricesLastUpdated).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})}
// Output: Nov 17, 2025
```

### "Can't find prices.json"

**Problem:** Build doesn't include prices.json
**Solution:**
1. Make sure file is in `public/`, not `src/`
2. Run: `npm run build` then `npm run preview`
3. Check `dist/data/prices.json` exists after build

---

## Advanced: Load Prices into Models

If you want to use the auto-updated prices in calculations (not just display):

```javascript
// Load prices into MODELS object
useEffect(() => {
  fetch('/data/prices.json')
    .then(res => res.json())
    .then(data => {
      // Convert loaded prices to MODELS format
      const updatedModels = { ...MODELS }
      
      Object.entries(data.models).forEach(([name, priceData]) => {
        if (updatedModels[name]) {
          updatedModels[name] = {
            ...updatedModels[name],
            input: priceData.input / 1000000, // Convert from per-1M to per-token
            output: priceData.output / 1000000
          }
        }
      })
      
      // Now use updatedModels in calculations
      // This requires refactoring calculateCosts() to accept models as parameter
    })
}, [])
```

---

## Summary

**Minimal implementation:** 
- Add 2 state variables
- Add 1 useEffect hook
- Add 2-4 lines to display date
- Total: ~20 lines of code

**Time required:** 10 minutes

**Testing:** 5 minutes

**Total:** 15 minutes to complete integration

---

## Next: Real API Integration (Optional)

Once this is working, you can connect to real APIs:
- See `AUTO_UPDATE_MECHANISM.md` for API integration details
- Update `scripts/fetch-ai-prices.js` to fetch from provider APIs
- Test thoroughly before deploying

---

## Questions?

Check these files for more info:
- `PRICE_UPDATE_QUICK_START.md` - Quick reference
- `AUTO_UPDATE_MECHANISM.md` - Technical details
- `scripts/fetch-ai-prices.js` - How it works
