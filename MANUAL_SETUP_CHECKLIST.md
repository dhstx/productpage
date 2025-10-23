# 📋 Manual Setup Checklist - Fill in the Blanks

**Estimated Time:** 2-3 hours  
**Status:** All code is ready, just needs configuration

---

## 🗄️ STEP 1: Database Migrations (30 minutes)

### 1.1 Access Supabase Dashboard
- [ ] Go to: https://supabase.com/dashboard
- [ ] Login with your account
- [ ] Select your project: **___________________________**

**Project URL:** `_________________________________`  
**Project ID:** `_________________________________`

### 1.2 Open SQL Editor
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "+ New query"

### 1.3 Run Migration 001: Complete Pricing System
- [ ] Copy contents of: `supabase/migrations/001_complete_pricing_system.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run" (or press Ctrl+Enter)
- [ ] Verify success message: **___________________________**
- [ ] Confirm tables created (13 tables):
  - [ ] `subscription_tiers`
  - [ ] `user_subscriptions`
  - [ ] `token_usage`
  - [ ] `token_purchase_history`
  - [ ] `anonymous_sessions`
  - [ ] `model_pricing`
  - [ ] `advanced_pt_usage`
  - [ ] `pt_burn_tracking`
  - [ ] `margin_monitoring`
  - [ ] `margin_alerts`
  - [ ] `pt_health_warnings`
  - [ ] `subscription_history`
  - [ ] `token_top_ups`

**Migration 001 Status:** ✅ Complete / ❌ Failed  
**Error (if any):** `_________________________________`

### 1.4 Run Migration 002: Conversation History
- [ ] Copy contents of: `supabase/migrations/002_conversation_history.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (3 tables):
  - [ ] `conversations`
  - [ ] `conversation_messages`
  - [ ] `conversation_bookmarks`

**Migration 002 Status:** ✅ Complete / ❌ Failed

### 1.5 Run Migration 003: Referral Program
- [ ] Copy contents of: `supabase/migrations/003_referral_program.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (3 tables):
  - [ ] `referral_codes`
  - [ ] `referrals`
  - [ ] `referral_rewards`

**Migration 003 Status:** ✅ Complete / ❌ Failed

### 1.6 Run Migration 004: PT Accounting Ledger
- [ ] Copy contents of: `supabase/migrations/004_pt_accounting_ledger.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (4 tables):
  - [ ] `pt_ledger`
  - [ ] `pt_reconciliation`
  - [ ] `pt_disputes`
  - [ ] `monthly_financial_summary`

**Migration 004 Status:** ✅ Complete / ❌ Failed

### 1.7 Run Migration 005: Security Abuse Log
- [ ] Copy contents of: `supabase/migrations/005_security_abuse_log.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (2 tables):
  - [ ] `security_events`
  - [ ] `ip_blocklist`

**Migration 005 Status:** ✅ Complete / ❌ Failed

### 1.8 Run Migration 006: Webhook Events
- [ ] Copy contents of: `supabase/migrations/006_webhook_events.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (2 tables):
  - [ ] `webhook_events`
  - [ ] `webhook_dead_letter_queue`

**Migration 006 Status:** ✅ Complete / ❌ Failed

