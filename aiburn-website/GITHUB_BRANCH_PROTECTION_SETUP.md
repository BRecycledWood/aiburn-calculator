# GitHub Branch Protection Rules Setup Guide

## Overview
This guide explains how to set up branch protection rules to enforce the CI/CD pipeline and prevent merging of failing PRs.

---

## Step-by-Step Setup

### 1. Navigate to Branch Protection Settings

```
1. Go to your GitHub repository
2. Click "Settings" (top menu)
3. Click "Branches" (left sidebar)
4. Click "Add rule" button
```

---

### 2. Create Rule for `main` Branch

#### Pattern to Protect
```
Branch name pattern: main
```

#### Required Status Checks
Enable and select:
- ✅ `security-scan` (Security Scanning)
- ✅ `lint` (Lint)
- ✅ `test` (Unit Tests)
- ✅ `build` (Build)
- ✅ `e2e` (E2E Tests)
- ✅ `ci-status` (CI Status Check)

#### Other Settings

```
☑ Require a pull request before merging
  └─ Required number of approvals before merging: 1
  └─ ☑ Dismiss stale pull request approvals when new commits are pushed
  └─ ☑ Require approval of the latest reviewable commit
  
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  
☑ Require code reviews from code owners
  └─ Required number of approvals: 1
  
☑ Require conversation resolution before merging

☑ Require signed commits

☑ Require deployments to succeed before merging
  └─ (Optional) Select deployment environments: production
  
☑ Require up-to-date branches
  └─ Automatically dismiss stale PR approvals
  
☑ Include administrators
  └─ Check this to enforce rules on admins too
```

#### Bypass Rules
```
Allow force pushes:
  ☐ Do not allow force pushes

Allow deletions:
  ☐ Do not allow deletions
```

---

### 3. Create Rule for `develop` Branch (Optional)

**Same as `main` but with fewer restrictions for faster development:**

```
Branch name pattern: develop

Required Status Checks:
  ☑ security-scan
  ☑ lint
  ☑ test
  ☑ build
  ☑ e2e
  ☑ ci-status

Pull Request Requirements:
  ☑ Require a pull request (1 approval)
  ☑ Require status checks to pass
  ☑ Require branches to be up to date

Allow:
  ☐ Include administrators (allow auto-merge for faster iteration)
```

---

## Visual Example: Main Branch Settings

```
Settings > Branches > Branch Protection Rules

┌─────────────────────────────────────────────────────────────┐
│ Branch name pattern                                         │
│ [main▼]                                                     │
└─────────────────────────────────────────────────────────────┘

┌─ Pull Requests ─────────────────────────────────────────────┐
│ ☑ Require a pull request before merging                    │
│   □ Require approvals             Approvals required: [1]  │
│   ☑ Dismiss stale pull request approvals when new commits  │
│   ☑ Require approval of the latest reviewable commit       │
│ ☑ Require conversation resolution before merging           │
└─────────────────────────────────────────────────────────────┘

┌─ Status Checks ─────────────────────────────────────────────┐
│ ☑ Require branches to be up to date before merging          │
│ ☑ Require status checks to pass before merging             │
│                                                             │
│ Search for status checks:                                   │
│ [_________________________________]                        │
│                                                             │
│ Required status checks:                                     │
│ ☑ security-scan                                             │
│ ☑ lint                                                      │
│ ☑ test                                                      │
│ ☑ build                                                     │
│ ☑ e2e                                                       │
│ ☑ ci-status                                                 │
└─────────────────────────────────────────────────────────────┘

┌─ Security ──────────────────────────────────────────────────┐
│ ☑ Require signed commits                                   │
│ ☑ Require code reviews from code owners                    │
│   Approvals required: [1]                                  │
│   Dismiss stale pull request approvals when new commits:   │
│   ☑ Checked                                                 │
└─────────────────────────────────────────────────────────────┘

┌─ Other ─────────────────────────────────────────────────────┐
│ ☑ Include administrators                                   │
│   → Rules apply to admin users too                         │
│ ☑ Restrict who can push to matching branches              │
│   → Only specified users/teams can force push              │
│ ☑ Allow force pushes                                       │
│   ○ Do not allow force pushes                              │
│   ● Allow force pushes: Only allow specifying actors       │
│ ☑ Allow deletions                                          │
│   ○ Do not allow deletions                                 │
└─────────────────────────────────────────────────────────────┘

[Create] [Cancel]
```

