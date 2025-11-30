# K6 Load Testing: Quick Setup & Usage Guide

**Date:** November 30, 2025  
**Status:** ✅ Ready to Use  
**Difficulty:** Beginner-friendly

---

## Quick Start (2 minutes)

### Option 1: Install K6 Locally (Recommended)

**macOS:**
```bash
brew install k6
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y k6
```

**Windows:**
```bash
choco install k6
# Or download from: https://k6.io/docs/getting-started/installation/
```

**Verify Installation:**
```bash
k6 version
# Should output: k6 vX.XX.X
```

### Option 2: Use Docker (No Installation)

```bash
docker run -i grafana/k6 run - < k6-load-test-simple.js
```

---

## Run Your First Load Test

### Against Production (Recommended after deploy)

```bash
k6 run k6-load-test-simple.js -e BASE_URL=https://aiburn.howstud.io
```

### Against Local Development

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run load test
k6 run k6-load-test-simple.js -e BASE_URL=http://localhost:5173
```

### Custom Parameters

```bash
# 100 virtual users for 2 minutes
k6 run k6-load-test-simple.js --vus 100 --duration 2m

# 200 users ramping up over time
k6 run k6-load-test-simple.js \
  --stage 30s:50 \      # Ramp to 50 users over 30s
  --stage 1m:200 \      # Ramp to 200 users over 1m
  --stage 30s:0         # Ramp down to 0

# With custom URL
k6 run k6-load-test-simple.js \
  -e BASE_URL=https://example.com \
  --vus 50 \
  --duration 1m
```

---

## Understanding the Results

### Example Output:

```
⏱️  Response Times:
   Average: 245ms
   Min:     150ms
   Max:     890ms
   P95:     450ms
   P99:     750ms

📊 Total Requests: 1,500
❌ Failed Requests: 0
🚨 Errors: 0
```

### What Each Metric Means:

| Metric | Target | Status | Meaning |
|--------|--------|--------|---------|
| **Average** | <300ms | ✅ Good | Most requests are fast |
| **P95** | <500ms | ✅ Good | 95% of requests under 500ms |
| **P99** | <1000ms | ✅ Good | 99% of requests under 1 second |
| **Failed** | 0 | ✅ Good | All requests succeeded |
| **Errors** | <5% | ✅ Good | Application stable under load |

### Red Flags:

```
⚠️  Average > 1000ms       → Site too slow
⚠️  P95 > 2000ms          → Inconsistent performance
❌ Failed Requests > 0    → Some endpoints broken
❌ Errors > 5%            → Application unstable
```

---

## Test Scenarios Included

The simple script tests 5 endpoints:

| # | Endpoint | Tests |
|---|----------|-------|
| 1 | GET `/` | Page loads, contains "AIBurn", <2s |
| 2 | GET `/privacy` | Returns 200, has privacy content |
| 3 | GET `/terms` | Returns 200, has terms content |
| 4 | POST `/api/usage` | API responds, <1s, valid response |
| 5 | GET `/advertise` | Returns 200, has content |

Each test includes 1 second of "think time" between requests (realistic user behavior).

---

## Load Test Scenarios

### Scenario 1: Baseline Performance Test

```bash
# Light load - understand basic performance
k6 run k6-load-test-simple.js --vus 10 --duration 30s
```

**When to use:** Before deploying, to establish baseline

**Expected:** Average <300ms, P95 <500ms

### Scenario 2: Normal Load Test

```bash
# Typical expected load
k6 run k6-load-test-simple.js --vus 50 --duration 1m
```

**When to use:** Post-deploy verification

**Expected:** Average <400ms, P95 <700ms

### Scenario 3: Peak Load Test

```bash
# High traffic simulation
k6 run k6-load-test-simple.js --vus 200 --duration 2m
```

**When to use:** Before major announcement or traffic spike

**Expected:** Average <500ms, P95 <1000ms

### Scenario 4: Stress Test

```bash
# Push to limits
k6 run k6-load-test-simple.js \
  --stage 30s:100 \
  --stage 1m:500 \
  --stage 30s:0
```

**When to use:** Identify breaking point

**Expected:** Find where performance degrades

---

## Docker Usage (No Installation)

### Run with Docker:

```bash
# Basic test
docker run -i grafana/k6 run - < k6-load-test-simple.js

# With custom URL
docker run -i grafana/k6 run -e BASE_URL=https://aiburn.howstud.io - < k6-load-test-simple.js

# With custom parameters
docker run -i grafana/k6 run \
  --vus 100 \
  --duration 2m \
  - < k6-load-test-simple.js
```

### Using Docker Compose:

Create `docker-compose.k6.yml`:
```yaml
version: '3'
services:
  k6:
    image: grafana/k6:latest
    volumes:
      - ./k6-load-test-simple.js:/scripts/k6-load-test-simple.js
    command: run /scripts/k6-load-test-simple.js
    environment:
      - BASE_URL=https://aiburn.howstud.io
