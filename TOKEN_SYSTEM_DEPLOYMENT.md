# Token-Based Pricing System Deployment Guide

## Overview

This guide covers the deployment of the token-based pricing system with tiered access control for the dhstx.co AI agent platform.

---

## Phase 1: Database Setup

### 1.1 Run Database Migration

```bash
# Connect to Supabase SQL Editor
# Copy and paste contents of supabase-token-system.sql
# Execute the migration
```

**What this creates:**
- Token usage tracking table
- Subscription history table
- Anonymous sessions table
- Token purchase add-ons table
- Helper functions (reset_monthly_tokens, check_token_availability, consume_tokens)
- RLS policies for security
- Analytics views
- Subscription tiers reference data

### 1.2 Verify Migration

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('token_usage', 'subscription_history', 'anonymous_sessions', 'token_purchases', 'subscription_tiers');

-- Check functions were created
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('reset_monthly_tokens', 'check_token_availability', 'consume_tokens');

-- Verify subscription tiers data
SELECT * FROM subscription_tiers ORDER BY display_order;
```

### 1.3 Update Existing Users

```sql
-- Set default tier for existing users
UPDATE users 
SET 
  subscription_tier = 'free',
  tokens_allocated = 100,
  tokens_used = 0,
  tokens_reset_date = NOW() + INTERVAL '1 month',
  billing_cycle_start = NOW()
WHERE subscription_tier IS NULL;
```

---

## Phase 2: Backend Deployment

### 2.1 Update Environment Variables

Add to Vercel environment variables:

```bash
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Note:** Make sure to use the **service role key**, not the anon key, for admin operations.

### 2.2 Deploy Updated API

```bash
# Backup current chat.mjs
cd /home/ubuntu/productpage
cp api/agents/chat.mjs api/agents/chat-backup-$(date +%Y%m%d).mjs

# Replace with token-enabled version
cp api/agents/chat-with-tokens.mjs api/agents/chat.mjs

# Commit and push
git add api/agents/chat.mjs
git commit -m "feat: add token-based usage tracking and tier restrictions"
git push origin main
```

### 2.3 Verify API Deployment

```bash
# Test anonymous user (should be limited to 1 question)
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "commander",
    "message": "Hello",
    "sessionId": "test-anon-123"
  }'

# Test with locked agent (should return error)
curl -X POST https://dhstx.co/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "builder",
    "message": "Help me code",
    "sessionId": "test-anon-456"
  }'
```

---

## Phase 3: Frontend Deployment

### 3.1 Update Components

```bash
cd /home/ubuntu/productpage

# Backup current components
cp src/components/AIChatInterface.jsx src/components/AIChatInterface-backup.jsx

# Deploy new components
cp src/components/AIChatInterface-with-tokens.jsx src/components/AIChatInterface.jsx
# TokenUsageDisplay.jsx already created
# PricingPage.jsx already created

# Add new utility files
# agentAccessControl.js already created
```

### 3.2 Update Routes

Add pricing page to your router configuration:

```javascript
// src/App.jsx or wherever routes are defined
import PricingPage from './pages/PricingPage';

// Add route
<Route path="/pricing" element={<PricingPage />} />
```

### 3.3 Create Auth Context (if not exists)

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### 3.4 Wrap App with Auth Provider

```javascript
// src/main.jsx or src/index.jsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### 3.5 Deploy Frontend

```bash
# Commit all changes
git add .
git commit -m "feat: add token usage tracking, tier restrictions, and pricing page"
git push origin main

# Vercel will auto-deploy
```

---

## Phase 4: Testing

### 4.1 Test Anonymous Users

1. Open incognito window
2. Navigate to https://dhstx.co
3. Try to chat with Chief of Staff (should work)
4. Try to chat again (should be blocked after 1 question)
5. Try to select Builder agent (should show lock icon)

### 4.2 Test Free Users

1. Create a free account
2. Verify you have 100 tokens
3. Test chat with Chief of Staff, Connector, Conductor (should work)
4. Try to select Builder (should show upgrade prompt)
5. Send multiple messages until tokens run low
6. Verify token usage display updates

### 4.3 Test Paid Users (Starter)

1. Upgrade account to Starter tier (manually in database for testing)
2. Verify you have 500 tokens
3. Test access to all 13 agents
4. Verify token consumption tracking
5. Check analytics views

### 4.4 Test Token Reset

```sql
-- Manually trigger token reset for testing
SELECT reset_monthly_tokens();

