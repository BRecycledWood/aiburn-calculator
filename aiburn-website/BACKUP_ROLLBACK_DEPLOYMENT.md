# AIBurn Calculator: Backup, Rollback & Deployment Management

**Date:** November 30, 2025  
**Platform:** Vercel  
**Status:** ✅ Configured & Verified

---

## Executive Summary

✅ **Backup & Rollback Strategy:**
- Automatic Git history maintained
- Vercel deployment history saved (30 days)
- 1-click rollback capability
- GitHub branch protection active
- Environment variables backed up

---

## Part 1: Backup Strategy

### 1.1 Source Code Backup

**Primary:** GitHub Repository

```bash
# Repository details
Repository: https://github.com/[org]/aiburn-cost-calculator
Branch: main (production)
Protection: Enabled (require PR review, passing tests)
History: Full git history retained indefinitely
```

**Backup Status:**
- ✅ All code in GitHub
- ✅ Daily backups (GitHub automatic)
- ✅ Tags for releases created
- ✅ Full history preserved

**Restore Procedure:**
```bash
# If local repo corrupted
git clone https://github.com/[org]/aiburn-cost-calculator

# If need to restore specific commit
git checkout <commit-sha>
git push origin main --force-with-lease
```

### 1.2 Deployment History Backup

**Primary:** Vercel Built-in History

**Features:**
- ✅ 30 days deployment history stored
- ✅ Each deployment tagged with timestamp
- ✅ Git commit SHA associated with each deployment
- ✅ Environment variables saved per deployment
- ✅ Build logs retained

**Access Vercel History:**
```
Dashboard: https://vercel.com/dashboard
Project: AIBurn Calculator
Deployments tab → View all past deployments
```

### 1.3 Environment Variables Backup

**Primary:** Vercel Environment Variables Panel

**Stored Variables:**
```
VITE_SENTRY_DSN        → Error tracking
VITE_GA_MEASUREMENT_ID → Analytics
VITE_EMAIL_SERVICE_URL → Email sending
(Others as configured)
```

**Backup Location:**
- ✅ Stored in Vercel dashboard (encrypted)
- ✅ Backup copy in `.env.example` (non-sensitive)
- ✅ Documentation in team wiki

**Manual Backup:**
```bash
# Export current environment variables
vercel env pull > .env.backup.local

# Verify (check for sensitive data before committing)
cat .env.backup.local
```

**⚠️ Security:** Never commit `.env` with secrets to Git

### 1.4 Database/Storage Backup

**Status:** Not applicable (stateless application)

**Explanation:**
- ✅ No database (calculations done in browser)
- ✅ No server-side storage (privacy by design)
- ✅ Optional email data stored with email service provider
- ✅ No user accounts (no account data)

**For Email Storage:**
```
Email service provider: FormSubmit.co (or configured service)
Backup: Handled by provider
Access: Check provider's dashboard
Retention: Configured per email service
```

### 1.5 Monitoring & Alerting Logs

**Primary:** Sentry + Vercel Logs

**Sentry Backup:**
```
URL: https://sentry.io
Data retention: 90 days (configurable)
Backup: Sentry maintains redundancy
Export: Can export issues as JSON
```

**Vercel Logs:**
```
URL: https://vercel.com/dashboard → Deployments → Logs
Retention: 30 days
Contains: Build logs, deployment logs, function logs
```

---

## Part 2: Rollback Procedures

### 2.1 One-Click Rollback (Easiest)

**When:** When you need to quickly revert to a previous deployment

