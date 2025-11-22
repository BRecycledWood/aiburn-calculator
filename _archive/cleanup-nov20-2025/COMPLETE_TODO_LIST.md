# AIBurn: Complete To-Do List (All Phases)

**Last Updated:** November 17, 2025  
**Total Items:** 45 tasks  
**Completed:** 20 tasks (44%)  
**Remaining:** 25 tasks (56%)  

---

## 📊 Task Summary by Phase

| Phase | Total | Done | Remaining | Time |
|-------|-------|------|-----------|------|
| 1. Frontend Integration | 4 | 0 | 4 | 40 min |
| 2. Testing | 4 | 1 | 3 | 80 min |
| 3. Monitoring | 3 | 0 | 3 | 50 min |
| 4. Accessibility | 3 | 0 | 3 | 60 min |
| 5. SEO & Legal | 4 | 0 | 4 | 75 min |
| 6. Analytics & Monitoring | 3 | 0 | 3 | 120 min |
| 7. Deployment | 4 | 0 | 4 | 55 min |
| **TOTALS** | **25** | **1** | **24** | **480 min (8 hrs)** |

---

## PHASE 1: Frontend Integration (3.x items)

Goal: Load dynamic prices and display timestamp

### 3.1 Load prices from JSON file on page load ⏱️ 10 min
- [ ] Create `usePrices()` hook in `src/hooks/usePrices.js`
  - Fetch from `public/data/prices.json`
  - Parse JSON response
  - Handle fetch errors gracefully
  - Fallback to hardcoded prices if fetch fails
  - Return prices and loading state

- [ ] Modify `src/App.jsx` to use hook
  - Call `usePrices()` in useEffect on mount
  - Update MODELS state from fetched prices
  - Handle loading state
  - Log errors to console (not user-facing)

- [ ] Test in development
  - Verify prices load on page load
  - Check Network tab in DevTools
  - Verify fallback works if file doesn't exist
  - Check console for errors

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Prices load from JSON on mount ✓
- Fallback works if JSON missing ✓
- No console errors ✓
- Bundle size unchanged ✓

---

### 3.2 Display 'last updated' timestamp ⏱️ 10 min
- [ ] Extract timestamp from prices.json
  - JSON format: `{ "timestamp": "2025-11-17T00:00:00Z", "models": {...} }`
  - Parse ISO string to Date object
  - Handle missing timestamp gracefully

