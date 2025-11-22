# AIBurn - Final Deployment Guide

## 🎯 Current Status: READY TO DEPLOY (Nov 22, 2025)

**Completed Today:**
- ✅ Custom AIBurn logos integrated (header/footer/favicon)
- ✅ Contact email updated: `contact@aiburn.howstud.io`
- ✅ Social sharing meta tags configured
- ✅ Build verified (68.13 KB gzipped, 0 errors)
- ✅ Git repository initialized

---

## 🚀 Deployment Steps (2-3 hours)

### Phase 1: GitHub & Vercel Setup (15 minutes)

#### 1.1 Create GitHub Repository
```bash
# Go to https://github.com/new
# Create: aiburn-cost-calculator
# Private repo (optional)

# In project root:
git remote add origin https://github.com/YOUR_ORG/aiburn-cost-calculator.git
git branch -M main
git push -u origin main
```

#### 1.2 Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub → Select repository
4. Framework: Vite (auto-detected)
5. Root Directory: `./aiburn-website`
6. Click "Deploy"

**Wait for build to complete (2-3 mins)**

---

### Phase 2: Testing (45 minutes)

#### 2.1 Local Smoke Test (15 mins)
```bash
cd aiburn-website

# Start dev server
npm run dev
# Visit http://localhost:5173

# Test:
✓ Logo displays in header (custom image)
✓ Logo displays in footer (custom icon)
✓ Quick Calculator works
✓ Model selection works
✓ Token slider adjusts values
✓ Share on X button opens Twitter
✓ Download Report saves PNG
✓ No console errors
✓ Responsive on mobile (DevTools)
```

#### 2.2 Staging Test (15 mins)
```
URL: https://aiburn-cost-calculator-xxxxx.vercel.app
(from Vercel preview URL)

Run same tests as Local Smoke Test above
```

#### 2.3 Security & Performance (15 mins)
```
1. Security Headers Check:
   - Visit: https://securityheaders.com/
   - Enter staging URL
   - Should show security headers

2. Lighthouse Audit (Chrome DevTools):
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
```

---

### Phase 3: Custom Domain Setup (optional, 15-30 mins)

#### 3.1 Configure Domain in Vercel
1. Go to Vercel Project Settings → Domains
2. Add domain: `aiburn.howstud.io`
3. Vercel shows CNAME record to add
4. Update DNS at domain registrar

#### 3.2 Verify DNS (5-10 mins)
```bash
# After updating DNS records:
nslookup aiburn.howstud.io
# Should resolve to Vercel IP

# Or in browser:
# Visit https://aiburn.howstud.io
# Should load (might take 5-48 hours to propagate)
```

---

### Phase 4: Production Launch (15 minutes)

#### 4.1 Final Verification
- [ ] Staging tests all pass
- [ ] Security headers verified
- [ ] Lighthouse scores 90+
- [ ] Custom domain configured (if using one)
- [ ] Git pushed to main

#### 4.2 Deploy to Production
```bash
# Push to GitHub main branch:
git push origin main

# Vercel auto-deploys when GitHub push detected
# Or manually deploy in Vercel dashboard

# Wait for "READY" status (green checkmark)
```

#### 4.3 Test Production URL
```
URL: https://aiburn.howstud.io (or custom domain)

Run quick smoke test:
✓ Logo displays
✓ Calculator loads
✓ One calculation works
✓ No console errors
```

---

### Phase 5: Post-Deployment Monitoring (48 hours)

#### 5.1 First 24 Hours
- Check error logs every 2-3 hours in Vercel dashboard
- Watch for JavaScript errors
- Monitor API response times
- No critical issues = good!

#### 5.2 Critical Issues Handling
If critical issue found:
```bash
# Quick rollback:
git revert HEAD
git push origin main
# Vercel redeploys previous version (5 mins)
```

---

## 📋 Complete Checklist

### Before GitHub Push
- [x] Build passes: `npm run build`
- [x] Dev server works: `npm run dev`
- [x] Logos integrated
- [x] Email updated
- [x] Git initialized

### Before Vercel Deploy
- [ ] GitHub repo created
- [ ] Code pushed to main
- [ ] Vercel imported from GitHub

