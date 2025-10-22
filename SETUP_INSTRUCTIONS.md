# Complete Pricing System Setup Instructions

**Version:** 3.0  
**Date:** October 22, 2025

Follow these steps in order to deploy the complete pricing system.

---

## Step 1: Run Supabase Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy Migration SQL**
   ```bash
   # Copy the contents of this file:
   cat /home/ubuntu/productpage/supabase/migrations/001_complete_pricing_system.sql
   ```

4. **Paste and Execute**
   - Paste the entire SQL into the editor
   - Click "Run" or press Ctrl+Enter
   - Wait for completion (should take 10-30 seconds)

5. **Verify Tables Created**
   - Go to "Table Editor" in left sidebar
   - You should see these new tables:
     - subscription_tiers
     - users (extended)
     - pt_usage
     - advanced_pt_caps
     - pt_burn_rate
     - margin_monitoring
     - model_pricing
     - pt_topups
     - anonymous_sessions

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
brew install supabase/tap/supabase  # macOS
# or
npm install -g supabase  # npm

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migration
supabase db push

# Or apply directly
supabase db execute -f supabase/migrations/001_complete_pricing_system.sql
```

### Verify Migration Success

Run this query in SQL Editor:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'subscription_tiers',
  'users',
  'pt_usage',
  'advanced_pt_caps',
  'pt_burn_rate',
  'margin_monitoring',
  'model_pricing',
  'pt_topups',
  'anonymous_sessions'
)
ORDER BY table_name;

-- Should return 9 rows

-- Check tier data
SELECT tier, display_name, price_usd, core_pt_allocated 
FROM subscription_tiers 
ORDER BY display_order;

-- Should return 6 tiers: freemium, entry, pro, pro_plus, business, enterprise
```

---

## Step 2: Configure Stripe Products and Prices

### 2.1 Create Products

1. **Go to Stripe Dashboard**
   - https://dashboard.stripe.com/products
   - Make sure you're in the correct mode (Test or Live)

2. **Create Entry Tier Product**
   - Click "Add product"
   - Name: "Entry"
   - Description: "300 Core PT per month, Advanced PT add-on available"
   - Pricing model: "Standard pricing"
   - Price: $19.00 USD
   - Billing period: Monthly
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_...`)
   - Save as: `STRIPE_PRICE_ENTRY_MONTHLY`

3. **Add Annual Price to Entry**
   - In the Entry product page, click "Add another price"
   - Price: $193.00 USD (17% discount, ~2 months free)
   - Billing period: Yearly
   - Click "Add price"
   - **Copy the Price ID**
   - Save as: `STRIPE_PRICE_ENTRY_ANNUAL`

4. **Create Professional Tier Product**
   - Click "Add product"
   - Name: "Professional"
   - Description: "700 Core PT + 50 Advanced PT per month"
   - Price: $49.00 USD
   - Billing period: Monthly
   - **Copy Price ID** → `STRIPE_PRICE_PRO_MONTHLY`
   
   - Add annual price: $499.00 USD
   - **Copy Price ID** → `STRIPE_PRICE_PRO_ANNUAL`

5. **Create Pro Plus Tier Product**
   - Name: "Pro Plus"
   - Description: "1,600 Core PT + 100 Advanced PT per month"
   - Monthly: $79.00 USD → `STRIPE_PRICE_PRO_PLUS_MONTHLY`
   - Annual: $799.00 USD → `STRIPE_PRICE_PRO_PLUS_ANNUAL`

6. **Create Business Tier Product**
   - Name: "Business"
   - Description: "3,500 Core PT + 200 Advanced PT per month"
   - Monthly: $159.00 USD → `STRIPE_PRICE_BUSINESS_MONTHLY`
   - Annual: $1,619.00 USD → `STRIPE_PRICE_BUSINESS_ANNUAL`

### 2.2 Create Metered Advanced PT Price

1. **Create Metered Product**
   - Click "Add product"
   - Name: "Advanced PT (Metered)"
   - Description: "Pay-as-you-go Advanced model usage"

2. **Configure Metered Pricing**
   - Pricing model: "Usage-based"
   - Price: $0.035 USD
   - Unit: "per PT"
   - Billing period: Monthly
   - Usage aggregation: "Sum of usage values during period"
   - Click "Save product"
   - **Copy Price ID** → `STRIPE_PRICE_ADVANCED_PT`

### 2.3 Set Up Webhook

1. **Go to Webhooks**
   - https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"

2. **Configure Endpoint**
   - Endpoint URL: `https://dhstx.co/api/webhooks/stripe`
   - Description: "dhstx.co pricing system webhook"
   - Version: Latest API version

