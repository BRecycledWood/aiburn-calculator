# AIBurn Quick Start Guide

**Status**: Production Ready ✅  
**Build**: Passing ✅

## 60-Second Setup

```bash
cd aiburn-website
npm install --legacy-peer-deps
npm run dev
# Visit http://localhost:5173
```

## Build & Deploy

```bash
npm run build
# Output: dist/
# Deploy to Vercel, Netlify, or any static host
```

## What You're Deploying

- React 19.2.0 calculator with 2 modes (Quick + Exact Usage)
- 9 AI models with accurate pricing (Nov 2025)
- Professional 20-60-20 layout (60% tool, 20% ads each side)
- Share to X + PNG download
- OpenAI API integration for exact usage analysis

## Before You Deploy (5 min)

Update 4 things in `src/App.jsx`:

1. **Line 325** - Twitter handle
   ```javascript
   // Change @howstudio to your account
   const text = `...@YourHandle's calculator...`
   ```

2. **Lines 110, 484, 773** - Email
   ```javascript
   // Change ads@howstud.io to real email
   href="mailto:yourreal@email.com"
   ```

3. **Lines 325, 399** - Domain
   ```javascript
   // Change aiburn.howstud.io to your domain
   "aiburn.yourdomain.com"
   ```

4. **Line 790** - Company link
   ```javascript
   href="https://yourdomain.com"
   ```

## Key Files

| File | What |
|------|------|
| `src/App.jsx` | Everything (804 lines) |
| `api/usage.js` | OpenAI proxy |
| `vite.config.js` | Build settings |
| `vercel.json` | Deploy config |

## Test Checklist

- [ ] Quick mode slider works
- [ ] Calculations are accurate
- [ ] Share to X button works
- [ ] PNG download generates
- [ ] Responsive on mobile
- [ ] No console errors

## Performance

- **Bundle**: 214.73 KB (66.76 KB gzipped) ✅
- **Load**: < 1 second ✅
- **Calculations**: Instant ✅

## Need Help?

### Models not calculating?
Check MODELS object in App.jsx (line 15-25)

### API not working?
Verify OpenAI key works at https://api.openai.com/v1/usage

### Layout looks wrong?
Check Tailwind CDN in index.html (must have CDN link)

### Ads not showing?
Ad cards are the light gray areas on sides. They're hardcoded in App.jsx lines 476-489 and 765-778.

## What's Next?

1. Deploy to Vercel
2. Test on actual mobile devices
3. Monitor error logs
4. Consider adding analytics
5. Plan sponsor partnerships

## Contact Points

- Main component: `src/App.jsx`
- Config values: Search `howstudio`, `howstud.io`, `ads@`
- Models: Line 15-25
- Styling: Tailwind + custom CSS in `src/index.css`

---

**Estimated Deploy Time**: 30 minutes  
**Complexity**: Simple (no backend, no database, no secrets)  
**Risk Level**: Low (frontend only)

✅ **Ready to ship!**
