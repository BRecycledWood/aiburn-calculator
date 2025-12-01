# GitHub Actions Workflows

This document describes the automated CI/CD pipelines for AIBurn Cost Calculator.

## Workflows Overview

### 1. QC Checks (`qc.yml`)
**Trigger:** On every push and pull request  
**Purpose:** Automated quality control on code changes

#### Jobs:
- **Security & Linting**
  - `npm audit` - Check for vulnerable dependencies
  - `npm run lint` - ESLint code style checking

- **Unit & Integration Tests**
  - `npm test` - Run Jest test suite
  - Coverage reports uploaded to Codecov

- **Build Verification**
  - `npm run build` - Vite production build
  - Bundle size validation (max 150KB gzipped JS)

- **Security Audit**
  - Scan for hardcoded secrets (sk-, pk_, AKIA patterns)
  - Check for XSS danger patterns (dangerouslySetInnerHTML, innerHTML)

- **Test Summary**
  - Aggregate all check results
  - Block merge if any checks fail

#### Branch Protection:
All commits to `main` and `develop` must pass:
```yaml
Required status checks:
- security
- tests
- build
- security-audit
- test-summary
```

---

### 2. Dependency Security Check (`dependency-check.yml`)
**Trigger:** Daily at 2 AM UTC (configurable)  
**Purpose:** Proactive vulnerability monitoring

#### Features:
- Runs `npm audit --audit-level=high` daily
- Automatically creates GitHub issue if vulnerabilities found
- Labels: `security`, `dependencies`
- Helps catch zero-day vulnerabilities early

#### Notification:
When vulnerabilities are detected:
1. GitHub Issue created automatically
2. Assigned to security team (configure in Actions settings)
3. Issue includes link to security advisory

---

### 3. Production Deploy (`production-deploy.yml`)
**Trigger:** Push to `main` branch only  
**Purpose:** Automated production deployment with verification

#### Stages:

**1. Pre-Deployment Verification**
- Run all QC checks again
- Build production bundle
- Verify build artifacts

**2. Vercel Deployment**
- Deploy using Vercel GitHub integration
- Automatic production domain assignment
- SSL certificates automatic

**3. Post-Deployment Checks**
- Health check: curl to production endpoint
- Security headers verification:
  - CSP header present
  - HSTS header present
- Create commit comment on GitHub

**4. Slack Notification**
- Sends success/failure notification to Slack
- Includes app name, URL, commit SHA, author

#### Required Secrets:
```yaml
VERCEL_TOKEN         # Vercel deployment token
VERCEL_ORG_ID        # Vercel organization ID
VERCEL_PROJECT_ID    # Vercel project ID
SLACK_WEBHOOK_URL    # Slack incoming webhook (optional)
```

#### Setup Instructions:

1. **Generate Vercel Token:**
   ```bash
   # On vercel.com, go to Settings > Tokens
   # Create new token with expiration
   # Copy token value
   ```

2. **Add GitHub Secrets:**
   ```
   Repo > Settings > Secrets and variables > Actions
   Add:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID
   - SLACK_WEBHOOK_URL (optional)
   ```

3. **Configure Branch Protection:**
   ```
   Repo > Settings > Branches > main
   Require all status checks to pass before merging
   ```

---

### 4. Performance Monitoring (`performance.yml`)
**Trigger:** Push to `main`/`develop`, manual workflow dispatch  
**Purpose:** Track and alert on performance regressions

#### Checks:

**1. Bundle Size Analysis**
- Tracks HTML, CSS, JavaScript sizes
- Reports gzipped JavaScript size
- Thresholds:
  - JS (gzipped): < 150 KB
  - CSS: < 30 KB
  - HTML: < 5 KB

**2. Lighthouse Audit**
- Performance score (target: >90)
- Accessibility (target: >95)
- Best Practices (target: >90)
- SEO (target: >90)
- Uploads artifacts for review

**3. Performance Regression Detection**
- Compares metrics to baseline
- Alerts if regression detected
- Supports custom performance tests

#### Output:
- Summary table in GitHub Actions tab
- Artifact links for detailed reports
- Commit status for branch protection

---

## Branch Strategy

### Main Branch (`main`)
- Production-ready code
- All QC checks required before merge
- Auto-deploys to production on merge
- Protected: Requires PR review + status checks