---

## What Happens When Rules Are Enforced

### PR Fails CI/CD
```
Pull Request: Fix: Update calculator logic

❌ Checks failed (1 of 6)
  ✅ security-scan passed
  ✅ lint passed
  ❌ test failed - TypeError in calculateCosts()
  ⏳ build pending
  ⏳ e2e pending
  ⏳ ci-status pending

[Cannot be merged]

Merge button: Grayed out
Message: "1 required status check is failing"

Before you can merge:
1. Fix the failing test
2. Push the fix
3. Wait for CI to re-run
4. Once all checks pass → Merge button available
```

### PR Passes All Checks
```
Pull Request: Fix: Update calculator logic

✅ All checks have passed (6 of 6)
  ✅ security-scan passed
  ✅ lint passed
  ✅ test passed
  ✅ build passed
  ✅ e2e passed
  ✅ ci-status passed

✅ All required reviews have been approved (1 of 1)

[Merge pull request▼]  [Squash and merge]  [Rebase and merge]

Merge button: Available and active
```

---

## Troubleshooting

### "Cannot find status check"
**Solution:** The check hasn't run yet
- Ensure `.github/workflows/ci.yml` exists
- Make sure the job name matches exactly
- Re-run workflow from GitHub Actions tab

### "Can't merge despite passing checks"
**Possible reasons:**
1. Branch is behind `main` → Click "Update branch"
2. Waiting for additional approvals → Get more reviews
3. Conversation unresolved → Resolve all comments

### "Need to bypass rules for emergency"
**Procedure:**
1. **Do NOT use force push** (builds in history corruption)
2. **Request exception from repo admin**
3. **Or: Create hotfix branch from commit, merge directly** (emergency only)

---

## Code Owners (Optional)

Create `.github/CODEOWNERS` file:

```
# Require review from @username for certain files

# All files
* @username

# Security-related files
src/utils/sanitizer.js @security-team
src/utils/sentry.js @security-team
.github/workflows/ci.yml @devops-team

# Configuration files
vercel.json @devops-team
package.json @devops-team
```

Benefits:
- Auto-assigns reviewers based on changed files
- Ensures security team reviews security files
- Enforces expertise-based reviews

---

## Monitoring Branch Protection

**GitHub Actions Status:**
```
Repository → Actions tab

View all workflow runs:
  - Filter by branch
  - Filter by status (failed/passing)
  - Click run to see details
  - Re-run failed jobs if needed
```

**Protected Branches Dashboard:**
```
Settings → Branches

Shows:
  ☐ main (Protected) - 6 status checks required
  ☐ develop (Protected) - 6 status checks required
  ☐ feature/* (Unprotected)
```

---

## Best Practices

### 1. Keep CI Fast
- Run fast checks first (lint, security)
- Parallelize independent jobs (unit tests, build)
- Run E2E tests in parallel browsers
- **Target:** Full pipeline < 5 minutes

### 2. Meaningful PR Titles
```
Good:
  fix: Update calculator cost calculation
  feat: Add exact usage API integration
  chore: Update dependencies

Avoid:
  Update files
  Fix bug
  Changes
```

### 3. Require PR Reviews
- At least 1 approval before merge
- More for security-critical code
- Use Code Owners for auto-assignment

### 4. Regular Cleanup
- Delete merged branches
- Close stale PRs
- Archive old branches

### 5. Emergency Bypass (Rare)
```
If absolutely critical:
  1. Document the reason
  2. Get admin approval
  3. Bypass rule only for that PR
  4. Add follow-up fix PR
  5. Review failure in retrospective
```

---

## Summary

**This setup ensures:**
- ✅ All code is tested before merge
- ✅ Security issues are caught early
- ✅ Build artifacts are verified
- ✅ E2E tests pass across browsers
- ✅ No failed CI/CD reaches production
- ✅ Prevents "oops" merges
- ✅ Maintains code quality
- ✅ Enforces team standards

**Result:** Confident deployments with zero unexpected failures

---

Generated: November 30, 2025  
Status: Ready to implement ✅