-- Verify tokens were reset
SELECT id, email, tokens_used, tokens_allocated, tokens_reset_date 
FROM users 
WHERE subscription_tier != 'anonymous';
```

---

## Phase 5: Monitoring & Maintenance

### 5.1 Set Up Cron Jobs

**Option A: Supabase Edge Functions (Recommended)**

Create a scheduled edge function to reset tokens daily:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily token reset at midnight UTC
SELECT cron.schedule(
  'reset-monthly-tokens',
  '0 0 * * *',
  $$SELECT reset_monthly_tokens()$$
);

-- Schedule hourly cleanup of expired anonymous sessions
SELECT cron.schedule(
  'cleanup-anonymous-sessions',
  '0 * * * *',
  $$SELECT cleanup_expired_anonymous_sessions()$$
);
```

**Option B: External Cron Service**

Use a service like cron-job.org or EasyCron to hit an API endpoint:

```javascript
// api/cron/reset-tokens.js
export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase.rpc('reset_monthly_tokens');
    if (error) throw error;
    
    return res.status(200).json({ success: true, message: 'Tokens reset' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 5.2 Monitor Usage

```sql
-- Daily usage metrics
SELECT * FROM daily_usage_metrics ORDER BY date DESC LIMIT 30;

-- User usage analytics
SELECT * FROM user_usage_analytics 
WHERE usage_percentage > 80 
ORDER BY usage_percentage DESC;

-- Agent popularity
SELECT * FROM agent_popularity ORDER BY request_count DESC;

-- Cost tracking
SELECT 
  DATE(created_at) as date,
  COUNT(*) as requests,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost_per_request
FROM token_usage
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 5.3 Set Up Alerts

Create alerts for:
- Daily cost exceeds $50
- User approaching token limit (80%+)
- High error rates
- Anonymous session abuse (same IP, multiple sessions)

---

## Phase 6: Stripe Integration (Future)

### 6.1 Set Up Stripe

```bash
npm install stripe @stripe/stripe-js

# Add to .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6.2 Create Stripe Products

```javascript
// Create products in Stripe dashboard or via API
const products = [
  { name: 'Starter', price: 1500, tokens: 500 },
  { name: 'Professional', price: 3900, tokens: 1500 },
  { name: 'Business', price: 9900, tokens: 5000 },
  { name: 'Enterprise', price: 29900, tokens: 10000 }
];
```

### 6.3 Handle Webhooks

```javascript
// api/webhooks/stripe.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful subscription
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        // Handle subscription changes
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        // Handle cancellation
        await handleSubscriptionCancelled(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
```

---

## Rollback Plan

If issues arise:

```bash
# Rollback API
git revert HEAD
git push origin main

# Rollback database (if needed)
# Run rollback script
DROP TABLE IF EXISTS token_usage CASCADE;
DROP TABLE IF EXISTS subscription_history CASCADE;
DROP TABLE IF EXISTS anonymous_sessions CASCADE;
DROP TABLE IF EXISTS token_purchases CASCADE;
DROP TABLE IF EXISTS subscription_tiers CASCADE;
DROP FUNCTION IF EXISTS reset_monthly_tokens CASCADE;
DROP FUNCTION IF EXISTS check_token_availability CASCADE;
DROP FUNCTION IF EXISTS consume_tokens CASCADE;
```

---

## Success Metrics

Track these KPIs:

1. **Conversion Rate**: Anonymous → Free → Paid
2. **Token Usage**: Average tokens per user per tier
3. **Churn Rate**: Monthly cancellations
4. **Revenue**: MRR, ARR growth
5. **Cost**: API costs vs revenue (target 97% margin)
6. **User Satisfaction**: NPS, support tickets

---

## Support & Documentation

- User documentation: https://dhstx.co/docs/tokens
- Admin dashboard: https://dhstx.co/admin/analytics
- Support email: support@dhstx.co
- Status page: https://status.dhstx.co

---

## Completed ✅

- [x] Database schema design
- [x] Token tracking middleware
- [x] Updated API with tier restrictions
- [x] Frontend components (TokenUsageDisplay, PricingPage)
- [x] Agent access control utilities
- [x] Deployment documentation

## Next Steps 🚀

1. Run database migration in Supabase
2. Deploy updated API to Vercel
3. Deploy frontend changes
4. Test all tiers thoroughly
5. Set up monitoring and alerts
6. Integrate Stripe for payments
7. Launch marketing campaign

