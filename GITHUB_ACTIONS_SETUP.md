# GitHub Actions CI/CD Setup - Complete Guide

**Date:** December 1, 2025  
**Status:** ✅ FULLY CONFIGURED

## Overview

AIBurn Cost Calculator now has comprehensive GitHub Actions workflows for automated quality control, security monitoring, and production deployment.

## Workflows Summary

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **QC Checks** | Push/PR | Security, tests, build, linting | 5-10 min |
| **Dependency Check** | Daily 2 AM UTC | Vulnerability scanning | 2-3 min |
| **Production Deploy** | Push to main | Auto-deploy to Vercel | 10-15 min |
| **Performance** | Push/main | Bundle & Lighthouse analysis | 3-5 min |

## Implementation Details

### 1. QC Checks (`qc.yml`)

**Runs on every push and pull request**

Jobs:
- ✅ Security & Linting
  - `npm audit` checks for vulnerable packages
  - `npm run lint` validates code style
  
- ✅ Unit & Integration Tests
  - Full Jest test suite execution (178+ tests)
  - Coverage report upload to Codecov
  - Fail pipeline if tests fail
  
- ✅ Build Verification
  - `npm run build` production bundle
  - Bundle size validation (max 150KB gzipped JS)
  - Artifact verification
  
- ✅ Security Audit
  - Hardcoded secret detection (sk-, pk_, AKIA patterns)
  - XSS vulnerability scanning (dangerouslySetInnerHTML, innerHTML)
  
- ✅ Test Summary
  - Aggregate all check results
  - Block PR merge if any check fails

**Status Checks (Block Merges):**
```
✓ security
✓ tests
✓ build
✓ security-audit
✓ test-summary
```

### 2. Dependency Security Check (`dependency-check.yml`)

**Runs daily at 2 AM UTC (configurable)**

Features:
- Automated `npm audit --audit-level=high` scan
- Auto-creates GitHub issue if vulnerabilities found
- Labels: `security`, `dependencies`
- Early warning for zero-day CVEs

Example issue created:
```
Title: 🔒 Security: Vulnerable dependencies detected
Body: A scheduled npm audit found vulnerable dependencies. Please review and update.
Labels: [security, dependencies]
```

### 3. Production Deploy (`production-deploy.yml`)

**Runs on push to main branch only**

Stages:
1. **Pre-Deployment Verification**
   - Run all QC checks again
   - Build production bundle
   - Verify all artifacts present

2. **Vercel Deployment**
   - Uses Vercel GitHub integration
   - Automatic SSL/TLS certificate
   - Production domain assignment
   - Build logs available in Vercel dashboard

3. **Post-Deployment Checks**
   - Health check: curl to production endpoint
   - CSP header verification
   - HSTS header verification
   - Creates commit comment with status

4. **Slack Notification** (if configured)
   - Success message: ✅ Deployed to https://aiburn.howstud.io
   - Failure message: ❌ Check logs
   - Includes commit SHA, author, action URL

### 4. Performance Monitoring (`performance.yml`)

**Runs on push to main/develop**

Analyzes:
- **Bundle Size**
  - HTML: < 5 KB
  - CSS: < 30 KB
  - JavaScript (gzipped): < 150 KB

- **Lighthouse Audit**
  - Performance score (target: >90)
  - Accessibility score (target: >95)
  - Best Practices (target: >90)
  - SEO score (target: >90)

- **Performance Regression**
  - Compares metrics to baseline
  - Alerts on significant regressions

## Setup Instructions

### Step 1: Add GitHub Secrets

Required for production deployment:

1. Go to repository Settings
2. Select "Secrets and variables" > "Actions"
3. Create new secrets:

```
VERCEL_TOKEN
├─ Value: <your-vercel-deployment-token>
└─ From: https://vercel.com/account/tokens

VERCEL_ORG_ID
├─ Value: <org-id>
└─ Format: team_xxxxx

VERCEL_PROJECT_ID
├─ Value: <project-id>
└─ From: Vercel project settings

SLACK_WEBHOOK_URL (Optional)
├─ Value: <slack-webhook-url>
└─ From: https://api.slack.com/apps (Incoming Webhooks)
```

