# DHStx Final Deployment Guide

## ✅ Completed Steps

### Step 1: Backend Infrastructure ✅
- Express.js API server created
- All endpoints implemented
- Middleware configured

### Step 2: Database Migration ✅
- 6 tables created in Supabase
- Indexes and triggers configured
- Schema verified and working

---

## 🚀 Remaining Steps

### Step 2: Configure Stripe Webhook (5 minutes)

**What:** Set up Stripe to notify your backend when payments occur

**Steps:**

1. **Get your API endpoint URL**
   - Once deployed, your webhook URL will be: `https://your-domain.com/api/stripe/webhook`
   - For local testing: Use Stripe CLI or ngrok

2. **Configure in Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter URL: `https://dhstx.co/api/stripe/webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Click "Add endpoint"

3. **Get Webhook Signing Secret**
   - After creating the endpoint, click on it
   - Copy the "Signing secret" (starts with `whsec_...`)
   - Add to your environment variables:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
     ```

4. **Test the webhook**
   - In Stripe Dashboard, click "Send test webhook"
   - Check your API logs to verify it's received

---

### Step 3: Set Up Google OAuth (10 minutes)

**What:** Enable "Sign in with Google" functionality

**Steps:**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "DHStx Production"
   
4. **Configure OAuth Consent Screen**
   - Add authorized JavaScript origins:
     - `https://dhstx.co`
     - `http://localhost:5173` (for local development)
   - Add authorized redirect URIs:
     - `https://dhstx.co/auth/google/callback`
     - `http://localhost:5173/auth/google/callback`

5. **Get Client ID and Secret**
   - Copy the Client ID
   - Copy the Client Secret
   - Add to environment variables:
     ```
     VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your_client_secret_here
     ```

6. **Update Frontend**
   - The Google OAuth button is already implemented in `/src/pages/Login.jsx`
   - It will automatically use the `VITE_GOOGLE_CLIENT_ID` from env

---

### Step 4: Deploy Backend API (10 minutes)

**Option A: Deploy to Vercel (Recommended)**

1. **Create `vercel.json` in project root:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/server.js",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "api/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/$1"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

2. **Add Environment Variables in Vercel Dashboard:**
   - Go to: https://vercel.com/dhstx/productpage/settings/environment-variables
   - Add all variables from `.env.backend`:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
     - `JWT_SECRET`
     - `GOOGLE_CLIENT_SECRET`
     - `JARVIS_API_KEY`
     - `JARVIS_API_URL`

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Add backend API and deployment config"
   git push origin main
   ```
   - Vercel will automatically deploy

**Option B: Deploy to Railway/Render**

1. **Create account** on Railway.app or Render.com
2. **Connect GitHub repository**
3. **Set environment variables** (same as above)
4. **Deploy** - Platform will auto-detect Node.js app

---

### Step 5: Update Frontend API URLs

**Update `/src/lib/stripe.js` and API calls:**

```javascript
// Change from localhost to production
const API_URL = import.meta.env.VITE_API_URL || 'https://dhstx.co/api';
```

**Add to `.env` file:**
```
VITE_API_URL=https://dhstx.co/api
```

---

### Step 6: Test Everything (10 minutes)

**Test Checklist:**

1. **Authentication**
   - [ ] Register new account with email/password
   - [ ] Login with email/password
   - [ ] Login with Google OAuth
   - [ ] JWT token is stored and used for requests

2. **Subscription Flow**
   - [ ] New user gets free tier automatically
   - [ ] Click "Upgrade Plan" in Settings → Billing
   - [ ] Stripe Checkout opens
   - [ ] Complete test payment (use test card: 4242 4242 4242 4242)
   - [ ] Redirected back to dashboard
   - [ ] Subscription status updates in database
   - [ ] Webhook received and processed

3. **Agent Execution**
   - [ ] Go to Agent Management
   - [ ] Click "Execute" on an agent
   - [ ] Agent executes successfully
   - [ ] Usage is tracked in database
   - [ ] Usage stats update in Settings

4. **Invoice Download**
   - [ ] Go to Settings → Billing → Billing History
   - [ ] Click "Download" on an invoice
   - [ ] PDF downloads successfully

5. **API Keys**
   - [ ] Generate API key in Settings → API Tokens
   - [ ] Use API key to make authenticated request
   - [ ] API key usage is tracked

---

## 🔒 Security Checklist

Before going live:

- [ ] All environment variables are set in production
- [ ] JWT secret is strong and random (32+ characters)
- [ ] Stripe webhook secret is configured
- [ ] CORS is configured to only allow your domain
- [ ] Rate limiting is enabled on API endpoints
- [ ] SQL injection protection (using parameterized queries)
- [ ] XSS protection (sanitizing inputs)
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Passwords are hashed with bcrypt (already implemented)
- [ ] API keys are hashed before storage (already implemented)

---

## 📊 Monitoring & Logging

**Set up monitoring:**

1. **Vercel Analytics** (built-in)
   - Automatically tracks page views and performance

2. **Sentry for Error Tracking**
   ```bash
   pnpm add @sentry/node @sentry/react
   ```
   - Add Sentry DSN to environment variables
   - Initialize in `api/server.js` and `src/main.jsx`

3. **Stripe Dashboard**
   - Monitor payments, subscriptions, and webhooks
   - Set up email notifications for failed payments

4. **Supabase Dashboard**
   - Monitor database performance
   - Check query performance
   - Set up backups

---

## 🎉 Launch Checklist

Final steps before announcing:

- [ ] All tests pass
- [ ] Database is backed up
- [ ] Environment variables are set
- [ ] Stripe is in live mode (not test mode)
- [ ] Google OAuth is configured for production
- [ ] Domain is working (dhstx.co)
- [ ] SSL certificate is active
- [ ] Error monitoring is set up
- [ ] Terms of Service page is complete
- [ ] Privacy Policy page is complete
- [ ] Support email is set up
- [ ] Billing email notifications are configured

---

## 🚨 Troubleshooting

**Common Issues:**

1. **"CORS error" when calling API**
   - Check CORS configuration in `api/server.js`
   - Ensure frontend URL is in allowed origins

2. **"Unauthorized" errors**
   - Check JWT token is being sent in Authorization header
   - Verify JWT_SECRET matches between frontend and backend

3. **Stripe webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret is set
   - Check Stripe Dashboard → Webhooks → Logs

4. **Database connection errors**
   - Verify SUPABASE_URL and SUPABASE_KEY are correct
   - Check Supabase project is not paused

5. **Google OAuth not working**
   - Verify redirect URIs match exactly
   - Check client ID is correct
   - Ensure Google+ API is enabled

---

## 📞 Support

If you encounter issues:

1. Check API logs in Vercel Dashboard
2. Check browser console for frontend errors
3. Check Stripe Dashboard for payment issues
4. Check Supabase logs for database errors

---

## 🎯 Next Steps After Launch

**Week 1:**
- Monitor error rates and fix critical bugs
- Collect user feedback
- Track conversion rates (free → paid)

**Week 2-4:**
- Optimize agent performance
- Add more agent types
- Improve onboarding flow
- Add usage analytics dashboard

**Month 2:**
- Add team collaboration features
- Implement agent scheduling
- Add webhook support for agent results
- Create API documentation

---

**You're almost there! Just a few configuration steps and you'll be live! 🚀**