**Steps:**

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com → Projects → AIBurn Calculator
   ```

2. **Select Deployments Tab**
   ```
   View all deployments with timestamps
   Each shows: commit SHA, timestamp, status
   ```

3. **Find Target Deployment**
   ```
   Identify working deployment from history
   Example: "Deployed 2 hours ago - abc123def"
   ```

4. **Click Three Dots (⋯) → Redeploy**
   ```
   Vercel automatically redeploys exact version
   No code changes needed
   Takes ~2-5 minutes
   ```

5. **Verify Rollback**
   ```
   npm run smoke-test https://aiburn.howstud.io
   Check Sentry for error spike resolution
   ```

**Time Required:** 5-10 minutes  
**Risk Level:** Very Low (exact same code)

### 2.2 Git-Based Rollback (More Control)

**When:** When you need to revert code changes and redeploy

**Steps:**

1. **Identify Bad Commit**
   ```bash
   git log --oneline | head -10
   # Shows: abc123 - Bad feature commit
   #        def456 - Previous working commit
   ```

2. **Revert Commit**
   ```bash
   # Option A: Create revert commit (keeps history clean)
   git revert abc123 --no-edit
   git push origin main
   
   # Option B: Reset to previous commit (loses history)
   git reset --hard def456
   git push origin main --force-with-lease
   ```

3. **GitHub Actions Triggers CI/CD**
   ```
   - Automatically runs tests (must pass)
   - Builds deployment
   - Deploys to Vercel
   ```

4. **Verify Deployment**
   ```bash
   npm run smoke-test https://aiburn.howstud.io
   ```

**Time Required:** 10-20 minutes  
**Risk Level:** Low (includes testing)

**Recommended:** Use `git revert` (safer, keeps history)

### 2.3 Partial Rollback (Advanced)

**When:** When only specific features need reverting

**Steps:**

1. **Identify Changed Files**
   ```bash
   git diff def456..abc123 --name-only
   # Shows files changed in problematic commit
   ```

2. **Revert Specific Files**
   ```bash
   git checkout def456 -- src/components/ProblemComponent.jsx
   git commit -m "fix: revert problematic component"
   git push origin main
   ```

3. **CI/CD Deploys**
   ```
   Automatic deployment via GitHub Actions
   ```

**Time Required:** 15-25 minutes  
**Risk Level:** Medium (requires precision)

### 2.4 Emergency Hotfix + Rollback

**When:** Critical bug in production, need immediate fix

**Procedure:**

```bash
# 1. Create hotfix branch from last known good commit
git checkout -b hotfix/critical-bug def456

# 2. Make fix
# 3. Test locally
npm run test && npm run e2e

# 4. Commit hotfix
git commit -m "fix: critical production issue"

# 5. Merge to main (bypass PR if critical)
git checkout main
git merge --no-ff hotfix/critical-bug
git push origin main

# 6. Delete hotfix branch
git branch -d hotfix/critical-bug

# 7. Wait for CI/CD (5-10 minutes)
# 8. Verify in production
npm run smoke-test https://aiburn.howstud.io
```

**Time Required:** 10-15 minutes  
**Risk Level:** Medium (urgency trade-off)

---

## Part 3: Deployment Management

### 3.1 Standard Deployment Process

**Trigger:** Push to `main` branch

```
Step 1: Push Code
  └─ git push origin main

Step 2: GitHub Actions CI (5-10 min)
  ├─ Lint ✓
  ├─ Type Check ✓
  ├─ Security Audit ✓
  ├─ Unit Tests ✓
  ├─ E2E Tests ✓
  └─ Build ✓

Step 3: CI Passes
  └─ Automatically triggers Vercel deployment

Step 4: Vercel Builds & Deploys (3-5 min)
  ├─ Install dependencies
  ├─ Build production bundle
  ├─ Upload to CDN
  ├─ DNS propagation
  └─ Live!

Step 5: Post-Deployment
  ├─ Run smoke tests
  ├─ Monitor Sentry
  ├─ Check analytics
  └─ Notify team

Total Time: 15-25 minutes
```

### 3.2 Vercel Deployment Features

**Auto-Deployments:**
```
✅ Every push to main auto-deploys
✅ No manual action needed
✅ Atomic deployments (all or nothing)
✅ Zero downtime
✅ Instant rollback available
```

**Preview Deployments:**
```
✅ Every PR gets preview URL
✅ Test before merging
✅ Exact production replica
✅ Available for 72 hours
✅ Share with stakeholders
```

**Deployment Status:**
```
Check Status: https://vercel.com/dashboard
- Current deployment: shows live version
- Previous deployments: show history
- Logs: available for debugging
```

### 3.3 Environment-Specific Deployments

**Vercel Environments:**

```
Production (main branch)
  URL: https://aiburn.howstud.io
  Status: Live, 100% traffic
  
Preview (PR branches)
  URL: https://[project]-[branch].vercel.app
  Status: Test environment
  
Staging (if configured)
  URL: Configured in Vercel
  Status: Pre-production testing
```

**Current Setup:**
- ✅ Production: main branch
- ✅ Preview: Automatic on all PRs
- Note: Staging can be added if needed

---

## Part 4: Monitoring Post-Deployment

### 4.1 Immediate Post-Deployment (First 5 min)

```bash
# 1. Check Vercel deployment status
open https://vercel.com/dashboard
# Should show "Ready" and green checkmark