### Step 2: Enable Branch Protection

1. Settings > Branches > main
2. Enable "Require status checks to pass before merging"
3. Select required checks:
   - ☑️ security
   - ☑️ tests
   - ☑️ build
   - ☑️ security-audit
   - ☑️ test-summary
4. Enable "Require branches to be up to date before merging"

### Step 3: Verify Workflows

1. Push a change to main
2. Go to Actions tab
3. Monitor workflow runs
4. Verify:
   - QC checks pass
   - Build succeeds
   - Vercel deployment completes
   - Health checks pass

## Usage

### Manually Trigger Workflow

**From GitHub UI:**
1. Actions tab
2. Select workflow
3. Click "Run workflow"

**From CLI:**
```bash
# Run QC checks
gh workflow run qc.yml -r main

# Run security checks
gh workflow run dependency-check.yml

# Run performance tests
gh workflow run performance.yml

# Deploy (requires main branch)
gh workflow run production-deploy.yml -r main
```

### View Workflow Status

```bash
# List recent runs
gh run list --workflow=qc.yml --limit=10

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# Cancel run
gh run cancel <run-id>

# Download coverage report
gh run download <run-id> --name coverage
```

## Monitoring & Alerts

### GitHub Notifications
- ✅ Automatic email on workflow failure
- ✅ Status checks prevent merge if failed
- ✅ Required checks clearly marked

### Slack Notifications (If Configured)
- ✅ Deployment success message
- ✅ Deployment failure with logs link
- ✅ Vulnerability alert issues
- ✅ Performance regression alerts

### Codecov Integration
- ✅ Coverage badges in PRs
- ✅ Coverage trend reports
- ✅ Missing line coverage details

## File Structure

```
aiburn-website/
├── .github/
│   ├── workflows/
│   │   ├── qc.yml                  (244 lines)
│   │   ├── dependency-check.yml    (35 lines)
│   │   ├── production-deploy.yml   (171 lines)
│   │   ├── performance.yml         (114 lines)
│   │   └── ci.yml                  (existing)
│   └── WORKFLOWS.md                (Detailed documentation)
├── src/
├── api/
├── public/
└── ... (rest of project)
```

## Workflow Execution Timeline

### On Every Push/PR to main or develop:
1. QC Checks start immediately (5-10 min)
   - Security scanning
   - Tests execution
   - Build verification
   - Security audit
2. Performance analysis (3-5 min)

### On Push to main Only:
3. Production Deploy (10-15 min)
   - Pre-deployment checks
   - Vercel deployment
   - Post-deploy health checks
   - Slack notification

### Every Day at 2 AM UTC:
4. Dependency Security Check (2-3 min)
   - Full npm audit
   - Auto-create issue if vulnerabilities

## Customization

### Adjust Bundle Size Limit

Edit `.github/workflows/performance.yml`:
```yaml
JS_LIMIT=150  # Change to your target (KB)
CSS_LIMIT=30
HTML_LIMIT=5
```

### Change Dependency Check Schedule

Edit `.github/workflows/dependency-check.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # Cron format (UTC)
  # Examples:
  # 0 0 * * * = Daily at midnight
  # 0 9 * * 1 = Mondays at 9 AM
  # 0 */4 * * * = Every 4 hours
```

### Add Custom Security Checks

Edit `.github/workflows/qc.yml`:
```yaml
- name: Custom Check
  run: |
    # Add your check here
    npm run custom-check || exit 1
```

## Troubleshooting

### Workflow Not Triggering

**Check:**
1. Is file path correct? `.github/workflows/qc.yml`
2. Is syntax valid? (YAML indentation)
3. Are branches matching? (main/develop)
4. Check workflow history in Actions tab

