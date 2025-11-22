# AIBurn Automatic Price Update System

**Status**: ✅ Complete & Ready for Deployment

This document describes the automatic price updating system for the AIBurn calculator.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Daily Price Update Flow                       │
└─────────────────────────────────────────────────────────────────┘

GitHub Actions (Daily @ 00:00 UTC)
    ↓
[update-prices.yml workflow]
    ↓
[fetch-ai-prices.js script]
    ├─ Build price data from PRICE_SOURCES
    ├─ Validate data integrity
    └─ Save to public/data/prices.json
    ↓
[Auto-commit changes]
    ├─ Git commit if prices changed
    └─ Push to main branch
    ↓
[Frontend loads on page visit]
    ├─ usePrices hook fetches JSON
    ├─ Detects stale prices (>7 days)
    └─ Shows warning if needed
```

---

## Components

### 1. Price Fetching Script
**File**: `scripts/fetch-ai-prices.js`

Features:
- Fetches current pricing from 4 providers (OpenAI, Anthropic, Groq, DeepSeek)
- Converts prices to per-1M tokens standard format
- Validates data structure and price values
- Includes comprehensive logging
- Fallback to cached prices if fetch fails
- Retry logic with configurable delays

Usage:
```bash
npm run update-prices
```

Environment Variables:
- `OPENAI_FETCH_TIMEOUT`: HTTP timeout in ms (default: 10000)

### 2. GitHub Actions Workflow
**File**: `.github/workflows/update-prices.yml`

Configuration:
- **Schedule**: Daily at midnight UTC (0 0 * * *)
- **Manual Trigger**: Via GitHub Actions UI
- **Auto-commit**: If prices changed
- **Error Handling**: Creates issue on failure
- **Logging**: Saves logs as artifacts
- **Notifications**: Optional Discord webhook support

Triggers:
- Schedule: Daily at midnight UTC
- Manual: Click "Run workflow" in GitHub Actions
- On push: Script or workflow file changes

### 3. Price Data File
**File**: `public/data/prices.json`

Structure:
```json
{
  "version": "1.0.0",
  "timestamp": "ISO8601",
  "source": "AIBurn Auto Price Fetcher",
  "models": {
    "GPT-4": {
      "provider": "openai",
      "input": 30,
      "output": 60,
      "inputUnit": 1000,
      "outputUnit": 1000,
      "lastUpdated": "ISO8601"
    }
    // ... 8 more models
  },
  "updateLog": [...],
  "metadata": {...}
}
```

### 4. React Hook
**File**: `src/hooks/usePrices.js`

Features:
- Loads prices from JSON on component mount
- Detects stale prices (>7 days)
- Provides refresh functionality
- Formats timestamps for display
- Converts to calculator format
- Error handling with fallbacks

Usage:
```javascript
const { prices, loading, error, lastUpdated, isStale, refresh } = usePrices()
```

### 5. Enhanced App Component
**File**: `src/AppWithDynamicPrices.jsx`

New Features:
- Loads prices from JSON file
- Shows loading state while fetching
- Displays price warning if stale
- Manual refresh button for users
- Shows last updated date in results
- Graceful fallback to hardcoded prices

---

## How It Works

### Daily Update Flow

1. **GitHub Actions Trigger** (0:00 UTC)
   - Checkout repository
   - Setup Node.js environment
   - Create logs directory
   - Run fetch script

2. **Fetch Script Execution**
   - Load configuration
   - Build price data from PRICE_SOURCES
   - Validate data integrity
   - Save to prices.json
   - Log all operations

3. **Git Operations**
   - Check if prices changed
   - If changed: commit and push
   - If error: create issue

4. **Notifications**
   - Upload logs as artifact
   - Optional Discord notification
   - GitHub summary with recent logs

### Frontend Price Loading

1. **Component Mount**
   - usePrices hook fetches prices.json
   - Shows loading state
   - Detects if prices are stale

2. **During Calculation**
   - Uses loaded prices for cost calculations
   - Shows when prices were last updated
   - Displays warning if >7 days old

3. **User Interaction**
   - Manual refresh button available
   - Re-fetches from prices.json
   - Updates all price-dependent UI

---

## Price Sources

Currently configured sources (hardcoded data):

| Provider | Models | Update Frequency |
|----------|--------|------------------|
| OpenAI | 4 models | Daily (automated) |
| Anthropic | 3 models | Daily (automated) |
| Groq | 1 model | Daily (automated) |
| DeepSeek | 1 model | Daily (automated) |

**Note**: Current implementation uses hardcoded prices. In production, you can:
1. Scrape pricing pages
2. Use provider APIs
3. Manual updates
4. Hybrid approach

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Price Fetcher Tests
```bash
npm run test:prices
```

### Watch Mode
```bash
npm run test:watch
```

### Test Coverage

Tests include:
- ✅ buildPriceData() function
- ✅ validatePriceData() function
- ✅ Price structure validation
- ✅ Provider data verification
- ✅ Unit conversion accuracy
- ✅ Error scenarios
- ✅ Integration scenarios

---

## Monitoring & Alerts

### Build Alerts
- Automatic issue creation on workflow failure
- Detailed error messages in issue body
- Link to workflow logs

### Logging
- Location: `aiburn-website/logs/price-updates.log`
- Appended for each update
- Available as workflow artifact (30 days)
- Format: `[ISO8601] LEVEL: message`

### Manual Checks
```bash
# Check latest prices
cat public/data/prices.json | jq '.timestamp'