# 2. Check application loads
curl -I https://aiburn.howstud.io
# Should return 200 OK

# 3. Check in browser
open https://aiburn.howstud.io
# Page should load without errors
```

### 4.2 Validation Tests (First 15 min)

```bash
# Run smoke tests
npm run smoke-test https://aiburn.howstud.io

# Expected output:
# ✓ Main page loads
# ✓ Privacy page loads
# ✓ Terms page loads
# ✓ Advertise page loads
# ✓ API endpoint responds
# Result: 5/5 tests passing
```

### 4.3 Error Monitoring (First Hour)

**Check Sentry Dashboard:**
```
URL: https://sentry.io/[org]/[project]/
Look for:
  ✗ New errors introduced → Immediate rollback
  ✓ No errors increase → Safe
  ✓ Expected errors only → Normal
```

**Sentry Metrics:**
- Error count: Should be flat or decreasing
- Error rate: Should be <1% of requests
- New issue creation: Should be 0

### 4.4 Performance Monitoring (First Hour)

**Check Vercel Analytics:**
```
URL: https://vercel.com/dashboard → Deployments
Metrics:
  ✓ Request latency: <500ms median
  ✓ Build success: 100%
  ✓ Error rate: <1%
```

**Check Core Web Vitals:**
```
Tool: https://pagespeed.web.dev
URL: https://aiburn.howstud.io
Expected:
  ✓ LCP: <2.5s
  ✓ FID: <100ms
  ✓ CLS: <0.1
```

### 4.5 Application Validation (Ongoing)

**Functional Checks:**
- [ ] Main calculator works
- [ ] Quick mode calculations accurate
- [ ] Advanced mode calculations accurate
- [ ] Email capture working (if enabled)
- [ ] Contact form working
- [ ] Privacy page accessible
- [ ] Terms page accessible
- [ ] No console errors (F12)

**Analytics Validation:**
- [ ] Google Analytics receiving hits
- [ ] Traffic appears in dashboard
- [ ] Event tracking working (if configured)

---

## Part 5: Disaster Recovery

### 5.1 Complete Service Outage

**Cause:** Vercel infrastructure down (rare)

**Detection:**
```
Symptoms:
  - HTTPS timeout errors
  - 503 Service Unavailable
  - Persistent 5xx errors
  - All pages down (not just calculator)
```

**Response:**

```
1. Check Vercel Status Page
   https://www.vercelstatus.com
   
2. If Vercel Status Shows Incident
   - Wait for Vercel team to resolve
   - No action needed
   - Usually resolves within 15-30 minutes
   
3. If Status Page Shows OK
   - Check GitHub Actions logs
   - Check Vercel deployment logs
   - Investigate recent code change
```

**Recovery Options:**

```
Option A: Rollback Last Deployment
  git revert [last-commit]
  git push origin main
  Wait 10 minutes for redeployment

Option B: Redeploy Previous Version
  Via Vercel dashboard → Deployments → Redeploy
  Takes 5 minutes

Option C: Manual Fix & Deploy
  Identify issue
  Fix code
  git push origin main
  Wait for CI/CD
```

### 5.2 Data Breach / Suspected Security Issue

**Response Plan:**

```
1. IMMEDIATELY: Take down to investigate
   - Only if clear security risk
   - Contact Vercel support
   - Check Sentry for CSP violations

2. Investigate:
   - Review Vercel deployment logs
   - Check GitHub for unauthorized commits
   - Review Sentry security events
   - Check CSP violation reports

3. If Compromised Code:
   - Force change GitHub PAT
   - Review recent commits
   - Revert to known good version
   - git revert [bad-commit]
   - Force push (with caution)

4. Notify Stakeholders:
   - Team
   - Users (if data exposed)
   - Affected services

5. Post-Incident:
   - Audit Git access logs
   - Enable 2FA on all accounts
   - Review GitHub Actions logs
   - Update security policies
```

### 5.3 Data Loss / Accidental Deletion

**Status:** Low Risk (stateless application)

**If Needed:**
```
1. Restore from Git History
   git log --all
   git checkout <commit-sha>
   
2. Restore Environment Variables
   - Stored in Vercel dashboard (encrypted)
   - Backup copy in .env.example
   - Check with team for sensitive vars

3. Restore from GitHub
   - All code in GitHub
   - Full history preserved
   - Can restore any version