- [ ] Format timestamp for display
  - Convert to local time (user's timezone)
  - Format as "Nov 17, 2025 at 12:34 AM UTC"
  - Create helper function: `formatPriceUpdateTime()`

- [ ] Display in UI
  - Show in results header: "Prices updated: Nov 17, 2025 at 12:34 AM"
  - Show in Quick Calculator mode below current cost
  - Show in Exact Usage mode below current cost

- [ ] Add to both calculator modes
  - Quick mode: Show timestamp for all models
  - Exact mode: Show timestamp for actual usage comparison

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Timestamp displays correctly ✓
- Timezone handled properly ✓
- Readable format ✓
- Works in both calculator modes ✓

---

### 3.3 Show warning if prices are > 7 days old ⏱️ 10 min
- [ ] Calculate age of prices
  - Compare current time to timestamp
  - Calculate days difference: `(now - timestamp) / (24 * 60 * 60 * 1000)`
  - Determine if > 7 days

- [ ] Create warning component
  - Display only if age > 7 days
  - Background color: amber/yellow (`bg-amber-100`)
  - Text color: dark amber (`text-amber-900`)
  - Icon: alert or warning symbol
  - Message: "Prices haven't been updated in {X} days. Check back soon."

- [ ] Position warning
  - Display at top of calculator form
  - Or above results section
  - Dismissible by user (optional)

- [ ] Add logic
  - Create helper: `isPricesOutdated(timestamp)` → boolean
  - Create helper: `daysOld(timestamp)` → number
  - Add to results display

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Warning shows only when >7 days old ✓
- Shows exact age ✓
- Styled appropriately ✓
- Dismissible (optional) ✓

---

### 3.4 Add manual refresh button for users ⏱️ 10 min
- [ ] Create refresh function
  - Fetch prices.json again
  - Validate response
  - Update MODELS state
  - Update loading state during fetch
  - Show success/error message

- [ ] Add button to UI
  - Location: Next to timestamp in header or results
  - Text: "Refresh Prices" or "Reload Latest"
  - Icon: refresh icon (from lucide-react)
  - Disabled during fetch to prevent double-clicks
  - Disabled if button was clicked <2s ago

- [ ] Implement debouncing
  - Prevent multiple clicks within 2 seconds
  - Show loading spinner during fetch
  - Show success toast: "Prices refreshed!"
  - Show error message if refresh fails

- [ ] Add error handling
  - If refresh fails, show error message
  - Keep old prices visible
  - Offer retry button
  - Log error to console

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Button visible and clickable ✓
- Loading state shows during fetch ✓
- Success message shows on completion ✓
- Error message shows on failure ✓
- Prevents double-clicks ✓

**Code Template:**
```jsx
const [isRefreshing, setIsRefreshing] = useState(false)
const [lastRefresh, setLastRefresh] = useState(null)

const handleRefresh = async () => {
  const now = Date.now()
  if (isRefreshing || (lastRefresh && now - lastRefresh < 2000)) return

  setIsRefreshing(true)
  try {
    const response = await fetch('/data/prices.json')
    const data = await response.json()
    // Update MODELS from data
    setLastRefresh(now)
    // Show success message
  } catch (err) {
    // Show error message
  } finally {
    setIsRefreshing(false)
  }
}
```

---

## PHASE 2: Testing (4.x items)

Goal: Comprehensive test coverage for price system

### 4.1 Create tests for price fetching script ⏱️ 20 min
**Location:** `scripts/__tests__/fetch-ai-prices.test.js`

- [ ] Test successful price fetch
  - Mock https.get() to return valid pricing data
  - Verify data structure matches expected format
  - Check file is written to correct location
  - Verify timestamp is added

- [ ] Test JSON parsing
  - Parse various valid JSON formats
  - Verify all 9 models are present
  - Check pricing structure (input/output)
  - Verify units are correct (per 1M tokens)

- [ ] Test data validation
  - Verify all required fields present
  - Check price values are positive
  - Verify no missing models
  - Check timestamp format is valid ISO

- [ ] Test file operations
  - Verify file created in public/data/
  - Check file permissions
  - Verify backup created before write
  - Check error if directory doesn't exist

**Status:** ⏳ TODO (Partially done - 25+ tests exist)  
**Acceptance Criteria:**
- All tests pass ✓
- 100% code coverage of fetch script ✓
- Error cases covered ✓
- File operations tested ✓

---

### 4.2 Test error scenarios ⏱️ 30 min
**Location:** `scripts/__tests__/fetch-ai-prices.test.js`

- [ ] Test API down scenario
  - Mock network error (connection refused)
  - Verify error is logged
  - Check retry logic works (3 attempts)
  - Verify graceful degradation

- [ ] Test invalid JSON response
  - Mock malformed JSON from API
  - Verify error is caught
  - Check JSON parsing error handling
  - Verify fallback to previous prices

- [ ] Test timeout scenario
  - Mock timeout after 10s
  - Verify timeout is detected
  - Check retry logic
  - Verify error message

- [ ] Test network errors
  - Simulate DNS failure
  - Simulate SSL error
  - Simulate 500 error from API
  - Verify all handled gracefully

- [ ] Test file system errors
  - Mock write permission denied
  - Mock disk full error
  - Mock directory not found
  - Verify error logging

- [ ] Test malformed price data
  - Missing required fields (input/output)
  - Negative prices
  - Zero prices
  - Non-numeric prices
  - Verify validation catches all

**Status:** ⏳ TODO (Partially done)  
**Acceptance Criteria:**
- All error scenarios handled ✓
- Graceful degradation works ✓
- Error messages helpful ✓
- Tests cover 95% of error paths ✓

---

### 4.3 Verify workflow configuration ⏱️ 10 min
**Location:** `.github/workflows/update-prices.yml`

- [ ] Check schedule configuration
  - Verify cron: `0 0 * * *` (daily at UTC midnight)
  - Verify schedule is enabled (not commented out)
  - Test manual trigger capability

- [ ] Check job configuration
  - Verify Node version: 18 or 20
  - Check npm cache enabled
  - Verify working directory correct
  - Check environment variables set

- [ ] Check execution steps
  - Verify npm install runs
  - Verify npm run update-prices runs
  - Verify git commit runs
  - Verify git push runs

- [ ] Check logs and monitoring
  - Verify workflow has notification on failure
  - Check recent workflow runs
  - Verify no errors in logs
  - Check commit history for auto-commits

- [ ] Test manual trigger
  - Manually trigger workflow from GitHub Actions UI
  - Wait for completion
  - Verify prices were updated
  - Check git commit was created

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Schedule runs daily ✓
- Manual trigger works ✓
- No errors in logs ✓
- Commits being created ✓
- Prices file updated ✓

**How to Verify:**
```bash
# Check recent GitHub Actions runs
gh run list --workflow=update-prices.yml --limit=10

# Manually trigger workflow
gh workflow run update-prices.yml

# Check logs
gh run view <run-id> --log
```

---

### 4.4 Test frontend price loading ⏱️ 30 min
**Location:** `src/__tests__/priceIntegration.test.js` (new or expanded)

- [ ] Test App.jsx loads prices on mount
  - Mock fetch('/data/prices.json')
  - Render App component
  - Wait for useEffect to complete
  - Verify MODELS state updated
  - Check prices match fetched data

- [ ] Test fallback to hardcoded prices
  - Mock fetch() to fail/timeout
  - Render App component
  - Verify fallback MODELS used
  - Check hardcoded prices loaded
  - Verify app still functional

- [ ] Test error handling if fetch fails
  - Mock fetch() with 404 error
  - Render App component
  - Verify error state handled
  - Check error message displayed
  - Verify app doesn't crash

- [ ] Test JSON parsing in browser
  - Mock valid and invalid JSON responses
  - Verify parsing works
  - Check error handling for invalid JSON
  - Verify data structure validated

- [ ] Test timestamp display
  - Verify timestamp extracted from JSON
  - Check formatting is correct
  - Test various timestamp formats
  - Verify displayed in UI

- [ ] Test age warning calculation
  - Mock timestamp 5 days old → no warning
  - Mock timestamp 8 days old → show warning
  - Verify days calculation correct
  - Check warning message shows

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- All tests pass ✓
- Prices loaded from JSON ✓
- Fallback works ✓
- Errors handled gracefully ✓
- Timestamp displays ✓
- Age warning works ✓

---

## PHASE 3: Monitoring (5.x items)

Goal: Track price updates and alert on failures

### 5.1 Add logging for price updates ⏱️ 20 min
**Location:** `scripts/fetch-ai-prices.js` (enhance existing)

- [ ] Log fetch start
  - Timestamp when fetch begins
  - Provider being fetched from
  - URL being called
  - Format: `[2025-11-17T00:00:00Z] INFO: Fetching prices from OpenAI`

- [ ] Log fetch success
  - Timestamp of completion
  - Count of models updated (9)
  - Data size
  - Format: `[2025-11-17T00:00:05Z] INFO: Successfully fetched 9 models`

- [ ] Log fetch errors
  - Timestamp of error
  - Error type (TIMEOUT, INVALID_JSON, etc.)
  - Error message
  - Retry attempt number
  - Format: `[2025-11-17T00:00:10Z] ERROR: Timeout after 10s (retry 1/3)`

- [ ] Log data validation
  - Pass/fail status
  - Validation errors (if any)
  - Models validated
  - Format: `[2025-11-17T00:00:15Z] INFO: Validation passed for 9 models`

- [ ] Log file writes
  - File path written to
  - File size
  - Timestamp of write
  - Success/failure status
  - Format: `[2025-11-17T00:00:20Z] INFO: Wrote 2345 bytes to public/data/prices.json`

- [ ] Verify log file
  - Location: `logs/price-updates.log`
  - Verify logs are appended (not overwritten)
  - Check log rotation (optional)
  - Verify old logs retained (90 days minimum)

**Status:** ⏳ TODO (Partially done - logging exists)  
**Acceptance Criteria:**
- All events logged ✓
- Log file created ✓
- Logs include timestamp ✓
- Logs are readable ✓

**Example Log Output:**
```
[2025-11-17T00:00:00Z] INFO: Starting price update
[2025-11-17T00:00:02Z] INFO: Fetching from OpenAI
[2025-11-17T00:00:05Z] INFO: Fetched 4 models successfully
[2025-11-17T00:00:05Z] INFO: Fetching from Anthropic
[2025-11-17T00:00:07Z] INFO: Fetched 3 models successfully
[2025-11-17T00:00:07Z] INFO: Fetching from Groq
[2025-11-17T00:00:08Z] INFO: Fetched 1 models successfully
[2025-11-17T00:00:08Z] INFO: Fetching from DeepSeek
[2025-11-17T00:00:10Z] INFO: Fetched 1 models successfully
[2025-11-17T00:00:10Z] INFO: Validating prices...
[2025-11-17T00:00:11Z] INFO: Validation passed
[2025-11-17T00:00:11Z] INFO: Writing to prices.json
[2025-11-17T00:00:12Z] INFO: Successfully wrote 3421 bytes
[2025-11-17T00:00:12Z] INFO: Committing to git
[2025-11-17T00:00:13Z] INFO: Git commit successful
[2025-11-17T00:00:13Z] INFO: Price update complete
```

---

### 5.2 Create alerts for failed updates ⏱️ 30 min
**Location:** `.github/workflows/update-prices.yml` + optional notification service

- [ ] Send email alert on failed update
  - Setup email service (SendGrid, AWS SES, etc.)
  - Create email template
  - Trigger on workflow failure
  - Include error details in email
  - Send to: ops@howstud.io

- [ ] Send Slack notification on failure
  - Setup Slack webhook
  - Post message to #alerts channel
  - Include workflow run link
  - Include error details
  - Mention @channel for critical failures

- [ ] Log to error monitoring (Sentry)
  - Setup Sentry account
  - Capture error events
  - Track error frequency
  - Get notified on new errors
  - Provide error URL in logs

- [ ] Track failure rate
  - Log success/failure outcome
  - Calculate failure rate (rolling 7-day)
  - Alert if failure rate > 20%
  - Create dashboard for monitoring

- [ ] Auto-retry failed updates
  - Implement exponential backoff
  - Retry up to 3 times with delays (2s, 4s, 8s)
  - Only escalate alert after all retries fail
  - Log each retry attempt

- [ ] Alert after 3 failed attempts
  - After 3 retries fail, send alert
  - Include all error details
  - Provide remediation steps
  - Link to logs for debugging

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Alerts sent on failure ✓
- Email and Slack working ✓
- Retries implemented ✓
- Failure tracking works ✓
- Dashboard available ✓

---

### 5.3 Track price changes over time (optional) ⏱️ 60 min
**Priority:** Low (optional, can wait)

- [ ] Store price history
  - Create `public/data/price-history.json`
  - Store daily snapshots of prices
  - Keep 365 days of history
  - Format: `{ "2025-11-17": {...prices}, "2025-11-16": {...prices} }`

- [ ] Calculate price deltas
  - Compare current vs previous day
  - Calculate dollar change per model
  - Calculate percentage change
  - Identify trend (up/down/stable)

- [ ] Visualize price trends (optional)
  - Add Chart.js or similar library
  - Create trend page at `/trends`
  - Show price changes over last 30 days
  - Show price changes over last year
  - Filter by provider or model

- [ ] Detect anomalies
  - Alert if price changes > 10% in single day
  - Alert if new model appears
  - Alert if model disappears
  - Log anomaly to error tracking

- [ ] Alert on significant changes
  - Email alert on >10% change
  - Slack notification on >20% change
  - Include change details
  - Provide context (% change, dollar change)

**Status:** ⏳ TODO (Low Priority)  
**Acceptance Criteria:**
- History stored ✓
- Trends calculated ✓
- Anomalies detected ✓
- Alerts sent ✓

---

## PHASE 4: Accessibility Fixes (From Audit)

### 4A.1 Add focus indicators ⏱️ 5 min
**Location:** `src/index.css`

- [ ] Add focus-visible outline
  - Edit `src/index.css`
  - Add CSS for input, button, select elements
  - Outline: 2px solid #3b82f6
  - Outline-offset: 2px

- [ ] Test with keyboard navigation
  - Press Tab key to navigate
  - Verify outline shows on each focused element
  - Check outline color contrast (should be blue)
  - Verify outline doesn't overlap content

- [ ] Test on different browsers
  - Chrome: Should work ✓
  - Firefox: Should work ✓
  - Safari: Should work ✓
  - Edge: Should work ✓

**Code to Add:**
```css
input:focus-visible,
button:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Additional for better visibility */
input:focus-visible,
textarea:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Focus indicators visible ✓
- Works on Tab navigation ✓
- No console errors ✓

---

### 4A.2 Add ARIA labels ⏱️ 10 min
**Location:** `src/App.jsx`

- [ ] Add aria-label to API key input
  - Find API key input in "Exact Usage" mode
  - Add: `aria-label="OpenAI API key (starts with sk-). Keep this private."`
  - Test with screen reader

- [ ] Add role="alert" to results div
  - Find results section div
  - Add: `role="alert"`
  - Add: `aria-live="polite"`
  - Announce updates to screen reader

- [ ] Add aria-labels to buttons
  - Share button: `aria-label="Share results on X (Twitter)"`
  - Download button: `aria-label="Download results as PNG image"`
  - Refresh button: `aria-label="Refresh prices from server"`

- [ ] Add aria-labels to form elements
  - Model select: `aria-label="Select AI model to compare"`
  - Token slider: `aria-label="Enter monthly token usage (1M to 200M)"`
  - Provider select: `aria-label="Select API provider"`

- [ ] Test with screen reader
  - Download NVDA (free, Windows)
  - Test input labels read correctly
  - Test results announce on update
  - Test button purposes clear

**Code Examples:**
```jsx
// API key input
<input
  type="password"
  aria-label="OpenAI API key (starts with sk-). Keep this private."
  placeholder="sk-..."
/>

// Results section
<div role="alert" aria-live="polite" className="...">
  {/* results content */}
</div>

// Share button
<button aria-label="Share results on X (Twitter)" onClick={shareOnTwitter}>
  <Share2 size={20} />
</button>
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- All aria-labels added ✓
- Screen reader announces correctly ✓
- No console errors ✓

---

### 4A.3 Screen reader testing ⏱️ 45 min
**Tools:** NVDA (Windows), JAWS (Windows), VoiceOver (Mac)

- [ ] Download and install NVDA (free)
  - Download from: https://www.nvaccess.org/
  - Run installer
  - Launch NVDA

- [ ] Test with NVDA on Windows
  - Tab through all form fields
  - Verify inputs are labeled correctly
  - Verify button purposes clear
  - Test calculator functionality via keyboard
  - Check results are announced

- [ ] Test with JAWS (if available)
  - Verify same as NVDA
  - Check for any JAWS-specific issues
  - Verify cursor routing works

- [ ] Test with VoiceOver on Mac
  - Enable VoiceOver: Cmd+F5
  - Tab through form
  - Verify labels and purposes
  - Test full calculator flow

- [ ] Document issues found
  - Note any mislabeled elements
  - Note any unannounced content
  - Note any keyboard navigation issues
  - Create tickets for fixes

- [ ] Fix announced content issues
  - Adjust aria-labels if needed
  - Add missing labels
  - Fix role attributes
  - Retest after fixes

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- All form fields announced ✓
- Results announce on update ✓
- All buttons have purposes ✓
- Keyboard navigation works ✓
- No console warnings ✓

---

## PHASE 5: SEO & Legal

### 5A.1 Add JSON-LD schema ⏱️ 10 min
**Location:** `index.html` (head section)

- [ ] Create Schema.org JSON-LD data
  - Type: SoftwareApplication
  - Include name, description, URL
  - Include image and applicationCategory
  - Include author organization
  - Include offers (free)

- [ ] Add to index.html head
  - Insert before closing </head> tag
  - Validate JSON syntax
  - Test with Google Rich Results Tool

- [ ] Validate markup
  - Use Google Rich Results: https://search.google.com/test/rich-results
  - Verify no errors or warnings
  - Check preview looks correct
  - Submit to Google Search Console

- [ ] Monitor in Search Console
  - Check rich results appear in search
  - Track impressions and clicks
  - Monitor for errors

**Code to Add:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AIBurn",
  "description": "Compare AI model pricing and estimate savings by switching between OpenAI, Anthropic, Groq, and DeepSeek models.",
  "url": "https://aiburn.howstud.io",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "image": "https://aiburn.howstud.io/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "HowStudio"
  }
}
</script>
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- JSON-LD added to head ✓
- Validates with Google tool ✓
- No errors in rich results ✓