3. **Select Events**
   Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`

4. **Save and Get Signing Secret**
   - Click "Add endpoint"
   - Click on the newly created webhook
   - Click "Reveal" next to "Signing secret"
   - **Copy the secret** (starts with `whsec_...`)
   - Save as: `STRIPE_WEBHOOK_SECRET`

---

## Step 3: Set Up Environment Variables

### 3.1 Collect All Required Values

Create a file with all your environment variables:

```bash
# Existing (from current deployment)
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...

# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (from Step 2)
STRIPE_PRICE_ENTRY_MONTHLY=price_...
STRIPE_PRICE_ENTRY_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_PRO_PLUS_MONTHLY=price_...
STRIPE_PRICE_PRO_PLUS_ANNUAL=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_ANNUAL=price_...
STRIPE_PRICE_ADVANCED_PT=price_...

# Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
APP_URL=https://dhstx.co
```

### 3.2 Add to Vercel

**Option A: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select your project (productpage)
3. Go to Settings → Environment Variables
4. Add each variable:
   - Name: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...`
   - Environments: Production, Preview, Development
   - Click "Save"
5. Repeat for all variables

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add environment variables
vercel env add STRIPE_SECRET_KEY production
# Paste value when prompted

# Or add from file
vercel env pull .env.local
# Edit .env.local with all values
vercel env push .env.local production
```

### 3.3 Verify Environment Variables

```bash
# List all environment variables
vercel env ls

# Should show all the new Stripe and monitoring variables
```

---

## Step 4: Set Up Slack Alerts

### 4.1 Create Slack Webhook

1. **Go to Slack App Directory**
   - https://api.slack.com/apps
   - Click "Create New App"
   - Choose "From scratch"

2. **Configure App**
   - App Name: "dhstx.co Pricing Alerts"
   - Workspace: Select your workspace
   - Click "Create App"

3. **Enable Incoming Webhooks**
   - In left sidebar, click "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" to ON
   - Click "Add New Webhook to Workspace"

4. **Select Channel**
   - Choose channel (e.g., #pricing-alerts)
   - Click "Allow"

5. **Copy Webhook URL**
   - Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)
   - Save as: `SLACK_WEBHOOK_URL`
   - Add to Vercel environment variables

### 4.2 Test Slack Webhook

```bash
# Test webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "text": "🟢 Test alert from dhstx.co pricing system"
  }'

# Should see message in Slack channel
```

---

## Step 5: Deploy to Staging

### 5.1 Create Staging Branch

```bash
cd /home/ubuntu/productpage

# Create staging branch
git checkout -b staging

# Push to GitHub
git push origin staging
```

### 5.2 Create Vercel Preview Deployment

```bash
# Deploy to preview
vercel --prod=false

# Or let Vercel auto-deploy from staging branch
```

### 5.3 Test Staging Deployment

```bash
# Get staging URL
STAGING_URL="https://productpage-staging-...vercel.app"

# Test anonymous request
curl -X POST $STAGING_URL/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test staging deployment",
    "agent": "commander",
    "sessionId": "test-staging-123"
  }'

# Should return successful response
```

---

## Step 6: Run Integration Tests

### 6.1 Test Database Functions

```sql
-- Create test user
INSERT INTO users (email, subscription_tier)
VALUES ('test@staging.com', 'pro')
RETURNING *;

-- Test PT consumption
SELECT consume_pt(
  (SELECT id FROM users WHERE email = 'test@staging.com'),
  3,
  'core',
  NULL
);

-- Check user status
SELECT * FROM user_pt_status 
WHERE id = (SELECT id FROM users WHERE email = 'test@staging.com');
```

### 6.2 Test API Endpoints

```bash
# Test authenticated request
curl -X POST $STAGING_URL/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test authenticated request",
    "agent": "commander",
    "userId": "<test-user-id>",
    "sessionId": "test-session-456"
  }'

# Test PT estimation
curl -X POST $STAGING_URL/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Estimate this request",
    "userId": "<test-user-id>",
    "estimateOnly": true
  }'
```

### 6.3 Test Stripe Integration

```bash
# Test checkout session creation
curl -X POST $STAGING_URL/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<test-user-id>",
    "tier": "pro",
    "billingPeriod": "monthly"
  }'

# Use Stripe CLI to test webhooks
stripe listen --forward-to $STAGING_URL/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

### 6.4 Test Throttling

```bash
# Make rapid requests to trigger throttle
for i in {1..50}; do
  curl -X POST $STAGING_URL/api/agents/chat \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"Test request $i\",
      \"userId\": \"<test-user-id>\",
      \"sessionId\": \"test-throttle-$i\"
    }" &
done
wait

# Check throttle status
curl $STAGING_URL/api/usage/throttle-status?userId=<test-user-id>
```

---

## Step 7: Deploy to Production

### 7.1 Merge to Main

```bash
cd /home/ubuntu/productpage

# Switch to main
git checkout main

# Merge staging
git merge staging

# Push to production
git push origin main
```