### 1.9 Run Migration 007: Logging and Monitoring
- [ ] Copy contents of: `supabase/migrations/007_logging_monitoring.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Confirm tables created (3 tables):
  - [ ] `application_logs`
  - [ ] `performance_metrics`
  - [ ] `alerts`

**Migration 007 Status:** ✅ Complete / ❌ Failed

### 1.10 Verify All Tables
- [ ] Go to "Table Editor" in left sidebar
- [ ] Confirm total of **32 tables** exist
- [ ] Take screenshot for reference

**Total Tables Count:** `_________` (should be 32)  
**All Migrations Complete:** ✅ Yes / ❌ No

---

## 💳 STEP 2: Stripe Configuration (30 minutes)

### 2.1 Access Stripe Dashboard
- [ ] Go to: https://dashboard.stripe.com
- [ ] Login with your account
- [ ] Switch to **Test Mode** (toggle in top right)

**Stripe Account ID:** `acct_____________________________`

### 2.2 Create Product 1: Entry Tier
- [ ] Go to: https://dashboard.stripe.com/products
- [ ] Click "+ Add product"
- [ ] Fill in details:
  - **Name:** `Entry Tier`
  - **Description:** `300 Core PT per month, 5 agents, Core models only`
  - **Pricing Model:** `Recurring`
  - **Price:** `$19.00`
  - **Billing Period:** `Monthly`
  - **Currency:** `USD`
- [ ] Click "Save product"
- [ ] Copy Price ID from the pricing section

**Entry Tier Product ID:** `prod_____________________________`  
**Entry Tier Price ID:** `price_____________________________`

### 2.3 Create Product 2: Pro Tier
- [ ] Click "+ Add product"
- [ ] Fill in details:
  - **Name:** `Pro Tier`
  - **Description:** `1,000 Core PT + 50 Advanced PT per month, 25 agents`
  - **Pricing Model:** `Recurring`
  - **Price:** `$49.00`
  - **Billing Period:** `Monthly`
  - **Currency:** `USD`
- [ ] Click "Save product"
- [ ] Copy Price ID

**Pro Tier Product ID:** `prod_____________________________`  
**Pro Tier Price ID:** `price_____________________________`

### 2.4 Create Product 3: Pro Plus Tier
- [ ] Click "+ Add product"
- [ ] Fill in details:
  - **Name:** `Pro Plus Tier`
  - **Description:** `1,600 Core PT + 100 Advanced PT per month, 50 agents`
  - **Pricing Model:** `Recurring`
  - **Price:** `$79.00`
  - **Billing Period:** `Monthly`
  - **Currency:** `USD`
- [ ] Click "Save product"
- [ ] Copy Price ID

**Pro Plus Tier Product ID:** `prod_____________________________`  
**Pro Plus Tier Price ID:** `price_____________________________`

### 2.5 Create Product 4: Business Tier
- [ ] Click "+ Add product"
- [ ] Fill in details:
  - **Name:** `Business Tier`
  - **Description:** `3,500 Core PT + 200 Advanced PT per month, 100 agents`
  - **Pricing Model:** `Recurring`
  - **Price:** `$159.00`
  - **Billing Period:** `Monthly`
  - **Currency:** `USD`
- [ ] Click "Save product"
- [ ] Copy Price ID

**Business Tier Product ID:** `prod_____________________________`  
**Business Tier Price ID:** `price_____________________________`

### 2.6 Create Product 5: Enterprise Tier
- [ ] Click "+ Add product"
- [ ] Fill in details:
  - **Name:** `Enterprise Tier`
  - **Description:** `Custom PT allocation, unlimited agents, white-label options`
  - **Pricing Model:** `Recurring`
  - **Price:** `$299.00`
  - **Billing Period:** `Monthly`
  - **Currency:** `USD`
- [ ] Click "Save product"
- [ ] Copy Price ID

**Enterprise Tier Product ID:** `prod_____________________________`  
**Enterprise Tier Price ID:** `price_____________________________`

### 2.7 Get Stripe API Keys
- [ ] Go to: https://dashboard.stripe.com/apikeys
- [ ] Copy "Publishable key" (starts with `pk_test_`)
- [ ] Click "Reveal test key" for Secret key
- [ ] Copy "Secret key" (starts with `sk_test_`)

**Stripe Publishable Key:** `pk_test_____________________________`  
**Stripe Secret Key:** `sk_test_____________________________`

### 2.8 Create Webhook Endpoint
- [ ] Go to: https://dashboard.stripe.com/webhooks
- [ ] Click "+ Add endpoint"
- [ ] Fill in details:
  - **Endpoint URL:** `https://dhstx.co/api/webhooks/stripe`
  - **Description:** `Production webhook for dhstx.co`
  - **Events to send:** Select these events:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
    - [ ] `payment_intent.succeeded`
    - [ ] `payment_intent.payment_failed`