---

### 5A.2 Add OG meta tags with images ⏱️ 15 min
**Location:** `index.html` (head section)

- [ ] Create og-image.png (1200×630px)
  - Design with AIBurn branding
  - Include app name and tagline
  - Use gradient background (purple to blue)
  - Include screenshot or icon
  - Export as PNG to `public/og-image.png`

- [ ] Add OG meta tags to index.html
  - og:type: website
  - og:title: "AI Token Cost Calculator - AIBurn"
  - og:description: "Compare AI model pricing..."
  - og:image: URL to og-image.png
  - og:url: https://aiburn.howstud.io

- [ ] Add Twitter meta tags
  - twitter:card: summary_large_image
  - twitter:title: "AI Token Cost Calculator - AIBurn"
  - twitter:description: "Compare AI model pricing..."
  - twitter:image: URL to og-image.png
  - twitter:creator: @howstudio

- [ ] Test social previews
  - Use Facebook URL debugger
  - Use Twitter card validator
  - Check preview looks correct
  - Verify image displays

**Code to Add:**
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="AI Token Cost Calculator - AIBurn" />
<meta property="og:description" content="Compare AI model pricing and estimate savings by switching between OpenAI, Anthropic, Groq, and DeepSeek models." />
<meta property="og:image" content="https://aiburn.howstud.io/og-image.png" />
<meta property="og:url" content="https://aiburn.howstud.io" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AI Token Cost Calculator - AIBurn" />
<meta name="twitter:description" content="Compare AI model pricing and estimate savings..." />
<meta name="twitter:image" content="https://aiburn.howstud.io/og-image.png" />
<meta name="twitter:creator" content="@howstudio" />
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- og-image.png created ✓
- Meta tags added ✓
- Social previews tested ✓
- Images display correctly ✓