```

Run:
```bash
docker-compose -f docker-compose.k6.yml run --rm k6
```

---

## Integration with CI/CD

### GitHub Actions Example:

Add to `.github/workflows/load-test.yml`:

```yaml
name: Load Test

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly at 2 AM Sunday
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run K6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: k6-load-test-simple.js
          cloud: true
        env:
          BASE_URL: https://aiburn.howstud.io
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
```

---

## Advanced Usage

### View Results in Grafana Cloud

```bash
# Requires K6 Cloud account (free tier available)
k6 run k6-load-test-simple.js --out cloud
```

### Export Results to JSON

```bash
k6 run k6-load-test-simple.js --out json > results.json
```

### Combine with Multiple Test Files

```bash
# Run multiple test files
k6 run k6-load-test-simple.js && k6 run other-test.js
```

---

## Troubleshooting

### "k6: command not found"

**Solution:** Install K6
```bash
brew install k6  # macOS
sudo apt-get install k6  # Linux
```

### "Connection refused" / "ECONNREFUSED"

**Solution:** Make sure the target URL is correct and online
```bash
# Test local dev server
npm run dev  # In another terminal

k6 run k6-load-test-simple.js -e BASE_URL=http://localhost:5173
```

### "Too many open files" error

**Solution:** Increase system limits
```bash
ulimit -n 10000  # Linux/macOS
```

### "Request timeout"

**Solution:** Increase timeout or reduce VUs
```bash
k6 run k6-load-test-simple.js --vus 20 --duration 30s
```

---

## Best Practices

✅ **DO:**
```
✅ Test against production after deploying
✅ Start with small loads (10-50 VUs)
✅ Gradually increase load
✅ Run during off-peak hours
✅ Monitor Sentry errors during tests
✅ Document baseline metrics
✅ Compare results over time
```

❌ **DON'T:**
```
❌ Run massive load tests without permission
❌ Test external services you don't own
❌ Run during peak traffic hours
❌ Ignore error spikes
❌ Set VUs too high immediately
```

---

## Performance Targets

### Baseline (Development)
```
Average:  <500ms
P95:      <1000ms
Errors:   <5%
```

### Production
```
Average:  <400ms
P95:      <700ms
P99:      <1500ms
Errors:   <1%
```

### Acceptable Range
```
Average:  <600ms (warning), >1000ms (critical)
P95:      <1500ms (warning), >3000ms (critical)
Errors:   >5% (warning), >10% (critical)
```

---

## Monitoring During Load Tests

### Open in Another Terminal:

```bash
# Terminal 1: Run load test
k6 run k6-load-test-simple.js

# Terminal 2: Watch Sentry for errors
open https://sentry.io

# Terminal 3: Check server metrics
open https://vercel.com/dashboard
```

### What to Watch:

- **Error rate spikes** in Sentry
- **Response time degradation**
- **Database/API bottlenecks**
- **Memory usage**
- **CPU usage**

---

## Real-World Example

```bash
# Complete load test workflow:

# 1. Start dev server
npm run dev &

# 2. Baseline test (10 users, 30s)
echo "Running baseline test..."
k6 run k6-load-test-simple.js --vus 10 --duration 30s -e BASE_URL=http://localhost:5173

# 3. Normal load test (50 users, 1m)
echo "Running normal load test..."
k6 run k6-load-test-simple.js --vus 50 --duration 1m -e BASE_URL=http://localhost:5173

# 4. Peak load test (200 users, 2m)
echo "Running peak load test..."
k6 run k6-load-test-simple.js --vus 200 --duration 2m -e BASE_URL=http://localhost:5173

# 5. Check Sentry for errors
echo "Done! Check Sentry for any errors during tests"
open https://sentry.io
```

---

## Support & Resources

**K6 Documentation:**
- https://k6.io/docs/

**K6 Community:**
- https://community.k6.io/

**Performance Best Practices:**
- Google Lighthouse: https://developers.google.com/web/tools/lighthouse
- WebPageTest: https://www.webpagetest.org/

**For Questions:**
- See `MEDIUM_PRIORITY_COMPLETE.md` (Item 8 - Load Testing)
- See `K6_LOAD_TESTING_SETUP.md` (this file)

---

## Quick Commands Cheat Sheet

```bash
# Install
brew install k6

# Run
k6 run k6-load-test-simple.js

# With custom URL
k6 run k6-load-test-simple.js -e BASE_URL=https://example.com

# Custom load
k6 run k6-load-test-simple.js --vus 100 --duration 2m

# With Docker
docker run -i grafana/k6 run - < k6-load-test-simple.js

# Export JSON
k6 run k6-load-test-simple.js --out json > results.json

# Cloud upload
k6 run k6-load-test-simple.js --out cloud
```

---

## Next Steps

1. **Install K6**
   ```bash
   brew install k6
   ```

2. **Run baseline test**
   ```bash
   k6 run k6-load-test-simple.js -e BASE_URL=http://localhost:5173
   ```

3. **Deploy to production**
   ```bash
   git push origin main
   ```

4. **Test production**
   ```bash
   k6 run k6-load-test-simple.js -e BASE_URL=https://aiburn.howstud.io
   ```

5. **Monitor results**
   - Check Sentry for errors
   - Review response time trends
   - Document baseline metrics

---

**Status:** ✅ Ready to use  
**Script:** k6-load-test-simple.js (production-ready)  
**Documentation:** Complete  
**Support:** See referenced docs
