# Complete Pricing System Deployment Guide

**Version:** 3.0  
**Date:** October 22, 2025  
**Status:** Ready for Production Deployment

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup

- [ ] **Run Supabase Migration**
  ```bash
  # Navigate to Supabase dashboard
  # Go to SQL Editor
  # Copy contents of supabase/migrations/001_complete_pricing_system.sql
  # Execute migration
  ```

- [ ] **Verify Tables Created**
  - subscription_tiers
  - users (extended)
  - pt_usage
  - advanced_pt_caps
  - pt_burn_rate
  - margin_monitoring
  - model_pricing
  - pt_topups
  - anonymous_sessions

- [ ] **Verify Functions Created**
  - reset_monthly_pt()
  - check_pt_availability()
  - consume_pt()
  - check_advanced_cap()
  - check_burn_rate()

- [ ] **Verify Views Created**
  - user_pt_status
  - margin_dashboard
  - daily_usage_metrics

### 2. Environment Variables

Add these to Vercel:

```bash
# Existing
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...

# New - Stripe
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ENTRY_MONTHLY=price_...
STRIPE_PRICE_ENTRY_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_PRO_PLUS_MONTHLY=price_...
STRIPE_PRICE_PRO_PLUS_ANNUAL=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_ANNUAL=price_...
STRIPE_PRICE_ADVANCED_PT=price_...  # Metered pricing

# New - Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
APP_URL=https://dhstx.co
```

### 3. Stripe Configuration

- [ ] **Create Products in Stripe Dashboard**
  - Entry ($19/mo, $193/yr)
  - Professional ($49/mo, $499/yr)
  - Pro Plus ($79/mo, $799/yr)
  - Business ($159/mo, $1,619/yr)
  - Advanced PT (metered, $0.035 per PT)

- [ ] **Configure Webhook**
  - URL: `https://dhstx.co/api/webhooks/stripe`
  - Events to listen for:
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - customer.subscription.created
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_succeeded
    - invoice.payment_failed
    - checkout.session.completed

- [ ] **Get Webhook Secret**
  - Copy webhook signing secret
  - Add to STRIPE_WEBHOOK_SECRET env var

### 4. Code Deployment

- [ ] **Commit All Files**
  ```bash
  cd /home/ubuntu/productpage
  git add -A
  git commit -m "feat: complete pricing system v3 with metered Advanced PT"
  git push origin main
  ```

- [ ] **Verify Vercel Deployment**
  - Check build logs
  - Verify no errors
  - Confirm deployment URL

### 5. Slack Integration

