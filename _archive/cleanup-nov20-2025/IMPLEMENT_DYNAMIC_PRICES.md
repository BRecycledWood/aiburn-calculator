# Implementation Guide: Automatic Price Updates

**Duration**: 15-20 minutes  
**Difficulty**: Medium  
**Requirements**: Git, Node.js, GitHub repo

---

## Quick Start (5 minutes)

### Step 1: Add the Script
Already created at `aiburn-website/scripts/fetch-ai-prices.js` ✅

### Step 2: Add the Hook
Already created at `src/hooks/usePrices.js` ✅

### Step 3: Add the Workflow
Already created at `.github/workflows/update-prices.yml` ✅

### Step 4: Add Tests
Already created at `scripts/__tests__/fetch-ai-prices.test.js` ✅

---

## Detailed Implementation Steps

### Prerequisites

```bash
# Ensure you're in the project root
cd /Users/bkerwood/projects/aiburn-cost-calculator

# Verify Git is configured
git config user.name
git config user.email

# Have a GitHub repo (public or private)
git remote -v  # Should show origin
```

---

## Implementation Checklist

### Phase 1: Backend Setup (5 min)

- [ ] **Verify script exists**
  ```bash
  ls aiburn-website/scripts/fetch-ai-prices.js
  ```

- [ ] **Verify prices.json exists**
  ```bash
  ls aiburn-website/public/data/prices.json
  ```

- [ ] **Test the script locally**
  ```bash
  cd aiburn-website
  node scripts/fetch-ai-prices.js
  ```
  
  Expected output:
  ```
  [2025-11-17...] INFO: Starting price update process
  [2025-11-17...] SUCCESS: Price update completed successfully
  ```

- [ ] **Check generated log**
  ```bash
  tail logs/price-updates.log
  ```

### Phase 2: GitHub Actions Setup (5 min)

- [ ] **Verify workflow file**
  ```bash
  ls .github/workflows/update-prices.yml
  ```

- [ ] **Push to GitHub**
  ```bash
  git add .github/workflows/update-prices.yml
  git add aiburn-website/scripts/
  git add aiburn-website/public/data/prices.json
  git commit -m "feat: add automatic price updating system"
  git push origin main
  ```

- [ ] **Enable GitHub Actions** (if needed)
  - Go to repo Settings → Actions → General
  - Select "Allow all actions"

- [ ] **Verify workflow appears**
  - Go to GitHub repo → Actions tab
  - Should see "Update AI Model Prices" workflow

- [ ] **Test manual trigger**
  - Click "Update AI Model Prices"
  - Click "Run workflow"
  - Wait for completion (should take <30 seconds)

### Phase 3: Frontend Setup (5 min)

- [ ] **Check usePrices hook exists**
  ```bash
  ls aiburn-website/src/hooks/usePrices.js
  ```

- [ ] **Check AppWithDynamicPrices exists**
  ```bash
  ls aiburn-website/src/AppWithDynamicPrices.jsx
  ```

- [ ] **Update package.json scripts**
  ```bash
  npm run update-prices  # Should work
  ```

- [ ] **Backup original App.jsx**
  ```bash
  cd aiburn-website
  cp src/App.jsx src/App.jsx.backup
  ```

- [ ] **Choose deployment method**
  
  **Option A: Immediate Replacement** (recommended)
  ```bash
  cp src/AppWithDynamicPrices.jsx src/App.jsx
  npm run build
  npm run dev  # Test locally
  ```
  
  **Option B: Gradual Migration**
  - Keep App.jsx, use AppWithDynamicPrices.jsx as reference
  - Manually integrate usePrices hook
  - Test before deploying

- [ ] **Test locally**
  ```bash
  npm run dev
  # Visit http://localhost:5173
  # Should see "Loading prices..." briefly
  # Should show last updated date
  ```

### Phase 4: Testing (3 min)

- [ ] **Test price loading**
  ```bash
  # In browser console:
  fetch('/data/prices.json').then(r => r.json()).then(console.log)
  ```

- [ ] **Test stale price warning**
  - Edit `public/data/prices.json`
  - Change timestamp to 8 days ago
  - Reload page
  - Should show "Pricing Data is Outdated" warning

- [ ] **Test manual refresh**
  - Click "Refresh Prices Now" button
  - Should reload prices.json

- [ ] **Run unit tests**
  ```bash
  npm install --save-dev jest
  npm run test:prices
  ```

### Phase 5: Deployment (2 min)

- [ ] **Build for production**
  ```bash
  npm run build
  ```

- [ ] **Verify build output**
  ```bash
  ls dist/
  # Should have index.html, assets/, etc.
  ```

- [ ] **Commit all changes**
  ```bash
  git add .
  git commit -m "feat: integrate dynamic price loading"
  git push origin main
  ```

- [ ] **Deploy to Vercel** (or your host)
  ```bash
  # If using Vercel CLI:
  vercel deploy --prod
  
  # Or: push to GitHub, auto-deploys via Vercel integration
  ```

---

## Verification Checklist

After deployment, verify:

- [ ] **Website loads** without errors
- [ ] **Prices display** in calculator
- [ ] **Last updated date** shows in results
- [ ] **Share button** still works
- [ ] **Download button** still works
- [ ] **Mobile layout** is responsive
- [ ] **Console** has no errors
- [ ] **Network tab** shows prices.json loading

