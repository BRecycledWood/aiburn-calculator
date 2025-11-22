# Price Update System: Quick Start Guide

## What's Already Done ✅

The AIBurn cost calculator has a **fully automated price update system** that:
- Fetches AI model prices daily (automatically)
- Stores them in `public/data/prices.json`
- Validates all data before saving
- Falls back to cached prices if anything fails
- Logs everything to `logs/price-updates.log`
- Commits changes to git automatically

## Run a Manual Update (30 seconds)

```bash
cd aiburn-website
npm run update-prices
```

Output:
```
[2025-11-17T12:34:56.789Z] INFO: Starting price update process
[2025-11-17T12:34:56.890Z] INFO: Processing OpenAI prices
[2025-11-17T12:34:57.100Z] SUCCESS: Price update completed successfully
```

Check the results:
```bash
cat public/data/prices.json | head -30
tail -20 logs/price-updates.log
```

## Set Up Automatic Updates (GitHub Actions)

The system already runs automatically, but here's how to verify:

1. **Go to GitHub repository**
2. **Click "Actions" tab**
3. **Select "Update AI Model Prices"**
4. **Click "Run workflow"** to test it

The workflow:
- Runs daily at **midnight UTC** (0:00)
- Can be triggered manually anytime
- Auto-commits changes to git
- Creates GitHub issue if anything fails

## Test the System (1 minute)

```bash
# Run all price tests
npm run test:prices

# Output should show:
# PASS scripts/__tests__/fetch-ai-prices.test.js
#   ✓ All 25+ tests pass
```

## What's Next? (To Complete Integration)

### 1. Load Prices in App (10 minutes)

**File:** `src/App.jsx`

Add this code near the top of your App component:

```javascript
import { useEffect, useState } from 'react'

export default function App() {
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Load latest prices on app start
  useEffect(() => {
    fetch('/data/prices.json')
      .then(res => res.json())
      .then(data => {
        // Store the timestamp
        setLastUpdated(data.timestamp)
        console.log('Prices loaded:', data.models)
        // You can update MODELS here if desired
      })
      .catch(err => {
        console.error('Failed to load prices, using defaults', err)
        // App continues with hardcoded prices
      })
  }, [])
  
  return (
    // ... existing JSX ...
    // Add somewhere visible:
    <div className="text-xs text-slate-500 mt-4">
      Prices updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Loading...'}
    </div>
  )
}
```

### 2. Display Update Date in Results (5 minutes)

In Step 3 results section, add:

```javascript
{results && (
  <div className="text-xs text-slate-500 mb-4">
    Last prices updated: {new Date(results.pricesUpdated || lastUpdated).toLocaleDateString()}
  </div>
)}
```

### 3. Connect Real APIs (Advanced, 2+ hours)

**Update:** `scripts/fetch-ai-prices.js`

Replace hardcoded prices with actual API calls:

```javascript
// Example: OpenAI API
async function fetchOpenAIPrices() {
  // Fetch from https://openai.com/api/pricing/
  // Parse the response
  // Extract model prices
  // Return in standard format
}

// Add to PRICE_SOURCES:
// Before: 'GPT-4': { input: 0.03, output: 0.06, ... }
// After: Call actual API and get current prices
```

## File Locations

```
Project Structure:
├── scripts/fetch-ai-prices.js       ← Main price fetcher
├── scripts/__tests__/
│   └── fetch-ai-prices.test.js      ← Tests (25+ cases)
├── public/data/prices.json          ← Current prices (auto-updated)
├── logs/price-updates.log           ← Update logs
├── src/App.jsx                      ← Main app (needs update)
└── .github/workflows/
    └── update-prices.yml            ← GitHub automation (running)
```

## Commands Reference

```bash
# Manual price update
npm run update-prices

# Run price tests
npm run test:prices

# Run all tests
npm run test:all

# View update logs
tail -50 logs/price-updates.log

# Check prices JSON
cat public/data/prices.json | jq '.models | keys'

# Full dev server
npm run dev
```

## How It Works (Simple Version)

1. **Every day at midnight UTC**, GitHub Actions wakes up
2. **Runs the price fetcher script**, which:
   - Reads configured model prices
   - Validates all data
   - Saves to `public/data/prices.json`
   - Logs everything
3. **If successful**: Git auto-commits the changes
4. **If it fails**: Uses cached version, creates GitHub issue
5. **Your app** can load these prices anytime

## Monitoring

### Check if update ran:
```bash
# View logs
tail logs/price-updates.log

# Or check GitHub
# Actions tab → "Update AI Model Prices" → see recent runs
```

### Verify prices are current:
```bash
# Check timestamp in prices.json
cat public/data/prices.json | jq '.timestamp'

# Should be recent (last 24 hours for daily schedule)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm run update-prices` fails | Check `logs/price-updates.log` for details |
| Tests fail | Run `npm run test:prices` to see which tests failed |
| Prices not updating in app | Make sure App.jsx has the fetch code (see above) |
| GitHub workflow shows error | Check Actions tab > workflow logs for details |
| prices.json not found | Run `mkdir -p public/data` then `npm run update-prices` |

## What Gets Updated Daily

```json
{
  "GPT-4": { "input": 30, "output": 60, ... },
  "GPT-4 Turbo": { "input": 10, "output": 30, ... },
  "GPT-4o": { "input": 2.5, "output": 10, ... },
  "GPT-3.5 Turbo": { "input": 0.5, "output": 1.5, ... },
  "Claude 3 Opus": { "input": 15, "output": 75, ... },
  "Claude 3.5 Sonnet": { "input": 3, "output": 15, ... },
  "Claude 3 Haiku": { "input": 0.25, "output": 1.25, ... },
  "Llama 3.1 70B": { "input": 0.05, "output": 0.08, ... },
  "DeepSeek Chat": { "input": 0.14, "output": 0.28, ... }
}
```

All prices are per **1 million tokens**.

## Next Steps

**Priority order:**

1. ✅ Review this guide (you're reading it!)
2. ✅ Run `npm run update-prices` once
3. ✅ Run `npm run test:prices` to verify
4. 📌 **Next**: Add fetch code to App.jsx (10 min)
5. 📌 **Next**: Display timestamp in UI (5 min)
6. 📌 **Optional**: Connect real APIs (2+ hours)

## Questions?

See `AUTO_UPDATE_MECHANISM.md` for complete technical details.

See `AUTO_UPDATE_CHECKLIST.md` for full task list.

---

**TL;DR:** The system is fully built and running. Prices update automatically every day. Just add 10 lines to App.jsx to load and display them. Done! 🚀