- [ ] **Create Slack Webhook**
  - Go to Slack App settings
  - Create Incoming Webhook
  - Select channel for alerts (e.g., #pricing-alerts)
  - Copy webhook URL
  - Add to SLACK_WEBHOOK_URL env var

---

## 🧪 Testing Checklist

### Phase 1: Database Tests

```sql
-- Test 1: Verify tier data
SELECT * FROM subscription_tiers ORDER BY display_order;

-- Test 2: Create test user
INSERT INTO users (email, subscription_tier)
VALUES ('test@example.com', 'pro')
RETURNING *;

-- Test 3: Test PT availability check
SELECT check_pt_availability(
  '<user_id>',
  3,
  'core'
);

-- Test 4: Test PT consumption
SELECT consume_pt(
  '<user_id>',
  3,
  'core',
  NULL
);

-- Test 5: Test Advanced cap check
SELECT check_advanced_cap('<user_id>');

-- Test 6: Test burn rate check
SELECT check_burn_rate('<user_id>');

-- Test 7: Test monthly reset
SELECT reset_monthly_pt();
```

### Phase 2: API Tests

```bash
# Test 1: Anonymous request
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, test message",
    "agent": "commander",
    "sessionId": "test-session-123"
  }'

# Test 2: Authenticated request (Core model)
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test authenticated request",
    "agent": "commander",
    "userId": "<user_id>",
    "sessionId": "test-session-456"
  }'

# Test 3: PT cost estimation
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Estimate this request",
    "agent": "commander",
    "userId": "<user_id>",
    "estimateOnly": true
  }'

# Test 4: Get usage status
curl https://dhstx.co/api/pt/usage?userId=<user_id>
```

### Phase 3: Throttling Tests

```bash
# Test 1: Trigger burn rate throttle
# Make 50+ requests rapidly to exceed 40%/72h limit

# Test 2: Trigger Advanced cap
# Use Advanced model until soft cap (20%) is reached

# Test 3: Verify throttle status
curl https://dhstx.co/api/usage/throttle-status?userId=<user_id>
```

### Phase 4: Stripe Tests

```bash
# Test 1: Create checkout session
curl -X POST https://dhstx.co/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user_id>",
    "tier": "pro",
    "billingPeriod": "monthly"
  }'

# Test 2: Purchase PT top-up
curl -X POST https://dhstx.co/api/stripe/purchase-topup \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user_id>",
    "ptAmount": 1000,
    "ptType": "core"
  }'

# Test 3: Get subscription details
curl https://dhstx.co/api/stripe/subscription?userId=<user_id>

# Test 4: Test webhook (use Stripe CLI)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

### Phase 5: Margin Monitoring Tests

```bash
# Test 1: Run margin monitoring job
curl -X POST https://dhstx.co/api/admin/run-margin-monitoring

# Test 2: Check margin dashboard
curl https://dhstx.co/api/admin/margin-monitoring

# Test 3: Verify Slack alerts
# Check Slack channel for test alerts
```

### Phase 6: UI Tests

- [ ] **PT Health Bar**
  - Verify green/yellow/red colors
  - Check usage percentage display
  - Test projection calculation

- [ ] **Advanced PT Sub-Bar**
  - Verify soft/hard cap indicators
  - Check warning messages
  - Test upgrade prompts

- [ ] **Usage Monitoring Dashboard**
  - Verify real-time updates
  - Check recent usage display
  - Test statistics calculations

- [ ] **Margin Monitoring Dashboard (Admin)**
  - Verify platform status card
  - Check tier status cards
  - Test alert display

---

## 🚀 Deployment Steps

### Step 1: Deploy Database Migration

```bash
# 1. Open Supabase dashboard
# 2. Navigate to SQL Editor
# 3. Copy migration SQL
# 4. Execute
# 5. Verify all tables created
```

### Step 2: Configure Stripe

```bash
# 1. Create products and prices
# 2. Set up webhook
# 3. Copy price IDs to env vars
# 4. Test webhook with Stripe CLI
```

### Step 3: Deploy Code

```bash
cd /home/ubuntu/productpage

# Commit changes
git add -A
git commit -m "feat: complete pricing system v3"
git push origin main

# Verify deployment
# Check Vercel dashboard
# Confirm build success
```

### Step 4: Configure Environment Variables

```bash
# Add all required env vars in Vercel dashboard
# Redeploy to apply changes
```

### Step 5: Run Initial Tests

```bash
# Test anonymous requests
# Test authenticated requests
# Verify PT tracking
# Check throttling
# Test Stripe integration
```

### Step 6: Monitor First 24 Hours

```bash
# Watch margin monitoring dashboard
# Check Slack for alerts
# Monitor Supabase logs
# Review Stripe dashboard
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

- [ ] Review margin monitoring dashboard
- [ ] Check Slack alerts
- [ ] Verify no throttle errors
- [ ] Monitor Stripe revenue

### Weekly Tasks

- [ ] Review margin trends
- [ ] Analyze usage patterns
- [ ] Check for power users
- [ ] Update model pricing if needed

### Monthly Tasks

- [ ] Run pricing review
- [ ] Analyze tier performance
- [ ] Review and adjust caps
- [ ] Generate financial report

### Automated Jobs

Set up cron jobs or Vercel cron:

```yaml
# vercel.json
{
  "crons": [
    {
      "path": "/api/cron/reset-monthly-pt",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/margin-monitoring",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/cleanup-sessions",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Issue: PT not deducting

**Symptoms:** PT usage not recorded after requests

**Diagnosis:**
```sql
-- Check recent pt_usage records
SELECT * FROM pt_usage 
WHERE user_id = '<user_id>' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check user PT status
SELECT * FROM user_pt_status WHERE id = '<user_id>';
```

**Fix:**
- Verify consume_pt() function exists
- Check API logs for errors
- Ensure SUPABASE_SERVICE_KEY is set

### Issue: Throttle not working

**Symptoms:** Users not throttled despite exceeding limits

**Diagnosis:**
```sql
-- Check burn rate records
SELECT * FROM pt_burn_rate 
WHERE user_id = '<user_id>' 
ORDER BY created_at DESC;

-- Check throttle status
SELECT throttle_active, throttle_until, throttle_reason 
FROM users 
WHERE id = '<user_id>';
```

**Fix:**
- Verify check_burn_rate() function
- Check throttle middleware
- Ensure throttle checks in API

### Issue: Margin alerts not sending

**Symptoms:** No Slack alerts despite low margins

**Diagnosis:**
```bash
# Check margin monitoring records
SELECT * FROM margin_monitoring 
WHERE status IN ('yellow', 'red') 
ORDER BY created_at DESC;

# Test Slack webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"text": "Test alert"}'
```

**Fix:**
- Verify SLACK_WEBHOOK_URL is set
- Check webhook permissions
- Review margin monitoring logs

### Issue: Stripe webhook failing

**Symptoms:** Subscriptions not activating

**Diagnosis:**
```bash
# Check Stripe webhook logs in dashboard
# Look for signature verification errors

# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Fix:**
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check webhook endpoint is accessible
- Ensure raw body parsing is disabled

---

## 📈 Success Metrics

### Week 1 Targets

- [ ] 0 critical errors
- [ ] >90% API success rate
- [ ] All margins >50%
- [ ] <5% throttle rate
- [ ] 10+ paying customers

### Month 1 Targets

- [ ] 50+ paying customers
- [ ] $2,000+ MRR
- [ ] >70% average margin
- [ ] <3% churn rate
- [ ] 0 payment failures

### Quarter 1 Targets

- [ ] 100+ paying customers
- [ ] $4,000+ MRR
- [ ] >75% average margin
- [ ] <5% annual churn
- [ ] 95%+ uptime

---

## 🎯 Next Steps After Deployment

1. **Monitor closely** for first 48 hours
2. **Gather user feedback** on pricing and limits
3. **Adjust throttles** based on actual usage
4. **Optimize model routing** for better margins
5. **Launch marketing campaign** for Founding Members
6. **Iterate on pricing** based on data

---

## 📞 Support & Escalation

**Critical Issues (P0):**
- Payment failures
- Database corruption
- API complete outage
- Security breach

**High Priority (P1):**
- Margin <40%
- Throttle errors
- Stripe sync issues

**Medium Priority (P2):**
- UI bugs
- Monitoring gaps
- Performance issues

**Low Priority (P3):**
- Feature requests
- UI improvements
- Documentation updates

---

## ✅ Deployment Sign-Off

- [ ] Database migration completed
- [ ] Environment variables configured
- [ ] Stripe integration tested
- [ ] Code deployed to production
- [ ] All tests passing
- [ ] Monitoring active
- [ ] Team notified
- [ ] Documentation updated

**Deployed by:** _________________  
**Date:** _________________  
**Version:** 3.0  
**Approved by:** _________________

---

**🎉 Ready to launch!**

