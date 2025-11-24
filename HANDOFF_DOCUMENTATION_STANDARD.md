# Handoff & Documentation Standard for AIBurn

**Established:** November 23, 2025 - 20:30 UTC  
**Version:** 1.0  
**Purpose:** Define how to create, update, and maintain project documentation for continuity and auditability

---

## 📋 Overview

This standard ensures that all project documentation maintains a clear history of changes. When updating existing files, always add new information at the top with timestamps, preserving the complete change history below. This creates an auditable timeline anyone can review.

---

## 🎯 Core Principle

**"New at top, old at bottom"** - Every documented change tells a story of project evolution.

---

## 📝 Documentation File Structure

### For New Files
```markdown
# [Document Title]

---

## 📋 LATEST UPDATE - [Phase/Feature Name]
**Date/Time:** [DATE] - [TIME] UTC  
**Status:** ✅ [COMPLETE/IN-PROGRESS]  
**What Changed:** [Brief description]  
**Files Modified:** [List]  
**Build Status:** ✅ PASSING (if applicable)

### Changes Made This Session:
1. ✅ [Change 1]
2. ✅ [Change 2]
3. ⚠️ [Warning]

---

## [SECTION FOR THIS UPDATE]

[Content here]

---

## 📚 VERSION HISTORY

### [Previous Update]
**Date/Time:** [DATE] - [TIME] UTC  
**Status:** ✅ COMPLETE

[Historical content here]
```

---

## ✍️ Versioning Standards

### Date/Time Format
Always use: `Month DD, YYYY - HH:MM UTC`

**Example:** `November 23, 2025 - 20:30 UTC`

### Status Indicators
- ✅ COMPLETE - Work is finished and tested
- 🟡 IN-PROGRESS - Work is ongoing
- ⚠️ WARNING - Important note for next person
- ❌ BLOCKED - Something is preventing progress

### File Modification Notation
When updating files, note them clearly:
```
- ✅ NEW: `src/new-file.jsx` (brand new component)
- ✅ UPDATED: `src/App.jsx` (modified existing code)
- ⚠️ DEPRECATED: `old-file.html` (no longer used)
- ❌ DELETED: `unused-code.js` (removed entirely)
```

---

## 📊 What to Document

### For Every Major Update, Include:

1. **LATEST UPDATE Section (at top)**
   - Date/Time stamp
   - Status
   - Summary of what changed
   - Files affected
   - Build/test status

2. **VERSION HISTORY Section (below)**
   - Complete historical record
   - Organized chronologically (newest first after the latest update)
   - Allows anyone to see full evolution

3. **Key Details to Capture**
   - What was changed and why
   - Which files were created, updated, deprecated, or deleted
   - Build output and test results
   - Any warnings for the next person
   - Links to related documentation

---

## 🔄 Update Workflow

### Step 1: Add "LATEST UPDATE" Section
Create a new section at the very top (after title) with:
- Date/time stamp
- Brief summary
- Status
- Files changed
- Build status

### Step 2: Keep Previous Content
Move older updates to "VERSION HISTORY" section below, organized by date (newest first)

### Step 3: Include Context
Always explain:
- Why the change was needed
- What the next person should know
- Any gotchas or warnings

### Example Update

**Before (Original File):**
```markdown
# My Document

This is the original content...
```

**After (Updated File):**
```markdown
# My Document

---

## 📋 LATEST UPDATE - Feature X Complete
**Date/Time:** November 23, 2025 - 20:45 UTC  
**Status:** ✅ COMPLETE  
**What Changed:** Integrated Feature X into main app  
**Files Modified:** App.jsx, components/FeatureX.jsx  
**Build Status:** ✅ PASSING

### Changes Made This Session:
1. ✅ Created FeatureX component
2. ✅ Added /feature-x route
3. ✅ Updated footer links

**Important Note:** Configure form submission service in `.env` before deploying.

---

## 📚 VERSION HISTORY

### Previous Work - Initial Setup
**Date/Time:** November 22, 2025 - 15:30 UTC  
**Status:** ✅ COMPLETE

This is the original content from before...
```

---

## 📄 File Categories & How to Update Each

### Type 1: Status/Report Files
**Examples:** `_STATUS.md`, `CLEANUP_REPORT.md`, `PROJECT_DASHBOARD.md`

**Update Pattern:**
- Add "LATEST UPDATE" section at top
- Include what changed, files affected, build status
- Move old status to "VERSION HISTORY"
- Keep complete history for auditability

### Type 2: Process/How-To Files
**Examples:** `_HOWTO_SHIP.md`, `_DEPLOYMENT_CHECKLIST.md`

