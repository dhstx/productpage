# Manual Setup Progress Tracker

## ✅ STEP 1: Database Migration (COMPLETE!)

**Status:** ✅ DONE  
**Date:** October 23, 2025  
**Time Taken:** ~10 minutes

### What Was Created:
- ✅ `subscription_tiers` table with 6 pricing tiers
- ✅ `token_usage` table for PT tracking
- ✅ `user_subscriptions` table for Stripe integration
- ✅ `pt_ledger` table for financial audit trail
- ✅ Updated `users` table with 17 new columns for PT tracking

### Verification:
- Total tables: 22 (was 18, added 4)
- All tables visible in Supabase Table Editor
- No errors during migration

---

## ⏳ STEP 2: Stripe Configuration (IN PROGRESS)

**Status:** 🔄 TODO  
**Estimated Time:** 30 minutes

### What You Need to Do:

#### 2.1: Create Stripe Products

Go to: https://dashboard.stripe.com/test/products

Create 5 products with these exact details:

**Product 1: Entry**
- Name: `Entry`
- Description: `300 Core PT/month, 5 agents, Core models only`
- Price: `$19.00 USD / month`
- Recurring: Monthly
- Price ID: _________________ (copy this!)

**Product 2: Professional**
- Name: `Professional`
- Description: `700 Core PT + 50 Advanced PT/month, 25 agents`
- Price: `$49.00 USD / month`
- Recurring: Monthly
- Price ID: _________________ (copy this!)

**Product 3: Pro Plus**
- Name: `Pro Plus`
- Description: `1,600 Core PT + 100 Advanced PT/month, 50 agents`
- Price: `$79.00 USD / month`
- Recurring: Monthly
- Price ID: _________________ (copy this!)

**Product 4: Business**
- Name: `Business`
- Description: `3,500 Core PT + 200 Advanced PT/month, 100 agents`
- Price: `$159.00 USD / month`
- Recurring: Monthly
- Price ID: _________________ (copy this!)

**Product 5: Enterprise**
- Name: `Enterprise`
- Description: `10,000 Core PT + 500 Advanced PT/month, unlimited agents`
- Price: `$299.00 USD / month`
- Recurring: Monthly
- Price ID: _________________ (copy this!)

#### 2.2: Get Stripe API Keys

Go to: https://dashboard.stripe.com/test/apikeys

- Publishable key: `pk_test_...` _________________ (copy this!)
- Secret key: `sk_test_...` _________________ (copy this!)

#### 2.3: Set Up Webhook

Go to: https://dashboard.stripe.com/test/webhooks

1. Click "Add endpoint"
2. Endpoint URL: `https://dhstx.co/api/webhooks/stripe`
3. Description: `dhstx.co webhook`
4. Events to send:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the **Signing secret**: `whsec_...` _________________ (copy this!)

---

## ⏳ STEP 3: Environment Variables (TODO)

**Status:** ⏳ PENDING  
**Depends on:** Step 2 (need Stripe keys first)

Go to: https://vercel.com/dhstxs-projects-c47b4191/productpage/settings/environment-variables

Add these 14 variables:

### Supabase (from: https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi/settings/api)
- `SUPABASE_URL`: _______________
- `SUPABASE_ANON_KEY`: _______________
- `SUPABASE_SERVICE_KEY`: _______________

### Stripe (from Step 2 above)
- `STRIPE_PUBLISHABLE_KEY`: _______________
- `STRIPE_SECRET_KEY`: _______________
- `STRIPE_WEBHOOK_SECRET`: _______________
- `STRIPE_PRICE_ID_ENTRY`: _______________
- `STRIPE_PRICE_ID_PRO`: _______________
- `STRIPE_PRICE_ID_PRO_PLUS`: _______________
- `STRIPE_PRICE_ID_BUSINESS`: _______________
- `STRIPE_PRICE_ID_ENTERPRISE`: _______________

### Anthropic (you should already have this)
- `ANTHROPIC_API_KEY`: _______________

### Slack (optional, for alerts)
- `SLACK_WEBHOOK_URL`: _______________ (optional)

### Next.js
- `NEXTAUTH_SECRET`: _______________ (generate with: `openssl rand -base64 32`)

---

## ⏳ STEP 4: Deploy to Vercel (TODO)

**Status:** ⏳ PENDING  
**Depends on:** Step 3 (need env vars first)

1. Go to: https://vercel.com/dhstxs-projects-c47b4191/productpage
2. Click "Deployments"
3. Click "Redeploy" on latest deployment
4. Wait for deployment to complete (~2 minutes)
5. Test at: https://dhstx.co

---

## ⏳ STEP 5: Test Everything (TODO)

**Status:** ⏳ PENDING  
**Depends on:** Step 4 (need deployment first)

### Test Checklist:
- [ ] User registration works
- [ ] Login works
- [ ] Chat interface loads
- [ ] PT tracking works (check after sending a message)
- [ ] Pricing page shows correct tiers
- [ ] Stripe checkout works (use test card: 4242 4242 4242 4242)
- [ ] Webhook processes subscription
- [ ] PT balance updates after subscription
- [ ] Admin dashboard shows data
- [ ] Logging system captures events

---

## 📊 Overall Progress

**Completed:** 1 / 5 steps (20%)  
**Estimated Time Remaining:** 1.5 - 2 hours  
**Next Action:** Complete Stripe configuration (Step 2)

---

**Last Updated:** October 23, 2025 12:45 PM EDT