```

---

## Part 6: Alerts & Notifications

### 6.1 Deployment Notifications

**GitHub Actions Notifications:**
```
Default: Email on failed build
Setup: GitHub Settings → Notifications
```

**Recommended:** 
```
✅ Email on build failure
✅ Slack notification (optional)
✅ Discord webhook (optional)
```

### 6.2 Error Notifications

**Sentry Alerts:**

**Current Configuration:**
```
Project: AIBurn Calculator
Alerts:
  ✓ Email on new error
  ✓ Email if 10+ errors in 24h
  ✓ Digest: Daily summary email
```

**To Add Slack Integration:**
```
1. Go to Sentry → Settings → Integrations
2. Add Slack workspace
3. Configure channels for alerts
4. Set severity thresholds
```

**To Add Discord Integration:**
```
1. Create Discord webhook
2. Go to Sentry → Settings → Webhooks
3. Add webhook URL
4. Configure events to notify
```

### 6.3 Vercel Deployment Notifications

**Email Alerts:**
```
Vercel dashboard → Settings → Notifications
✓ Deployment succeeded
✓ Deployment failed
✓ Preview deployment ready
```

**Slack Integration:**
```
1. Go to Vercel dashboard
2. Settings → Integrations → Slack
3. Connect Slack workspace
4. Choose channel for notifications
```

### 6.4 Manual Monitoring

**Daily Checklist:**

```
□ Check deployment status (green or red?)
□ Monitor error rate in Sentry (should be <1%)
□ Spot check site loads (takes 30 seconds)
□ Review analytics trend (increasing or stable?)
□ Check for security alerts (CSP violations, etc.)
□ Monitor performance (Core Web Vitals)
```

---

## Part 7: Maintenance & Updates

### 7.1 Dependencies Update Strategy

**Process:**
```
1. Security Updates (Apply immediately)
   npm audit fix
   npm audit fix --force (if needed)
   
2. Minor/Patch Updates (Monthly)
   npm update
   npm run test
   npm run e2e
   
3. Major Updates (Quarterly, planned)
   Check breaking changes
   Update code if needed
   Extensive testing
   Plan upgrade window
```

### 7.2 Deployment Checklist

**Before Each Deploy:**

```
Pre-Deployment:
  ✓ Run all tests locally
  ✓ Verify no lint errors
  ✓ Check security audit
  ✓ Review code changes
  ✓ Test critical flows
  
During Deployment:
  ✓ Monitor CI/CD pipeline
  ✓ Ensure tests pass
  ✓ Check build completes
  
Post-Deployment:
  ✓ Run smoke tests
  ✓ Check Sentry for errors
  ✓ Verify analytics working
  ✓ Spot check functionality
  ✓ Monitor error rate
```

### 7.3 Version Management

**Git Tags for Releases:**

```bash
# Tag a release
git tag -a v1.0.0 -m "Release 1.0.0 - Production Ready"
git push origin v1.0.0

# View tags
git tag -l

# Checkout a tag
git checkout v1.0.0
```

**Recommended:**
```
v1.0.0 - Initial production release
v1.0.1 - Bug fix
v1.1.0 - New feature
v2.0.0 - Major version change

Tag pattern: vMAJOR.MINOR.PATCH
```

---

## Quick Reference: Rollback Decision Tree

```
Something wrong in production?

├─ Is site completely down?
│  └─ YES: Immediate 1-click rollback via Vercel
│
├─ Are there critical errors in Sentry?
│  ├─ YES & recent code change:
│  │  └─ git revert <commit>
│  │     git push origin main
│  │
│  └─ NO & new feature causing issues:
│     └─ Vercel redeploy previous version
│
├─ Is performance degraded?
│  └─ YES: Check metrics, may need optimization instead of rollback
│
├─ Are there security warnings?
│  └─ YES: Immediate rollback + investigation
│
└─ Minor issues / single component broken?
   └─ Hotfix: Create fix, commit, push (faster than rollback)
```

---

## Sign-Off

✅ **Backup & Rollback: CONFIGURED**

**Status Summary:**
- ✅ Automatic backups via GitHub
- ✅ Deployment history on Vercel (30 days)
- ✅ 1-click rollback available
- ✅ Git-based rollback procedure documented
- ✅ Emergency procedures documented
- ✅ Monitoring alerts configured
- ✅ Post-deployment verification process

**Confidence Level:** High
- Multiple backup options
- Quick rollback capability
- Clear procedures documented
- Automated testing prevents bad deployments

---

**Document Version:** 1.0  
**Date:** November 30, 2025  
**Last Reviewed:** November 30, 2025