**Update Pattern:**
- Add "UPDATED" note at top showing what changed
- Mark sections with date if modified
- Preserve old procedures in comment blocks
- Include migration instructions if process changed

### Type 3: Reference Files
**Examples:** `_INVENTORY.md`, `_LEDGER.md`, `README.md`

**Update Pattern:**
- Add "Last Updated" timestamp
- Maintain "CHANGES" section showing recent updates
- Keep changelog entries organized by date
- Use status badges for current vs. deprecated info

### Type 4: Code Files (JSX, JS, etc.)
**Examples:** `App.jsx`, `components/AdvertisePage.jsx`

**Update Pattern:**
- Add comment block at top with update info:
```javascript
/**
 * LAST UPDATED: November 23, 2025 - 20:28 UTC
 * CHANGES:
 * - Added route for /privacy page
 * - Updated footer links to use React Router
 * 
 * HISTORY:
 * - Nov 20: Initial implementation
 * - Nov 21: Added security headers
 * - Nov 23: Routing refactor complete
 */
```

---

## ⚠️ Important Guidelines

### DO:
✅ Use consistent date/time format  
✅ Always include reason for changes  
✅ Note any breaking changes  
✅ Test before documenting  
✅ Link related documentation  
✅ Be specific ("Updated routes" not "Changed stuff")  
✅ Keep old content for reference  

### DON'T:
❌ Delete historical information  
❌ Bury updates at bottom of file  
❌ Use inconsistent timestamps  
❌ Vague descriptions  
❌ Break links when updating  
❌ Lose context about decisions  
❌ Update files without recording why  

---

## 🎓 Examples from AIBurn Project

### Example 1: CLEANUP_REPORT.md
```markdown
# AIBurn Project Cleanup Report

---

## 📋 LATEST UPDATE - Phase 2 Complete ✅
**Date/Time:** November 23, 2025 - 20:28 UTC  
**Status:** ✅ PHASE 2 CLEANUP COMPLETE  
**What Changed:** Converted Privacy & Terms pages to React components
**Files Modified:** App.jsx, AdvertisePage.jsx, 2 new components
**Build Status:** ✅ PASSING

### Changes Made:
1. ✅ Created PrivacyPage.jsx
2. ✅ Created TermsPage.jsx
3. ✅ Updated routes in App.jsx

---

## 📚 VERSION HISTORY

### Phase 1: Advertise Page Integration  
**Date/Time:** November 23, 2025 - 20:15 UTC
...
```

### Example 2: Code File Comment
```javascript
/**
 * LAST UPDATED: November 23, 2025 - 20:28 UTC
 * 
 * CHANGES:
 * - Moved routes from separate files to centralized Router
 * - Added PrivacyPage and TermsPage components
 * - Updated footer links to use React Router paths
 * 
 * NOTE: vercel.json needs SPA rewrites for proper routing
 * 
 * HISTORY:
 * Nov 23: Completed Phase 2 - Legal pages integration
 * Nov 20: Phase 1 - Added AdvertisePage component
 * Nov 15: Initial React setup with Vite
 */
```

---

## 🚀 Deploying with Documentation

Before deploying, ensure:

1. ✅ All documentation updated with date/time stamps
2. ✅ "LATEST UPDATE" section clearly shows what changed
3. ✅ Build status verified and documented
4. ✅ No broken links in documentation
5. ✅ Historical context preserved
6. ✅ Next steps clearly indicated

---

## 📋 Handoff Checklist

When handing off to another developer:

- [ ] All files have "LATEST UPDATE" section
- [ ] Date/time stamps are consistent and current
- [ ] Status indicators clearly show what's done
- [ ] Files affected are all listed
- [ ] Build status documented
- [ ] Known issues or warnings flagged
- [ ] Links to related docs included
- [ ] Next steps clearly documented
- [ ] No critical context is missing
- [ ] README is up-to-date

---

## 🔗 Related Documentation

- See `_STATUS.md` for current project status
- See `CLEANUP_REPORT.md` for structure cleanup timeline
- See `_HOWTO_SHIP.md` for deployment process
- See `_INVENTORY.md` for tech stack details

---

## 📞 Questions?

If you're not sure how to document something:
1. Use "LATEST UPDATE" + "VERSION HISTORY" pattern
2. Add a date/time stamp
3. Explain what changed and why
4. Preserve all old content
5. Test everything works before committing

This approach helps the next person understand not just what changed, but why and when.

---

**Standard Version:** 1.0  
**Established:** November 23, 2025  
**Reviewed & Approved:** [Pending team review]