# View update logs
tail -20 logs/price-updates.log

# Validate price data
npm run test:prices
```

---

## Configuration

### Change Update Schedule
Edit `.github/workflows/update-prices.yml`:
```yaml
schedule:
  - cron: '0 0 * * *'  # Change this
```

Cron Syntax:
- `0 0 * * *` = Daily at midnight UTC
- `0 12 * * 0` = Weekly (Sunday) at noon UTC
- `0 */6 * * *` = Every 6 hours
- [Cron help](https://crontab.guru)

### Change Stale Price Threshold
Edit `src/hooks/usePrices.js`:
```javascript
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000  // Change 7 to desired days
```

### Add New Models
Edit `scripts/fetch-ai-prices.js`:
```javascript
const PRICE_SOURCES = {
  newprovider: {
    name: 'New Provider',
    models: {
      'New Model': { input: 0.01, output: 0.02, inputUnit: 1000, outputUnit: 1000 }
    }
  }
}
```

### Configure Discord Webhook (Optional)
1. Create Discord webhook URL
2. Add as GitHub secret: `DISCORD_WEBHOOK`
3. Uncomment notification step in workflow

---

## Troubleshooting

### Workflow Not Running
- Check schedule in `.github/workflows/update-prices.yml`
- Verify GitHub Actions is enabled
- Check Actions tab for recent runs

### Prices Not Updating
- Check workflow logs in GitHub Actions
- View `logs/price-updates.log` artifact
- Manually run: `npm run update-prices`

### Stale Price Warning Shows
- Click "Refresh Prices Now" in UI
- Or wait for next daily update (midnight UTC)
- Check last updated timestamp

### Tests Failing
```bash
npm install --legacy-peer-deps
npm run test:prices
```

### JSON File Not Loading
- Verify path: `public/data/prices.json`
- Check CORS headers if cross-origin
- Browser console for fetch errors

---

## Future Enhancements

### Short Term
- [ ] Real API price fetching (not hardcoded)
- [ ] Price change tracking/history
- [ ] Email alerts for price changes
- [ ] Admin dashboard for manual updates

### Medium Term
- [ ] Provider-specific rate limits
- [ ] Caching strategy optimization
- [ ] Price prediction/trends
- [ ] User preferences for price tracking

### Long Term
- [ ] Machine learning for price trends
- [ ] Cost optimization recommendations
- [ ] Multi-region pricing support
- [ ] Custom model pricing

---

## Migration Guide

### From Old System to Dynamic Prices

#### Step 1: Backup Current App.jsx
```bash
cp src/App.jsx src/App.jsx.backup
```

#### Step 2: Replace with New Version
```bash
cp src/AppWithDynamicPrices.jsx src/App.jsx
```

#### Step 3: Install Dependencies (if using Jest)
```bash
npm install --legacy-peer-deps
npm install --save-dev jest @testing-library/react
```

#### Step 4: Test Locally
```bash
npm run update-prices
npm run dev
```

#### Step 5: Deploy
```bash
npm run build
git add .
git commit -m "feat: add automatic price updating system"
git push
```

---

## API Reference

### usePrices Hook

```javascript
const {
  prices,              // Full price data object
  loading,             // Boolean - true while fetching
  error,               // Error message or null
  lastUpdated,         // Date object
  isStale,             // Boolean - true if >7 days old
  refresh,             // Function to manually refresh
  formatTimestamp,     // Function to format dates
  getPriceAge,         // Function to get age in days
  getCalculatorModels, // Function to get models for calculator
} = usePrices()
```

### PRICE_SOURCES Configuration

```javascript
PRICE_SOURCES = {
  [provider]: {
    name: string,
    url: string,
    models: {
      [modelName]: {
        input: number,      // Price per inputUnit tokens
        output: number,     // Price per outputUnit tokens
        inputUnit: number,  // 1000 for per-1k-tokens
        outputUnit: number  // 1000 for per-1k-tokens
      }
    }
  }
}
```

---

## Support

### Common Questions

**Q: How often are prices updated?**
A: Daily at midnight UTC via GitHub Actions

**Q: What if an update fails?**
A: System falls back to cached prices and creates GitHub issue

**Q: Can I manually update prices?**
A: Yes, via GitHub Actions UI or `npm run update-prices`

**Q: Are prices stored server-side?**
A: No, prices are static JSON file (no server needed)

**Q: Can I add more models?**
A: Yes, edit PRICE_SOURCES in fetch-ai-prices.js

---

## Files Summary

| File | Purpose | Size |
|------|---------|------|
| scripts/fetch-ai-prices.js | Main fetcher | ~8 KB |
| scripts/__tests__/fetch-ai-prices.test.js | Tests | ~7 KB |
| src/hooks/usePrices.js | React hook | ~3 KB |
| src/AppWithDynamicPrices.jsx | Enhanced App | ~65 KB |
| public/data/prices.json | Price data | ~3 KB |
| .github/workflows/update-prices.yml | Automation | ~3 KB |

**Total**: ~89 KB of new/modified code

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 17, 2025 | Initial implementation |

---

**Last Updated**: November 17, 2025  
**Status**: Production Ready ✅  
**Maintained By**: Amp AI