- [ ] Click "Add endpoint"
- [ ] Copy "Signing secret" (starts with `whsec_`)

**Webhook Endpoint ID:** `we_____________________________`  
**Webhook Signing Secret:** `whsec_____________________________`

### 2.9 Test Webhook (Optional but Recommended)
- [ ] Install Stripe CLI: https://stripe.com/docs/stripe-cli
- [ ] Run: `stripe login`
- [ ] Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] In another terminal: `stripe trigger checkout.session.completed`
- [ ] Verify webhook received in logs

**Webhook Test Status:** ✅ Success / ❌ Failed / ⏭️ Skipped

---

## 🔐 STEP 3: Environment Variables (15 minutes)

### 3.1 Access Vercel Dashboard
- [ ] Go to: https://vercel.com/dashboard
- [ ] Login with your account
- [ ] Select project: **productpage**
- [ ] Click "Settings" tab
- [ ] Click "Environment Variables" in left sidebar

**Vercel Project URL:** `https://vercel.com/_________/productpage`

### 3.2 Add Supabase Variables
- [ ] Click "Add New"
- [ ] Add each variable below:

**Variable 1:**
- **Key:** `SUPABASE_URL`
- **Value:** `_________________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 2:**
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `_________________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 3:**
- **Key:** `SUPABASE_SERVICE_KEY`
- **Value:** `_________________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

> **Where to find:** Supabase Dashboard → Settings → API → Project URL and API Keys

### 3.3 Add Stripe Variables
**Variable 4:**
- **Key:** `STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 5:**
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 6:**
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

### 3.4 Add Stripe Price IDs
**Variable 7:**
- **Key:** `STRIPE_PRICE_ID_ENTRY`
- **Value:** `price_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 8:**
- **Key:** `STRIPE_PRICE_ID_PRO`
- **Value:** `price_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 9:**
- **Key:** `STRIPE_PRICE_ID_PRO_PLUS`
- **Value:** `price_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 10:**
- **Key:** `STRIPE_PRICE_ID_BUSINESS`
- **Value:** `price_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

**Variable 11:**
- **Key:** `STRIPE_PRICE_ID_ENTERPRISE`
- **Value:** `price_____________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

### 3.5 Add Anthropic API Key
**Variable 12:**
- **Key:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-_________________________________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

> **Where to find:** Already set in your environment (check existing Vercel vars)

### 3.6 Add Slack Webhook (for alerts)
**Variable 13:**
- **Key:** `SLACK_WEBHOOK_URL`
- **Value:** `https://hooks.slack.com/services/___________`
- **Environment:** ✅ Production ✅ Preview ✅ Development

> **Where to find:** Slack → Apps → Incoming Webhooks → Add to Workspace

**Slack Webhook URL:** `https://hooks.slack.com/services/___________`

### 3.7 Add Site URL
**Variable 14:**
- **Key:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://dhstx.co`
- **Environment:** ✅ Production ✅ Preview ✅ Development

### 3.8 Verify All Variables
- [ ] Count total environment variables: should be **14**
- [ ] Click "Save" for each variable
- [ ] Take screenshot for reference

**Total Environment Variables:** `_________` (should be 14)  
**All Variables Added:** ✅ Yes / ❌ No

---

## 🔑 STEP 4: GitHub Secrets (10 minutes)

### 4.1 Access GitHub Repository Settings
- [ ] Go to: https://github.com/dhstx/productpage
- [ ] Click "Settings" tab
- [ ] Click "Secrets and variables" → "Actions" in left sidebar

### 4.2 Add Vercel Secrets
- [ ] Click "New repository secret"

**Secret 1:**
- **Name:** `VERCEL_TOKEN`
- **Value:** `_________________________________`

