# AIBurn Price Update Scripts

This directory contains the automated price fetching and updating system for AIBurn.

---

## Files

| File | Purpose |
|------|---------|
| `fetch-ai-prices.js` | Main price fetching script |
| `__tests__/fetch-ai-prices.test.js` | Unit and integration tests |

---

## Quick Start

### Manual Price Update

```bash
npm run update-prices
```

Output:
```
[2025-11-17T12:34:56.789Z] INFO: Starting price update process
[2025-11-17T12:34:56.890Z] INFO: Processing OpenAI prices
[2025-11-17T12:34:56.891Z] INFO: Updated GPT-4
...
[2025-11-17T12:34:56.950Z] SUCCESS: Price update completed successfully
```

### View Logs

```bash
# Latest 20 lines
tail -20 ../logs/price-updates.log

# All logs
cat ../logs/price-updates.log

# Follow logs in real-time
tail -f ../logs/price-updates.log
```

### Run Tests

```bash
# All tests
npm test

# Price fetcher tests only
npm run test:prices

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

---

## Script Details

### fetch-ai-prices.js

**Purpose**: Fetch and validate AI model pricing data

**What it does**:
1. Loads configured price sources
2. Builds price data with proper unit conversions
3. Validates all prices and structure
4. Saves to `public/data/prices.json`
5. Logs all operations

**Configuration**:
```javascript
const PRICE_SOURCES = {
  openai: {
    name: 'OpenAI',
    models: {
      'GPT-4': { input: 0.03, output: 0.06, ... }
    }
  },
  // ... more providers
}
```

**Unit Conversion**:
- Input: Per-1000-tokens from source
- Output: Per-1,000,000-tokens in file
- Formula: `(price * 1000000) / sourceUnit`

**Error Handling**:
- Validates price data structure
- Ensures all required models present
- Checks for negative or invalid prices
- Falls back to cached prices on error

**Logging**:
- File: `logs/price-updates.log`
- Format: `[ISO8601] LEVEL: message {data}`
- Levels: INFO, WARN, ERROR, SUCCESS

---

## Price Data Format

### Output: `public/data/prices.json`

```json
{
  "version": "1.0.0",
  "timestamp": "2025-11-17T00:00:00Z",
  "source": "AIBurn Auto Price Fetcher",
  "models": {
    "GPT-4": {
      "provider": "openai",
      "input": 30,           // Per 1M tokens
      "output": 60,          // Per 1M tokens
      "inputUnit": 1000,     // Original unit (per 1k tokens)
      "outputUnit": 1000,    // Original unit
      "lastUpdated": "2025-11-17T00:00:00Z"
    }
  },
  "updateLog": [
    {
      "model": "GPT-4",
      "provider": "openai",
      "status": "success"
    }
  ],
  "metadata": {
    "totalModels": 9,
    "providersUpdated": 4,
    "successCount": 9,
    "failureCount": 0
  }
}
```

---

## Current Price Sources

### OpenAI
- GPT-4: $0.03/$0.06 (input/output per 1k)
- GPT-4 Turbo: $0.01/$0.03
- GPT-4o: $0.0025/$0.01
- GPT-3.5 Turbo: $0.0005/$0.0015

### Anthropic
- Claude 3 Opus: $0.015/$0.075
- Claude 3.5 Sonnet: $0.003/$0.015
- Claude 3 Haiku: $0.00025/$0.00125

### Groq
- Llama 3.1 70B: $0.00005/$0.00008

### DeepSeek
- DeepSeek Chat: $0.00014/$0.00028

**Note**: Prices are hardcoded. For live updates, integrate with provider APIs.

---

## Adding New Models

### Step 1: Update PRICE_SOURCES

```javascript
const PRICE_SOURCES = {
  // ...existing...
  newprovider: {
    name: 'New Provider',
    url: 'https://example.com/pricing',
    models: {
      'New Model': {
        input: 0.01,      // Price per inputUnit
        output: 0.02,     // Price per outputUnit
        inputUnit: 1000,  // Per 1k tokens
        outputUnit: 1000, // Per 1k tokens
      }
    }
  }
}
```

### Step 2: Update Tests

Add test case in `__tests__/fetch-ai-prices.test.js`:

```javascript
it('should have New Provider models', () => {
  expect(PRICE_SOURCES.newprovider.models).toHaveProperty('New Model');
});
```

### Step 3: Test

```bash
npm run test:prices
```

### Step 4: Manual Update

```bash
npm run update-prices
```

### Step 5: Verify

```bash
cat ../public/data/prices.json | jq '.models["New Model"]'
```

---

## Updating Prices

### When Provider Changes Prices

1. **Update PRICE_SOURCES** in `fetch-ai-prices.js`
2. **Update required models list** (if model removed)
3. **Run tests**: `npm run test:prices`
4. **Commit**: `git commit -m "chore: update model prices"`
5. **Automatic deployment** (next midnight UTC)

Or trigger manually:

```bash
npm run update-prices
git add ../public/data/prices.json
git commit -m "chore: manual price update"
git push
```

---

## Troubleshooting

### Script doesn't run

```bash
# Check Node.js
node --version  # Should be 14+

