# Legacy HTML Pages Archive

**Date/Time:** November 23, 2025 - 20:30 UTC  
**Status:** DEPRECATED - All pages have been migrated to React components

---

## About This Folder

This folder contains HTML versions of pages that have been converted to React components and integrated into the main application via React Router.

## Pages in This Folder

### privacy.html
- **Status:** DEPRECATED
- **Migrated To:** `src/components/PrivacyPage.jsx`
- **Route:** `/privacy`
- **Keep for:** Reference during development
- **Can Delete:** Yes, after confirming React version works correctly

### terms.html
- **Status:** DEPRECATED
- **Migrated To:** `src/components/TermsPage.jsx`
- **Route:** `/terms`
- **Keep for:** Reference during development
- **Can Delete:** Yes, after confirming React version works correctly

---

## Why We're Keeping These Files

1. **Backup Reference** - If you need to check original formatting
2. **Comparison** - Quick way to see what changed during migration
3. **Archive** - Historical record of the old architecture

---

## When to Delete These Files

You can safely delete `privacy.html` and `terms.html` when:
- ✅ React components are tested and working
- ✅ All routes are properly configured
- ✅ No external links point to `/pages/` paths
- ✅ Team agrees migration is complete

**Recommended:** Delete after first production deployment succeeds.

---

## Migration Details

**Date Migrated:** November 23, 2025  
**Migrated By:** Amp AI Agent  
**Reason:** Architecture cleanup - consolidating all pages into React SPA

**What Changed:**
- Pure HTML → React components
- Static `/pages/` paths → React Router routes
- Removed inline CSS → Tailwind classes
- Header/footer regenerated → Consistent with app

---

## How These Were Moved

The original content was preserved and re-implemented using:
- React functional components
- Tailwind CSS for styling (matching app theme)
- React Router for navigation
- Consistent header/footer with main app

No content was lost. All information from these HTML files is now in the React components.

---

**Archive Created:** November 23, 2025 - 20:30 UTC