> **Where to find:** Vercel Dashboard → Settings → Tokens → Create Token

**Secret 2:**
- **Name:** `VERCEL_ORG_ID`
- **Value:** `_________________________________`

> **Where to find:** Vercel Dashboard → Settings → General → Team ID

**Secret 3:**
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** `_________________________________`

> **Where to find:** Vercel Project Settings → General → Project ID

### 4.3 Add Slack Webhook Secret
**Secret 4:**
- **Name:** `SLACK_WEBHOOK_URL`
- **Value:** `https://hooks.slack.com/services/___________`

### 4.4 Verify All Secrets
- [ ] Count total secrets: should be **4**
- [ ] Take screenshot for reference

**Total GitHub Secrets:** `_________` (should be 4)  
**All Secrets Added:** ✅ Yes / ❌ No

---

## 🚀 STEP 5: Deploy and Test (30 minutes)

### 5.1 Trigger Deployment
- [ ] Go to your local productpage directory
- [ ] Run: `git pull origin main`
- [ ] Verify latest commit: `f508371`
- [ ] Push workflow file manually:
  ```bash
  git add .github/workflows/ci-cd.yml
  git commit -m "ci: Add GitHub Actions workflow"
  git push origin main
  ```

**Latest Commit SHA:** `_________________________________`  
**Deployment Triggered:** ✅ Yes / ❌ No

### 5.2 Monitor Deployment
- [ ] Go to: https://vercel.com/dhstx/productpage/deployments
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Check deployment status

**Deployment URL:** `https://dhstx.co`  
**Deployment Status:** ✅ Ready / ⏳ Building / ❌ Failed  
**Deployment Time:** `_________` minutes

### 5.3 Test User Registration
- [ ] Go to: https://dhstx.co/register
- [ ] Create test account:
  - **Email:** `test+___________@yourdomain.com`
  - **Password:** `___________`
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Verify redirect to dashboard

**Registration Status:** ✅ Success / ❌ Failed  
**Email Verification:** ✅ Received / ❌ Not received  
**Test User ID:** `_________________________________`

### 5.4 Test Login
- [ ] Go to: https://dhstx.co/login
- [ ] Login with test account
- [ ] Verify redirect to dashboard
- [ ] Check PT balance shows: **100 PT** (Freemium tier)

**Login Status:** ✅ Success / ❌ Failed  
**PT Balance:** `_________` PT (should be 100)

### 5.5 Test Chat Interface
- [ ] Click on an agent (e.g., Commander)
- [ ] Send test message: "Hello, test message"
- [ ] Verify PT estimation shows before sending
- [ ] Verify AI response received
- [ ] Check PT balance decreased

**Estimated PT:** `_________` PT  
**AI Response:** ✅ Received / ❌ Failed  
**PT Deducted:** `_________` PT  
**New PT Balance:** `_________` PT

### 5.6 Test PT Health Bar
- [ ] Verify PT health bar visible at top of dashboard
- [ ] Check color: 🟢 Green (>50% remaining)
- [ ] Verify "Reset Date" shows next month

**PT Health Bar:** ✅ Visible / ❌ Not visible  
**Color:** 🟢 Green / 🟡 Yellow / 🔴 Red  
**Reset Date:** `_________________________________`

### 5.7 Test Pricing Page
- [ ] Go to: https://dhstx.co/pricing
- [ ] Verify 5 tiers displayed
- [ ] Click "Get Started" on Pro tier
- [ ] Verify redirect to Stripe Checkout

**Pricing Page:** ✅ Working / ❌ Broken  
**Stripe Checkout:** ✅ Loaded / ❌ Failed  
**Checkout Session ID:** `cs_test_____________________________`

### 5.8 Test Stripe Checkout (Optional)
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date
- [ ] CVC: Any 3 digits
- [ ] Complete checkout
- [ ] Verify redirect to success page
- [ ] Check PT balance updated