# Check file permissions
chmod +x fetch-ai-prices.js

# Run with debug output
node fetch-ai-prices.js 2>&1
```

### Tests fail

```bash
# Install dependencies
npm install --legacy-peer-deps
npm install --save-dev jest

# Run with verbose output
npm run test:prices -- --verbose

# Run single test file
npm test -- __tests__/fetch-ai-prices.test.js
```

### Invalid JSON output

```bash
# Validate JSON
node -c ../public/data/prices.json

# Pretty print
cat ../public/data/prices.json | jq '.'

# Check for syntax errors
npm run test:prices
```

### Prices not loading in frontend

Check logs:
```bash
tail ../logs/price-updates.log
```

Verify file:
```bash
ls -la ../public/data/prices.json
cat ../public/data/prices.json | head -20
```

---

## Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_FETCH_TIMEOUT` | 10000 | HTTP timeout (ms) |

```bash
# Example
OPENAI_FETCH_TIMEOUT=15000 npm run update-prices
```

### Logging Configuration

Edit in `fetch-ai-prices.js`:

```javascript
const CONFIG = {
  timeout: parseInt(process.env.OPENAI_FETCH_TIMEOUT || 10000),
  maxRetries: 3,           // Change retry count
  retryDelay: 2000,        // Change delay (ms)
  dataDir: '...',          // Change output directory
  logFile: '...',          // Change log file location
}
```

---

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Fetch script | ~200ms | Hardcoded data |
| Validation | ~50ms | JSON validation |
| Save to file | ~100ms | Disk I/O |
| **Total** | **~350ms** | Very fast |

With network fetching (future):
- OpenAI API: ~500-1000ms
- Anthropic API: ~500-1000ms
- Groq API: ~200-500ms
- DeepSeek API: ~200-500ms
- **Total with retries**: ~2-5s

---

## Testing

### Test Coverage

```
fetch-ai-prices.test.js
├── buildPriceData
│   ├── should build price data with all required models
│   ├── should include metadata for all models
│   └── should have valid timestamp
├── validatePriceData
│   ├── should validate correct price data
│   ├── should reject data with missing models
│   ├── should reject data with negative prices
│   ├── should reject data with invalid price types
│   └── should require all 9 models
├── Price structure
│   ├── should have correct price structure per model
│   ├── should group models by provider
│   └── should have output price >= input price
├── Provider data
│   ├── should have OpenAI models
│   ├── should have Anthropic models
│   ├── should have Groq models
│   └── should have DeepSeek models
├── Price consistency
│   ├── should have consistent unit conversions
│   └── should convert to per-1M token format
├── Update log
│   ├── should have valid update log
│   └── should have status for each update
├── Error scenarios
│   ├── should handle missing price data gracefully
│   ├── should handle empty models object
│   └── should handle corrupted price values
└── Integration scenarios
    ├── should be able to build and validate data in sequence
    └── should produce consistent data across multiple runs
```

Run all tests:
```bash
npm test
```

---

## GitHub Actions Integration

The script runs automatically via `.github/workflows/update-prices.yml`:

- **Schedule**: Daily at 0:00 UTC
- **Manual trigger**: Via GitHub Actions UI
- **On change**: Script or workflow file changes

Logs:
- Available as workflow artifact (30 days)
- Can be downloaded from Actions page
- Last 20 lines shown in summary

---

## Monitoring

### Check Latest Update

```bash
# View timestamp
cat ../public/data/prices.json | jq '.timestamp'

# View metadata
cat ../public/data/prices.json | jq '.metadata'

# View single model
cat ../public/data/prices.json | jq '.models["GPT-4"]'
```

### Check for Errors

```bash
# View error logs
grep ERROR ../logs/price-updates.log

# Count successful updates
grep -c SUCCESS ../logs/price-updates.log

# Last 5 updates
tail -5 ../logs/price-updates.log
```

---

## Maintenance

### Weekly Tasks
- [ ] Check price update logs
- [ ] Verify workflow ran successfully
- [ ] Monitor for API changes

### Monthly Tasks
- [ ] Review test coverage
- [ ] Update documentation
- [ ] Archive old logs

### Quarterly Tasks
- [ ] Review pricing accuracy
- [ ] Plan new features
- [ ] Audit error handling

---

## Future Enhancements

- [ ] Live API price fetching
- [ ] Price change tracking/history
- [ ] Predictive pricing
- [ ] User alerts for price changes
- [ ] Admin dashboard
- [ ] Multi-region pricing

---

## Support

For issues or questions:

1. Check `fetch-ai-prices.log` for errors
2. Run tests: `npm run test:prices`
3. Review `PRICE_UPDATE_SYSTEM.md` for details
4. Check GitHub Actions logs
5. See `IMPLEMENT_DYNAMIC_PRICES.md` for setup help

---

**Last Updated**: November 17, 2025  
**System Version**: 1.0.0  
**Status**: Production Ready ✅