### Develop Branch (`develop`)
- Integration branch
- QC checks required
- Used for staging/testing
- Auto-deploys to staging on merge

### Feature Branches
- Branch from `develop`
- Create PR to `develop`
- All QC checks run automatically
- Merge after review and checks pass

## Status Badges

Add these to your README.md:

```markdown
![QC Checks](https://github.com/BRecycledWood/aiburn-calculator/workflows/QC%20Checks/badge.svg)
![Production Deploy](https://github.com/BRecycledWood/aiburn-calculator/workflows/Production%20Deploy/badge.svg)
![Dependency Check](https://github.com/BRecycledWood/aiburn-calculator/workflows/Dependency%20Security%20Check/badge.svg)
```

## Manual Workflow Trigger

### Trigger from GitHub UI:
1. Go to `Actions` tab
2. Select workflow
3. Click `Run workflow` button

### Trigger via CLI:
```bash
gh workflow run qc.yml
gh workflow run dependency-check.yml
gh workflow run production-deploy.yml
gh workflow run performance.yml
```

## Monitoring & Alerts

### GitHub Notifications:
- CI failure → Notification to watchers
- Required check fails → PR cannot merge
- Production deploy failure → Notification

### Slack Integration (Optional):
Configure Slack webhook for deployment notifications:
1. Create Slack webhook at api.slack.com
2. Add as `SLACK_WEBHOOK_URL` secret
3. Receives deploy success/failure notifications

### Email Alerts:
- GitHub Actions failures email to watchers
- Configure in repo Settings > Notifications

## Troubleshooting

### Build Fails with "npm audit" Error
```bash
# Reduce audit severity level
npm audit --audit-level=moderate
```

### Deployment Token Expired
```bash
# Go to vercel.com > Settings > Tokens
# Create new token
# Update VERCEL_TOKEN secret in GitHub
```

### Tests Timeout in CI
- Increase timeout in `jest.config.js`
- Default: 5000ms per test
- CI environment slower than local

### Performance Thresholds Too Strict
Edit `.github/workflows/performance.yml`:
```yaml
# Adjust limits
JS_LIMIT=150  # Change this
CSS_LIMIT=30
```

## Best Practices

### For Developers:

1. **Run checks locally first:**
   ```bash
   npm audit
   npm run lint
   npm test
   npm run build
   ```

2. **Keep commits small:**
   - Easier to debug if CI fails
   - Faster feedback loop

3. **Use semantic commit messages:**
   ```
   feat: add feature X
   fix: resolve issue Y
   docs: update README
   ```

4. **Never bypass CI checks:**
   - All checks must pass
   - Protections prevent merging without checks

### For Code Reviews:

1. **Check QC badge status:**
   - ✅ All checks pass = safe to merge
   - ❌ Any fail = don't merge

2. **Review performance metrics:**
   - Bundle size trends
   - Lighthouse scores

3. **Watch for dependency updates:**
   - Dependency checker alerts to security issues

## Customization

### Edit Thresholds:
File: `.github/workflows/performance.yml`
```yaml
# Bundle size limits
BUNDLE_LIMIT=150000  # bytes
```

### Change Schedule:
File: `.github/workflows/dependency-check.yml`
```yaml
schedule:
  - cron: '0 2 * * *'  # Change time
```

### Add Custom Checks:
1. Edit relevant workflow file
2. Add new job under `jobs:`
3. Commit and push
4. GitHub automatically runs new job

## Integration with Other Tools

### Codecov (Coverage Reports)
- Already configured in `qc.yml`
- Coverage badge: `[![codecov](https://codecov.io/gh/USER/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USER/REPO)`

### Sentry (Error Tracking)
- Configured in app code (`src/utils/sentry.js`)
- Automatically captures errors in production

### Vercel (Hosting)
- GitHub Actions trigger Vercel deployment
- Automatic builds on push to main

## Monitoring Commands

```bash
# View workflow status
gh run list --workflow=qc.yml

# View specific run logs
gh run view <run-id> --log

# Cancel a run
gh run cancel <run-id>

# Download artifacts
gh run download <run-id> --name coverage
```

## Contact & Support

For CI/CD issues:
1. Check GitHub Actions tab for logs
2. Review error message in workflow run
3. Contact DevOps team with run ID

---

**Last Updated:** December 1, 2025  
**Maintainer:** Dev Team