### 7.2 Verify Deployment

```bash
# Check Vercel deployment
vercel ls

# Test production API
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test production deployment",
    "agent": "commander",
    "sessionId": "test-prod-123"
  }'
```

### 7.3 Monitor First Hour

1. **Watch Margin Dashboard**
   - https://dhstx.co/admin/margin-monitoring
   - Check platform status is green
   - Verify no alerts

2. **Check Slack Channel**
   - Should see no alerts (green status)

3. **Monitor Supabase Logs**
   - Check for any errors
   - Verify PT consumption working

4. **Check Stripe Dashboard**
   - Verify webhook receiving events
   - Check for any errors

---

## Step 8: Create Test Subscriptions

### 8.1 Create Test Customer

```bash
# Use Stripe test mode
# Create checkout session
curl -X POST https://dhstx.co/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<real-user-id>",
    "tier": "entry",
    "billingPeriod": "monthly"
  }'

# Complete checkout with test card: 4242 4242 4242 4242
```

### 8.2 Verify Subscription Created

```sql
-- Check user was upgraded
SELECT 
  email,
  subscription_tier,
  core_pt_allocated,
  stripe_subscription_id
FROM users
WHERE email = '<test-email>';

-- Check subscription in Stripe dashboard
```

### 8.3 Test PT Usage

```bash
# Make request as subscribed user
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test PT deduction",
    "userId": "<subscribed-user-id>",
    "agent": "commander"
  }'

# Verify PT was deducted
curl https://dhstx.co/api/usage/status?userId=<subscribed-user-id>
```

---

## Step 9: Launch Founding Member Program

### 9.1 Update Pricing Page

Add Founding Member banner:

```jsx
<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-8">
  <h2 className="text-2xl font-bold mb-2">
    🎉 Founding Member Offer
  </h2>
  <p className="text-lg mb-4">
    First 100 customers get <strong>50% off for 12 months</strong>
  </p>
  <ul className="list-disc list-inside mb-4">
    <li>Entry: $9.50/mo (normally $19)</li>
    <li>Professional: $24.50/mo (normally $49)</li>
    <li>Pro Plus: $39.50/mo (normally $79)</li>
    <li>Business: $79.50/mo (normally $159)</li>
  </ul>
  <p className="text-sm opacity-90">
    Limited to first 100 sign-ups. Discount applies for 12 months.
  </p>
</div>
```

### 9.2 Create Stripe Coupons

1. Go to Stripe Dashboard → Coupons
2. Create coupon:
   - ID: `FOUNDING_MEMBER`
   - Discount: 50% off
   - Duration: 12 months
   - Max redemptions: 100

3. Apply automatically in checkout:
```javascript
// In createCheckoutSession function
const session = await stripe.checkout.sessions.create({
  // ... other params
  discounts: [{
    coupon: 'FOUNDING_MEMBER'
  }]
});
```

---

## Step 10: Monitor and Iterate

### Daily Checklist

- [ ] Check margin monitoring dashboard
- [ ] Review Slack alerts
- [ ] Monitor Stripe revenue
- [ ] Check for throttle errors
- [ ] Review top PT consumers

### Weekly Tasks

- [ ] Analyze usage patterns
- [ ] Review margin trends
- [ ] Adjust throttles if needed
- [ ] Update model pricing if costs change

### Monthly Tasks

- [ ] Run pricing review
- [ ] Generate financial report
- [ ] Analyze tier performance
- [ ] Plan feature updates

---

## Troubleshooting

### Issue: Migration fails

**Error:** `relation "subscription_tiers" already exists`

**Solution:**
```sql
-- Drop existing tables (CAUTION: This deletes data!)
DROP TABLE IF EXISTS pt_usage CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS subscription_tiers CASCADE;
-- ... drop all tables

-- Then re-run migration
```

### Issue: Stripe webhook not working

**Error:** `Webhook signature verification failed`

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook is pointing to correct URL
3. Ensure raw body parsing is disabled in API route

### Issue: PT not deducting

**Error:** PT usage not recorded

**Solution:**
1. Check `consume_pt()` function exists
2. Verify `SUPABASE_SERVICE_KEY` is set
3. Check API logs for errors

---

## Success Criteria

✅ **Database Migration Complete**
- All 9 tables created
- 6 tiers populated
- Functions working

✅ **Stripe Integration Working**
- Products and prices created
- Webhook receiving events
- Test subscription successful

✅ **API Functioning**
- Anonymous requests working
- Authenticated requests working
- PT tracking accurate
- Throttling active

✅ **Monitoring Active**
- Margin dashboard accessible
- Slack alerts working
- No critical errors

✅ **Ready for Launch**
- All tests passing
- Documentation complete
- Team trained

---

**🎉 System is ready for production launch!**

Next: Launch Founding Member program and start acquiring customers.