### Before Custom Domain
- [ ] Staging tests pass
- [ ] Security verified
- [ ] Lighthouse good
- [ ] Domain registrar access

### Before Production
- [ ] GitHub/Vercel sync working
- [ ] Staging fully tested
- [ ] Team approval obtained
- [ ] Monitoring plan in place

### After Production Live
- [ ] Production tests pass
- [ ] Monitor logs first 24h
- [ ] Monitor logs second 24h
- [ ] Update team/users

---

## 🔧 Troubleshooting

### Build Fails on Vercel
1. Check Vercel build logs for error message
2. Reproduce locally: `npm run build`
3. Fix locally, push to GitHub
4. Vercel auto-rebuilds

### Site Shows Old Version
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache in DevTools
- Or use incognito window

### Styling Issues
1. Check that Tailwind CSS is loaded
2. Check browser DevTools for CSS errors
3. Run `npm install` to ensure dependencies
4. Rebuild: `npm run build`

### Logo Not Showing
1. Check `/public/images/logo-*.png` files exist
2. Check HTML src path: `/images/logo-full.png`
3. Check browser Network tab for 404s
4. Verify files were pushed to GitHub

### API Errors
1. Check that `/api/usage.js` exists
2. Check Vercel function logs
3. Verify OpenAI API key is valid (if testing)
4. Check CORS headers in response

---

## 🎯 Success Criteria

**Deployment is successful if:**
- ✅ Site loads at production URL
- ✅ Calculator works (Quick mode)
- ✅ Logo displays correctly
- ✅ No console JavaScript errors
- ✅ No 500 errors in Vercel logs
- ✅ Security headers present
- ✅ Performance acceptable

**Deployment is NOT successful if:**
- ❌ Build fails on Vercel
- ❌ Site gives 500 error
- ❌ Unhandled JavaScript exceptions
- ❌ API key exposed in errors
- ❌ Logo/styling broken

---

## 📞 Quick Reference

### Important URLs
- **Staging:** https://aiburn-cost-calculator-xxxxx.vercel.app
- **Production:** https://aiburn.howstud.io (after domain setup)
- **GitHub:** https://github.com/YOUR_ORG/aiburn-cost-calculator
- **Vercel Dashboard:** https://vercel.com/dashboard

### Important Files
- **App Code:** `aiburn-website/src/App.jsx` (804 lines)
- **Config:** `aiburn-website/vercel.json`
- **API:** `aiburn-website/api/usage.js`
- **Index:** `aiburn-website/index.html`
- **Logos:** `aiburn-website/public/images/*.png`

### Build Info
- **Size:** 214.73 KB total, 68.13 KB gzipped
- **Time:** ~800ms
- **Framework:** Vite 7.2.2
- **Library:** React 19.2.0
- **Styling:** Tailwind CSS 3
- **Hosting:** Vercel Serverless

---

## 🎉 Post-Launch

### Immediately After Launch
1. Announce to team
2. Share on social media
3. Send to early users
4. Monitor for 48 hours

### Within 1 Week
1. Collect user feedback
2. Monitor error logs daily
3. Plan Phase 2 features

### Phase 2 (December 2025)
- [ ] Dynamic price updates (GitHub Actions scheduled)
- [ ] Anthropic API support (when public API available)
- [ ] Analytics integration (Plausible/Fathom)
- [ ] User accounts (optional)

---

## ✨ Key Files Overview

| File | Purpose | Status |
|------|---------|--------|
| `App.jsx` | Main React component | ✅ Complete |
| `vercel.json` | Deployment config | ✅ Complete |
| `api/usage.js` | OpenAI API handler | ✅ Complete |
| `public/images/` | Logos & assets | ✅ Complete |
| `index.html` | HTML with meta tags | ✅ Complete |
| `package.json` | Dependencies | ✅ Complete |

---

## 🚀 Ready? Let's Launch!

**Estimated time remaining:** 2-3 hours  
**Difficulty:** Low (mostly waiting for builds)  
**Risk:** Very Low (all changes tested locally)

**Next step:** Push to GitHub! 🎯