**Fix:**
```bash
# Push small change to trigger
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger workflows"
git push origin main
```

### Deployment Token Expired

**Error:** "Invalid Vercel token"

**Fix:**
1. vercel.com > Settings > Tokens
2. Create new token
3. Update GitHub secret `VERCEL_TOKEN`
4. Re-run workflow

### Tests Fail in CI but Pass Locally

**Common causes:**
- Different Node version
- Missing environment variables
- Timeout too short

**Debug:**
```bash
# Run with CI flag
CI=true npm test

# Check Node version
node --version

# Check timeout
# In jest.config.js: testTimeout: 10000
```

### Bundle Size Exceeds Limit

**Fix:**
1. Analyze bundle: `npm run build`
2. Check large files: `du -sh dist/index.*.js`
3. Consider code splitting
4. Defer non-critical code
5. Update threshold if justified

## Security Considerations

### Secret Rotation

Secrets should be rotated quarterly:
1. Generate new Vercel token
2. Update `VERCEL_TOKEN` secret
3. Delete old token from Vercel

### Workflow Permissions

Workflows run with:
- Repository read/write access (for commits, PRs)
- Deployment access (VERCEL_TOKEN)
- No production database access (by design)

### Log Sanitization

GitHub Actions automatically:
- ✅ Masks secrets in logs
- ✅ Hides API keys in output
- ✅ Redacts sensitive patterns

## Performance Metrics

### CI/CD Runtime

| Stage | Time |
|-------|------|
| Setup | 1 min |
| npm install | 2 min |
| QC checks | 5-10 min |
| Build | 2 min |
| Tests | 3 min |
| Deploy | 5 min |
| Post-checks | 1 min |
| **Total** | **~15 min** |

### Cost

GitHub Actions:
- Free tier: 2,000 minutes/month
- Estimated usage: ~100 minutes/week
- Status: ✅ Well within free tier

Vercel:
- Free tier includes deployments
- Automatic SSL/TLS
- Status: ✅ No additional cost

## Best Practices

### For Developers

1. **Run checks locally before pushing:**
   ```bash
   npm audit
   npm run lint
   npm test
   npm run build
   ```

2. **Use descriptive commit messages:**
   ```
   feat: add new feature X
   fix: resolve issue Y
   docs: update README
   ```

3. **Keep commits atomic:**
   - One feature per commit
   - Easier to debug if CI fails

4. **Don't bypass CI:**
   - All checks must pass
   - Status checks prevent merge

### For Code Reviews

1. **Check CI status:**
   - ✅ All green = safe to merge
   - ❌ Any red = don't merge

2. **Review performance impact:**
   - Bundle size changes
   - Test coverage changes

3. **Verify security scans:**
   - npm audit results
   - Secret detection status

## Integration with Other Tools

### Codecov
- Coverage reports in PR comments
- Badge in README
- Trend analysis

### Sentry
- Already configured in app
- Receives production errors
- Tracks error trends

### Vercel
- GitHub integration active
- Auto-deploy on main push
- SSL/TLS automatic

## Maintenance

### Regular Tasks

**Weekly:**
- Review Actions tab for failures
- Check Slack notifications
- Monitor bundle size trends

**Monthly:**
- Review dependency versions
- Update GitHub secrets if needed
- Check Codecov coverage trends

**Quarterly:**
- Rotate API tokens
- Review workflow configuration
- Update Node.js version if needed

## Support & Troubleshooting

For issues:
1. Check workflow logs in Actions tab
2. Review error message
3. Search GitHub Actions documentation
4. Contact DevOps team with run ID

## Next Steps

1. ✅ Add GitHub secrets (VERCEL_TOKEN, etc.)
2. ✅ Enable branch protection on main
3. ✅ Test by pushing to main
4. ✅ Configure Slack (optional)
5. ✅ Add status badges to README

---

**Documentation:** `.github/WORKFLOWS.md`  
**Configuration:** `.github/workflows/*.yml`  
**Last Updated:** December 1, 2025