---

### 5A.3 Create Privacy Policy ⏱️ 30 min
**Location:** `public/pages/privacy.html` or `/privacy` route

- [ ] Document data handling
  - State: "We collect NO personal data"
  - Explain API key usage (only for comparison)
  - Explain data is not stored
  - Explain read-only API access
  - Explain token calculations are local

- [ ] Add GDPR compliance
  - Right to know what data is collected (none)
  - Right to deletion (nothing to delete)
  - Right to portability (not applicable)
  - Data retention policy (0 days - not stored)

- [ ] Add CCPA compliance
  - California residents have right to know (nothing collected)
  - Right to delete (not applicable)
  - Right to opt-out (not applicable)

- [ ] Add cookie policy
  - State: "We use NO cookies for tracking"
  - Explain any cookies used (if any)
  - Explain localStorage usage (none)
  - Explain session storage (none)

- [ ] Add contact information
  - Email for privacy questions: privacy@howstud.io
  - Response time: 30 days
  - Data protection officer (if applicable)

- [ ] Create route and link
  - Add `/privacy` route or page
  - Add footer link to privacy page
  - Make easily accessible
  - Include version/last updated date

**Template Sections:**
```
1. Information We Collect
   - We do not collect any personal information
   - We do not use cookies for tracking
   - We do not store API keys or calculations

2. How We Use Your Information
   - Your API key is never stored
   - Calculations are performed locally in your browser
   - No data is sent to our servers (except API key for validation)

3. Data Retention
   - We do not retain any user data
   - API requests are not logged
   - Calculations are not stored

4. Your Rights
   - GDPR: Right to access (nothing to access)
   - GDPR: Right to deletion (nothing to delete)
   - CCPA: Right to know (nothing collected)

5. Contact Us
   - For questions about this policy
   - Email: privacy@howstud.io
   - Response time: 30 days
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Privacy policy written ✓
- Covers all data handling ✓
- GDPR/CCPA compliant ✓
- Link in footer ✓

---

### 5A.4 Create Terms of Service ⏱️ 30 min
**Location:** `public/pages/terms.html` or `/terms` route

- [ ] Define usage terms
  - Calculator is for informational purposes only
  - Prices may not be current or accurate
  - Not a guarantee of actual savings
  - Use at own risk

- [ ] Add liability disclaimers
  - "This tool is provided AS-IS"
  - "No warranty of accuracy or completeness"
  - "Not responsible for decisions made based on calculator"
  - "Not responsible for third-party API changes"

- [ ] Explain API key responsibility
  - User is responsible for API key security
  - User must not share API key
  - We do not store or log API keys
  - If key is compromised, regenerate in provider dashboard

- [ ] Add usage restrictions
  - No automated scraping or abuse
  - No commercial use without permission
  - No reverse engineering
  - No redistribution

- [ ] Add disclaimers about third-party APIs
  - We are not affiliated with OpenAI, Anthropic, etc.
  - Prices subject to change by providers
  - We not responsible for provider API changes
  - Use provider APIs at your own risk

- [ ] Create route and link
  - Add `/terms` route or page
  - Add footer link to terms page
  - Make easily accessible
  - Include version/last updated date

**Template Sections:**
```
1. Use of Calculator
   - For informational purposes only
   - Not financial advice
   - Use at your own risk