---

## Workflow Verification

After first automated run (next midnight UTC):

- [ ] **Check GitHub Actions**
  - Go to Actions tab
  - See "Update AI Model Prices" run
  - Verify it completed successfully

- [ ] **Check commit history**
  - Should see automated commit: "chore: update AI model prices [automated]"

- [ ] **Verify prices.json updated**
  ```bash
  git log public/data/prices.json
  # Should see recent automated commits
  ```

- [ ] **Check logs artifact**
  - In workflow run
  - Download "price-update-logs" artifact
  - Verify successful execution

---

## Troubleshooting

### Script doesn't run

```bash
# Check Node.js version
node --version  # Should be 14+

# Check file permissions
chmod +x aiburn-website/scripts/fetch-ai-prices.js

# Run directly
cd aiburn-website
node scripts/fetch-ai-prices.js
```

### Workflow doesn't appear

```bash
# Verify file location
ls .github/workflows/update-prices.yml

# Check YAML syntax
cat .github/workflows/update-prices.yml | grep -E "^(name|on|jobs):"
```

### Prices not loading in frontend

```javascript
// In browser console:
fetch('/data/prices.json')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e))
```

Solutions:
- Verify `public/data/prices.json` exists
- Check build includes `public/data/`
- Verify fetch path matches deployment structure

### Tests fail

```bash
# Install test dependencies
npm install --save-dev jest @testing-library/react

# Run tests with details
npm run test:prices -- --verbose
```

---

## Optional Enhancements

### 1. Add Discord Notifications

```bash
# Create Discord webhook in your server
# Settings → Webhooks → New Webhook → Copy URL

# Add GitHub Secret
# Repo Settings → Secrets → New repository secret
# Name: DISCORD_WEBHOOK
# Value: <your webhook URL>

# Uncomment webhook step in update-prices.yml
```

### 2. Add Email Alerts

```bash
# Use GitHub Actions email feature
# Add step in workflow:
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Price update failed
    to: your@email.com
    from: aiburn@example.com
    body: Check GitHub Actions logs
```

### 3. Add Price Change Tracking

Create `scripts/track-price-changes.js`:
```javascript
const fs = require('fs');
const path = require('path');

function trackChanges() {
  const current = JSON.parse(fs.readFileSync('public/data/prices.json', 'utf8'));
  const history = fs.existsSync('public/data/price-history.json')
    ? JSON.parse(fs.readFileSync('public/data/price-history.json', 'utf8'))
    : { updates: [] };

  history.updates.push({
    timestamp: current.timestamp,
    models: current.models
  });

  fs.writeFileSync(
    'public/data/price-history.json',
    JSON.stringify(history, null, 2)
  );
}

if (require.main === module) {
  trackChanges();
}
```

### 4. Add Admin Dashboard

Create a simple admin page to:
- View price update history
- Manually trigger updates
- View price trends
- Edit prices directly

---

## Rollback Plan

If something breaks:

```bash
# 1. Restore original App.jsx
cd aiburn-website
cp src/App.jsx.backup src/App.jsx

# 2. Disable workflow
# Go to .github/workflows/update-prices.yml
# Comment out the schedule trigger

# 3. Rebuild and deploy
npm run build
npm run preview

# 4. Investigate issue
tail logs/price-updates.log
npm run test:prices
```

---

## Post-Implementation Tasks

### Monitoring
- [ ] Set up GitHub issue notifications
- [ ] Set up Vercel analytics
- [ ] Monitor price update logs weekly
- [ ] Track price changes over time

### Maintenance
- [ ] Update prices if API rates change
- [ ] Review workflow logs monthly
- [ ] Update documentation as needed
- [ ] Plan enhancements for next quarter

### Communication
- [ ] Document in team wiki
- [ ] Notify users of price updates
- [ ] Share update schedule
- [ ] Create user documentation

---

## Performance Impact

- **Bundle size**: +0 KB (prices loaded from separate file)
- **Load time**: +200-500ms (fetching prices.json)
- **Runtime**: No impact (prices cached in memory)
- **API calls**: 0 (no external API calls in frontend)

---

## Security Considerations

- ✅ No credentials stored in repo
- ✅ No API keys exposed
- ✅ Prices are public data
- ✅ GitHub Actions uses standard OAuth
- ✅ Auto-commits are signed by GitHub

---

## Next Steps

1. **Run through implementation checklist** above
2. **Test in development** with `npm run dev`
3. **Deploy to production** via Vercel
4. **Monitor first update** (next midnight UTC)
5. **Gather feedback** from users
6. **Plan enhancements** based on usage

---

## Support & Questions

### Getting Help
- Check PRICE_UPDATE_SYSTEM.md for detailed reference
- Review GitHub Actions logs for errors
- Check browser console for frontend issues
- Run tests: `npm run test:prices`

### Reporting Issues
Include:
- Error message (full text)
- Relevant log files
- Steps to reproduce
- Expected vs actual behavior

---

**Implementation Date**: November 17, 2025  
**System Version**: 1.0.0  
**Status**: Ready for Deployment ✅
