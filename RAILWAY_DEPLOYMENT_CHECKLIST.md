# Railway Backend Deployment Checklist

## ✅ Phase 1: Code Fixes (COMPLETED)

### Fixed Issues
- [x] **Module Import Errors** - Fixed server.js to import correct files
  - Changed `./agents/chat.js` → Created `./routes/chat.js` wrapper for `chat-v3.mjs`
  - Removed `test-chat.js` import (not a route module)
  
- [x] **Route Organization** - Created clean Express router structure
  - `api/routes/chat.js` - Chat endpoint wrapper
  - `api/routes/dashboard.js` - Dashboard statistics
  - `api/routes/billing.js` - Billing history
  - `api/routes/pt.js` - PT usage, estimation, throttle checking
  - `api/routes/subscription.js` - Current subscription details

- [x] **Export Mismatches** - Fixed function import names
  - `check-throttles.js` now uses `getThrottleStatusSummary` instead of non-existent `checkThrottles`

- [x] **Local Testing** - Server starts successfully
  ```
  🚀 DHStx API Server running on port 3001
  📍 Environment: development
  🔗 Frontend URL: http://localhost:5173
  ✅ Server ready to accept connections
  ```

- [x] **Git Commit & Push** - Changes pushed to GitHub
  - Commit: `1b176ac` - "Fix Railway deployment: correct module imports and add route wrappers"
  - Railway will auto-detect and redeploy

---

## ⏳ Phase 2: Railway Deployment (IN PROGRESS)

### Railway Configuration (Already Set)
- [x] Project created: `dhstx-backend-api`
- [x] Connected to GitHub: `dhstx/productpage`
- [x] Root directory: `/api`
- [x] Start command: `npm start` (runs `node server.js`)
- [x] Build command: `npm install`

### Environment Variables (Already Added - 14 total)

**Supabase:**
- [x] `SUPABASE_URL` = `https://zhxkbnmtwqipgavmjymi.supabase.co`
- [x] `SUPABASE_SERVICE_KEY` = `[REDACTED]`
- [x] `SUPABASE_ANON_KEY` = `[REDACTED]`

**AI APIs:**
- [x] `ANTHROPIC_API_KEY` = `[REDACTED]`
- [x] `OPENAI_API_KEY` = `[REDACTED]`

**Stripe:**
- [x] `STRIPE_SECRET_KEY` = `[REDACTED]`
- [x] `STRIPE_PUBLISHABLE_KEY` = `[REDACTED]`
- [x] `STRIPE_WEBHOOK_SECRET` = `[REDACTED]`

**Application:**
- [x] `FRONTEND_URL` = `https://dhstx.co`
- [x] `NODE_ENV` = `production`
- [x] `PORT` = `3001` (Railway will override with $PORT)
- [x] `API_PORT` = `3001`
- [x] `JWT_SECRET` = `[REDACTED]`
- [x] `SESSION_SECRET` = `[REDACTED]`

### Expected Deployment Flow
1. ✅ GitHub push detected by Railway
2. ⏳ Railway pulls latest code from `main` branch
3. ⏳ Railway runs `npm install` in `/api` directory
4. ⏳ Railway runs `npm start` (executes `node server.js`)
5. ⏳ Server starts on Railway-assigned port
6. ⏳ Health check endpoint `/health` responds with 200 OK
7. ⏳ Railway assigns public URL (e.g., `https://dhstx-backend-api-production.up.railway.app`)

### Verification Steps (To Do After Deployment)
- [ ] Check Railway deployment logs for successful startup
- [ ] Test health endpoint: `GET https://[railway-url]/health`
- [ ] Test API root: `GET https://[railway-url]/`
- [ ] Verify CORS allows requests from `https://dhstx.co`
- [ ] Test authenticated endpoint (requires valid JWT)
- [ ] Monitor Railway metrics (CPU, memory, response times)

---

## 🔄 Phase 3: Frontend Integration (NEXT)

### Update Vercel Environment Variables
Once Railway URL is available:
- [ ] Add `VITE_API_URL` = `https://[railway-url]` to Vercel project
- [ ] Redeploy frontend on Vercel to pick up new env var

### Test End-to-End Flow
- [ ] Login at https://dhstx.co
- [ ] Check dashboard loads (calls `/api/dashboard/stats`)
- [ ] Check PT usage displays (calls `/api/pt/usage`)
- [ ] Test AI chat (calls `/api/chat`)
- [ ] Verify billing page (calls `/api/billing/history`)
- [ ] Test subscription management

---

## 🐛 Troubleshooting Guide

### If Deployment Still Fails

**Error: "Cannot find module"**
- Check Railway build logs for exact missing module
- Verify `package.json` includes the dependency
- Ensure `type: "module"` is set for ES modules

**Error: "Port already in use"**
- Railway assigns port via `$PORT` env var
- Server.js already handles this: `process.env.PORT || 3001`

**Error: "supabaseKey is required"**
- Verify `SUPABASE_SERVICE_KEY` is set in Railway env vars
- Check env var name matches exactly (case-sensitive)

**Error: "CORS policy blocked"**
- Verify `FRONTEND_URL` env var is set to `https://dhstx.co`
- Check server.js CORS config includes the frontend URL

**Error: "Health check failed"**
- Railway expects `/health` endpoint to return 200 OK
- Server.js already has this endpoint implemented

### Railway Deployment Logs Location
1. Go to https://railway.app
2. Select `dhstx-backend-api` project
3. Click on the service
4. View "Deployments" tab
5. Click on latest deployment
6. View "Build Logs" and "Deploy Logs"

---

## 📊 Expected Deployment Outcome

### Success Indicators
✅ Build completes without errors  
✅ Server starts and logs "Server ready to accept connections"  
✅ Health endpoint returns 200 OK  
✅ Railway assigns public URL  
✅ No crashes or restarts in first 5 minutes  

### Performance Targets
- **Cold start:** < 3 seconds
- **Response time:** < 200ms for health check
- **Memory usage:** < 256 MB idle
- **CPU usage:** < 5% idle

### Cost Estimate
- **Railway Starter Plan:** $5/month (500 hours included)
- **Expected usage:** ~730 hours/month (always-on)
- **Overage cost:** $0.000231/minute = ~$10/month for 24/7
- **Total:** ~$15/month for Railway backend

---

## 🎯 Next Actions

1. **Check Railway Dashboard** (Manual)
   - Go to https://railway.app
   - Verify deployment succeeded
   - Copy the public URL

2. **Update Frontend** (Automated)
   - Add Railway URL to Vercel env vars
   - Trigger Vercel redeploy

3. **Test Integration** (Manual)
   - Login to https://dhstx.co
   - Test all features
   - Monitor for errors

4. **Update Documentation** (Automated)
   - Record Railway URL
   - Update deployment guide
   - Create final status report

---

## 📝 Deployment Timeline

- **2024-10-23 17:00** - Fixed module imports and pushed to GitHub
- **2024-10-23 17:05** - Railway auto-deployment triggered
- **2024-10-23 17:10** - Expected: Deployment completes
- **2024-10-23 17:15** - Expected: Frontend updated with Railway URL
- **2024-10-23 17:20** - Expected: Full system operational

---

## 🔗 Important Links

- **GitHub Repo:** https://github.com/dhstx/productpage
- **Frontend (Vercel):** https://dhstx.co
- **Backend (Railway):** [To be added after deployment]
- **Supabase Dashboard:** https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi
- **Stripe Dashboard:** https://dashboard.stripe.com

---

**Status:** ✅ Code fixes complete, ⏳ waiting for Railway deployment to finish