2. Accuracy Disclaimer
   - Prices may not be current
   - Calculations are estimates
   - We do not guarantee accuracy
   - Verify with providers before purchase

3. API Key Security
   - You are responsible for API key security
   - Do not share your API key
   - We do not store API keys
   - Regenerate keys if compromised

4. Limitation of Liability
   - We provide no warranties
   - Not responsible for savings estimates
   - Not responsible for decisions made
   - Not responsible for third-party API issues

5. Third-Party Services
   - OpenAI, Anthropic, Groq, DeepSeek are third parties
   - We are not affiliated with them
   - Their pricing and terms apply
   - Check their terms for restrictions

6. Changes to Terms
   - We may change these terms anytime
   - Continued use means acceptance
   - Check back for updates
```

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Terms written ✓
- All liability covered ✓
- Clear and understandable ✓
- Link in footer ✓

---

## PHASE 6: Analytics & Monitoring (Post-Launch)

### 6.1 Setup analytics ⏱️ 30 min
**Tools:** Plausible or Fathom Analytics

- [ ] Create Plausible account
  - Sign up at https://plausible.io
  - Add domain: aiburn.howstud.io
  - Get tracking script
  - Alternative: Fathom Analytics (https://usefathom.com/)

- [ ] Install analytics script
  - Add script to index.html head
  - Or install npm package and integrate
  - Verify script loads
  - Check no console errors

- [ ] Configure event tracking
  - Track "Quick Calculator" usage
  - Track "Exact Usage" mode clicks
  - Track model selections
  - Track "Share" button clicks
  - Track "Download" button clicks
  - Track API key submissions (anonymized)
  - Track error occurrences

- [ ] Create dashboard
  - Track daily users
  - Track calculation mode usage
  - Track popular models
  - Track button clicks
  - Track error rates
  - Track device types

- [ ] Set up goals
  - Goal: "Used Quick Calculator"
  - Goal: "Used Exact Usage"
  - Goal: "Shared Results"
  - Goal: "Downloaded Report"

**Plausible Setup:**
```html
<script defer data-domain="aiburn.howstud.io" src="https://plausible.io/js/script.js"></script>
```

**Status:** ⏳ TODO (Post-launch)  
**Acceptance Criteria:**
- Analytics tracking works ✓
- Dashboard created ✓
- Events recorded ✓
- No user data collected ✓

---

### 6.2 Configure performance monitoring ⏱️ 30 min
**Tools:** Vercel Analytics, Sentry, etc.

- [ ] Setup Vercel Analytics
  - Configure in vercel.json
  - Verify Web Vitals captured
  - Check dashboard for metrics
  - Monitor load times

- [ ] Setup error tracking (Sentry)
  - Create Sentry account
  - Install JavaScript SDK
  - Configure project
  - Test error reporting
  - Set up alerts

- [ ] Setup uptime monitoring
  - Use UptimeRobot or StatusPage
  - Monitor http://aiburn.howstud.io
  - Set 5-minute check interval
  - Configure alerts via email/Slack
  - Create public status page

- [ ] Create monitoring dashboard
  - Uptime %
  - Error rate
  - Average response time
  - Bundle size
  - User sessions

**Status:** ⏳ TODO (Post-launch)  
**Acceptance Criteria:**
- Monitoring configured ✓
- Alerts working ✓
- Dashboard visible ✓
- Data recording ✓

---

### 6.3 Real device testing ⏱️ 90 min
**Devices:** iPhone, Android, iPad

- [ ] Test on iPhone
  - iOS 17+ (latest available)
  - Test Safari browser
  - Test Chrome browser
  - Test form inputs
  - Test touch interactions
  - Test share functionality
  - Test download functionality

- [ ] Test on Android
  - Android 13+ (latest available)
  - Test Chrome browser
  - Test Firefox browser
  - Test form inputs
  - Test touch interactions
  - Test share functionality
  - Test download functionality

- [ ] Test on iPad
  - iOS 17+ (latest available)
  - Test landscape and portrait
  - Test touch and stylus
  - Test calculator in both orientations
  - Verify 20-60-20 layout on tablet

- [ ] Document issues found
  - Note any layout issues
  - Note any functionality issues
  - Note any performance issues
  - Create tickets for fixes
  - Prioritize by severity

- [ ] Create test report
  - Document all tested devices
  - Document results (pass/fail)
  - Include screenshots
  - Provide remediation steps
  - Sign off on readiness

**Status:** ⏳ TODO (Post-launch)  
**Acceptance Criteria:**
- Tested on real iPhone ✓
- Tested on real Android ✓
- All features work ✓
- No layout issues ✓
- Performance acceptable ✓

---

## PHASE 7: Deployment & Go-Live

### 7.1 Final pre-deployment checks ⏱️ 10 min
**Checklist before deploying to production**

- [ ] Run all tests
  ```bash
  npm run test:all
  # Verify: All tests pass ✓
  ```

- [ ] Build production bundle
  ```bash
  npm run build
  # Verify: No errors, dist/ folder created ✓
  ```

- [ ] Check bundle size
  ```bash
  # Verify: < 100 KB gzipped ✓
  # Expected: ~66 KB gzipped
  ```

- [ ] Check dist folder
  ```bash
  # Verify: index.html, assets, etc. present
  # Verify: No console errors on load
  ```

- [ ] Verify environment variables
  ```bash
  # Check: No secrets in code
  # Check: All config in vercel.json
  ```

- [ ] Final code review
  - Review changes since last version
  - Check for console.log statements
  - Check for TODO comments
  - Check styling for issues

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- All tests passing ✓
- Build succeeds ✓
- Bundle size acceptable ✓
- No errors in dist ✓

---

### 7.2 Deploy to Vercel ⏱️ 15 min
**Deploy to production**

- [ ] Push to GitHub
  ```bash
  git add .
  git commit -m "feat: pre-launch audit fixes and accessibility improvements"
  git push origin main
  ```

- [ ] Trigger Vercel deployment
  - Option A: Automatic (GitHub integration)
  - Option B: Manual: `vercel deploy --prod`
  - Wait for build to complete
  - Check build logs for errors

- [ ] Verify deployment
  - Vercel shows "Ready" status ✓
  - Check build logs (no errors)
  - Check performance stats
  - Verify custom domain resolves

- [ ] Test live site
  - Load https://aiburn.howstud.io in browser
  - Check page loads without errors
  - Verify styles load correctly
  - Check no mixed content warnings

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Code pushed to GitHub ✓
- Vercel deployment started ✓
- Build completes successfully ✓
- No build errors ✓
- Domain resolves ✓

---

### 7.3 Post-deployment verification ⏱️ 10 min
**Test live production site**

- [ ] Load site in browser
  - URL: https://aiburn.howstud.io
  - Check page loads
  - Check no console errors
  - Check no network errors

- [ ] Test calculator (Quick mode)
  - Select a model
  - Adjust token slider
  - Click "Calculate"
  - Verify results display
  - Check calculations are correct

- [ ] Test calculator (Exact mode)
  - Switch to Exact Usage
  - Enter OpenAI API key (if available)
  - Click "Analyze"
  - Verify usage loads
  - Verify results display

- [ ] Test share button
  - Click "Share on X"
  - Verify Twitter/X opens with pre-filled text
  - Check text includes cost and savings
  - Close and return to site

- [ ] Test download button
  - Click "Download Report"
  - Verify PNG downloads
  - Check file size (~50-100 KB)
  - Verify PNG opens and shows content

- [ ] Check network requests
  - Open DevTools Network tab
  - Reload page
  - Verify main resources load
  - Check for 404 errors
  - Check for CORS errors

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Site loads without errors ✓
- Calculator works in both modes ✓
- Share functionality works ✓
- Download functionality works ✓
- No network errors ✓

---

### 7.4 Setup monitoring & alerts ⏱️ 20 min
**Configure production monitoring**

- [ ] Setup uptime monitoring
  - Use UptimeRobot: https://uptimerobot.com
  - Add monitor for https://aiburn.howstud.io
  - Check interval: 5 minutes
  - Notification: Email + Slack
  - Configure alert thresholds

- [ ] Configure error tracking
  - Sentry already installed (if done in 6.2)
  - Verify errors being tracked
  - Configure notifications
  - Test by causing an error

- [ ] Setup Vercel Analytics
  - Check Vercel dashboard for metrics
  - Create custom dashboard
  - Monitor Web Vitals
  - Set up alerts for degradation

- [ ] Test alert delivery
  - Manually pause site monitoring to test email alert
  - Verify email received
  - Verify Slack notification sent
  - Resume monitoring

- [ ] Create runbook
  - Document common issues
  - Document troubleshooting steps
  - Document escalation procedures
  - Include contact information

**Status:** ⏳ TODO  
**Acceptance Criteria:**
- Uptime monitoring active ✓
- Error tracking active ✓
- Analytics dashboard visible ✓
- Alerts configured and tested ✓
- Runbook created ✓

---

## 📊 SUMMARY

### Progress Tracker

```
Phase 1: Frontend Integration    [----          ] 0/4 (0%)
Phase 2: Testing               [>---          ] 1/4 (25%)
Phase 3: Monitoring            [              ] 0/3 (0%)
Phase 4: Accessibility         [              ] 0/3 (0%)
Phase 5: SEO & Legal           [              ] 0/4 (0%)
Phase 6: Analytics (Post-L.)   [              ] 0/3 (0%)
Phase 7: Deployment            [              ] 0/4 (0%)
                               ──────────────────
Total                          [>---          ] 1/25 (4%)
```

### Time Estimate by Phase

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| 1. Frontend | 4 | 40 min | HIGH |
| 2. Testing | 4 | 80 min | HIGH |
| 3. Monitoring | 3 | 50 min | MEDIUM |
| 4. Accessibility | 3 | 60 min | HIGH |
| 5. SEO & Legal | 4 | 75 min | HIGH |
| 6. Analytics | 3 | 120 min | LOW (post-launch) |
| 7. Deployment | 4 | 55 min | HIGH |
| **TOTAL** | **25** | **480 min (8 hrs)** | |

### Critical Path
1. **THIS WEEK (4 hours):** Phases 1, 4, 5 (frontend, accessibility, legal)
2. **DEPLOYMENT (1 hour):** Phase 7
3. **POST-LAUNCH (2 hours):** Phases 2, 3, 6 (testing, monitoring, analytics)

---

## 🎯 Next Step

Start with Phase 1: Frontend Integration (loading prices from JSON).

Time to first complete phase: **40 minutes**

EOF
