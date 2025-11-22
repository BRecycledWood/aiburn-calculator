# AIBurn - Ready to Launch (Nov 22, 2025)

## ✅ Completed Today
- Integrated custom AIBurn logos (header, footer, favicon)
- Updated contact email to `contact@aiburn.howstud.io`
- Added social sharing meta tags (OG, Twitter)
- Verified build passes (68.13 KB gzipped)
- Git repository initialized with all changes

## 🚀 Next Steps (2-3 hours remaining)

### Step 1: Push to GitHub (5 mins)
```bash
# Create GitHub repo at github.com/howstudio-bw/aiburn-cost-calculator
# Then:
git remote add origin https://github.com/howstudio-bw/aiburn-cost-calculator.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel (10 mins)
1. Go to vercel.com
2. Import project from GitHub
3. Configure build settings (should auto-detect Vite)
4. Set environment variables if needed

### Step 3: Testing Before Deploy (30 mins)

**Quick Smoke Tests:**
```bash
npm run dev  # Start local server
# Test in http://localhost:5173/

# Test checklist:
- [ ] Header logo displays correctly
- [ ] Footer logo + "Built by HowStudios" link works
- [ ] Calculator loads without errors
- [ ] Quick Calculator mode works (select model, adjust slider)
- [ ] "Share on X" button works (opens Twitter intent)
- [ ] "Download Report" button downloads PNG
- [ ] Mobile responsive (test in DevTools)
```

### Step 4: Deploy to Vercel (5 mins)
Once GitHub is connected, push to `main` and Vercel auto-deploys.

### Step 5: Post-Deploy Verification (30 mins)
1. Visit staging URL from Vercel
2. Run same smoke tests as Step 3
3. Check https://securityheaders.com/
4. Run Lighthouse audit

### Step 6: Custom Domain Setup (varies)
```
Domain: aiburn.howstud.io (or custom)
- Add to Vercel Project Settings → Domains
- Update DNS records (Vercel will provide CNAME/NS)
- Wait 5-48 hours for propagation
```

### Step 7: Production Launch (20 mins)
1. Verify staging passes all tests
2. Map custom domain to production
3. Test live site at https://aiburn.howstud.io
4. Monitor error logs for 48 hours

---

## 📊 Current Status Summary

| Component | Status | Last Updated |
|-----------|--------|---|
| **App Build** | ✅ PASSING | Nov 22 |
| **Logo Integration** | ✅ COMPLETE | Nov 22 |
| **Security** | ✅ HARDENED | Nov 17 |
| **Testing** | ⏳ READY | Nov 22 |
| **GitHub** | ⏳ PENDING | - |
| **Vercel Deploy** | ⏳ PENDING | - |
| **Custom Domain** | ⏳ PENDING | - |

---

## 📋 Launch Checklist Summary

### Before Pushing
- [x] Build succeeds (`npm run build`)
- [x] Dev server runs (`npm run dev`)
- [x] Custom logos integrated
- [x] Email addresses updated
- [x] Git initialized

### Before Vercel Deploy
- [ ] GitHub repo created and pushed
- [ ] Vercel project imported from GitHub
- [ ] Local smoke tests pass

### Before Production
- [ ] Staging build verified
- [ ] Staging smoke tests pass
- [ ] Security headers verified
- [ ] Lighthouse score checked
- [ ] Custom domain configured

### After Production
- [ ] Production smoke tests pass
- [ ] Monitor logs for 48 hours
- [ ] Announce to team/users

---

## 🎯 Time Breakdown

| Task | Est. Time | Status |
|------|-----------|--------|
| Push to GitHub | 5 min | ⏳ |
| Vercel setup | 10 min | ⏳ |
| Local testing | 30 min | ⏳ |
| Deploy | 5 min | ⏳ |
| Staging test | 30 min | ⏳ |
| Domain setup | 15-30 min | ⏳ |
| Production launch | 20 min | ⏳ |
| **TOTAL** | **115-130 min** | ⏳ |

**Can be compressed to 2-3 hours if domain is pre-configured.**

---

## 💡 Pro Tips

1. **Test locally first** - Always smoke test on `localhost:5173` before pushing
2. **Use incognito window** - Clear cache issues with Ctrl+Shift+Delete
3. **Check logs early** - Vercel → Analytics → Deployments for any build issues
4. **Monitor 48 hours** - Check error logs every few hours after launch
5. **Rollback ready** - Have `git revert HEAD` command ready if critical issues

---

## 📞 Emergency Contacts

If deploy fails:
1. Check Vercel build logs (will show specific error)
2. Check GitHub Actions CI/CD logs
3. Verify environment variables are set
4. Rollback: `git revert HEAD && git push`

---

## ✨ Next Phase (Post-Launch)

**After successful launch and 48-hour monitoring:**
- [ ] Announce on social media
- [ ] Send launch email to users
- [ ] Set up analytics (Plausible/Fathom)
- [ ] Plan Phase 2 features (dynamic price updates, Anthropic API)

---

**Ready to ship? Let's go! 🚀**