**Checkout Status:** ✅ Success / ❌ Failed / ⏭️ Skipped  
**New Tier:** `_________________________________`  
**New PT Balance:** `_________` PT

### 5.9 Test Webhook Processing
- [ ] Go to: https://dashboard.stripe.com/webhooks
- [ ] Click on your webhook endpoint
- [ ] Check "Recent events" section
- [ ] Verify events show "Success" status

**Webhook Events Received:** `_________`  
**All Events Successful:** ✅ Yes / ❌ No / ⏭️ Skipped

### 5.10 Test Admin Dashboard
- [ ] Update test user to admin role in Supabase:
  ```sql
  UPDATE user_profiles 
  SET role = 'admin' 
  WHERE user_id = 'YOUR_TEST_USER_ID';
  ```
- [ ] Go to: https://dhstx.co/admin/margin-monitoring
- [ ] Verify dashboard loads with metrics

**Admin Access:** ✅ Granted / ❌ Denied  
**Dashboard Status:** ✅ Working / ❌ Broken  
**Platform Margin:** `_________`%

### 5.11 Test Logging System
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Open `application_logs` table
- [ ] Verify logs are being written
- [ ] Check recent log entries

**Logs Being Written:** ✅ Yes / ❌ No  
**Recent Log Count:** `_________`  
**Latest Log Timestamp:** `_________________________________`

### 5.12 Test Monitoring Dashboard
- [ ] Go to: https://dhstx.co/admin/monitoring
- [ ] Verify real-time metrics displayed
- [ ] Check error rate, uptime, alerts

**Monitoring Dashboard:** ✅ Working / ❌ Broken  
**Error Rate (1h):** `_________`%  
**Uptime (24h):** `_________`%

---

## ✅ FINAL VERIFICATION

### All Systems Check
- [ ] Database migrations: ✅ Complete (32 tables)
- [ ] Stripe products: ✅ Created (5 tiers)
- [ ] Stripe webhook: ✅ Configured
- [ ] Environment variables: ✅ Added (14 vars)
- [ ] GitHub secrets: ✅ Added (4 secrets)
- [ ] Deployment: ✅ Successful
- [ ] User registration: ✅ Working
- [ ] Login: ✅ Working
- [ ] Chat interface: ✅ Working
- [ ] PT tracking: ✅ Working
- [ ] Pricing page: ✅ Working
- [ ] Stripe checkout: ✅ Working
- [ ] Webhook processing: ✅ Working
- [ ] Admin dashboard: ✅ Working
- [ ] Logging system: ✅ Working
- [ ] Monitoring dashboard: ✅ Working

### Production Readiness Score
**Total Checks:** 16  
**Passed:** `_________` / 16  
**Percentage:** `_________`%

**Production Ready:** ✅ Yes (≥15/16) / ❌ No (<15/16)

---

## 📝 Notes and Issues

### Issues Encountered
1. `_________________________________`
2. `_________________________________`
3. `_________________________________`

### Resolution Steps
1. `_________________________________`
2. `_________________________________`
3. `_________________________________`

### Additional Configuration
1. `_________________________________`
2. `_________________________________`
3. `_________________________________`

---

## 🎉 Launch Checklist

Once all manual setup is complete:

- [ ] Switch Stripe to **Live Mode**
- [ ] Update Stripe API keys in Vercel (live keys)
- [ ] Update webhook endpoint to use live keys
- [ ] Test one real transaction with real card
- [ ] Set up Slack alerts channel
- [ ] Create admin accounts for team
- [ ] Prepare launch announcement
- [ ] Launch Founding Member program (first 100 get 50% off)
- [ ] Activate referral program
- [ ] Monitor for first 24 hours

**Launch Date:** `_________________________________`  
**Founding Member Slots:** 0 / 100

---

**Setup Completed By:** `_________________________________`  
**Date Completed:** `_________________________________`  
**Time Spent:** `_________` hours  
**Status:** ✅ Complete / ⏳ In Progress / ❌ Blocked

