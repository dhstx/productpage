# Pricing System Integration Guide

**Date:** October 22, 2025  
**Status:** Partial Implementation  
**Estimated Points:** 60 pts (Large) - **20 pts completed** (33%)

---

## 🎯 Overview

This guide covers the integration of the PT-based pricing system into the frontend, connecting to the backend API we built earlier.

## ✅ What Was Implemented (20 pts)

### 1. Updated Pricing Page (`PricingPage-new.jsx`) - 10 pts ✅

**Features:**
- 5-tier structure (Freemium, Entry, Pro, Pro Plus, Business)
- Monthly/Annual billing toggle with 17% savings
- PT allocation display for each tier
- Feature comparison table
- FAQ section
- Trust badges
- Enterprise CTA

**Status:** Complete and ready to use

### 2. Subscription Success Page (`SubscriptionSuccess.jsx`) - 5 pts ✅

**Features:**
- Success animation
- Next steps guide
- Quick actions (Dashboard, Billing)
- Help links

**Status:** Complete, needs Stripe session API integration

### 3. Subscription Cancel Page (`SubscriptionCancel.jsx`) - 5 pts ✅

**Features:**
- Cancellation message
- Common reasons display
- Quick actions (View Plans, Dashboard, Contact)
- Help section

**Status:** Complete and ready to use

---

## ⏳ Remaining Work (40 pts)

### 4. PT Health Bar Integration (10 pts)

**Goal:** Add PT usage visualization to Dashboard and other pages

**Files to Create/Update:**
- Use existing `src/components/PTHealthBar.jsx` (already created)
- Update `src/pages/Dashboard.jsx` to include PT health bar
- Connect to backend PT tracking API

**Implementation:**

```jsx
// In Dashboard.jsx
import PTHealthBar from '../components/PTHealthBar';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

function Dashboard() {
  const { user } = useAuth();
  const [ptData, setPtData] = useState(null);

  useEffect(() => {
    fetchPTUsage();
  }, [user]);

  async function fetchPTUsage() {
    const response = await fetch('/api/pt/usage', {
      headers: { 'Authorization': `Bearer ${user.access_token}` }
    });
    const data = await response.json();
    setPtData(data);
  }

  return (
    <div>
      {/* Add PT Health Bar at top */}
      {ptData && (
        <PTHealthBar
          corePT={ptData.core}
          advancedPT={ptData.advanced}
          tier={ptData.tier}
        />
      )}
      
      {/* Rest of dashboard */}
    </div>
  );
}
```

**API Endpoint Needed:**
- `GET /api/pt/usage` - Returns current PT usage

**Status:** Component exists, needs integration

---

### 5. Billing Page Update (15 pts)

**Goal:** Complete billing page with PT usage, Stripe integration, and subscription management

**Files to Update:**
- `src/pages/Billing.jsx` - Major enhancement

**Features to Add:**
1. Current subscription display
2. PT usage overview (Core + Advanced)
3. Billing history table
4. Payment method management
5. Tier upgrade/downgrade flow
6. PT top-up purchase
7. Invoice download
8. Subscription cancellation

**Implementation Outline:**

```jsx
// Billing.jsx structure
function Billing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Current Plan Section */}
      <CurrentPlanCard />
      
      {/* PT Usage Section */}
      <PTUsageCard />
      
      {/* Billing History */}
      <BillingHistoryTable />
      
      {/* Payment Method */}
      <PaymentMethodCard />
      
      {/* Upgrade/Downgrade */}
      <PlanManagementCard />
    </div>
  );
}
```

**API Endpoints Needed:**
- `GET /api/billing/subscription` - Get current subscription
- `GET /api/billing/history` - Get billing history
- `POST /api/billing/upgrade` - Upgrade tier
- `POST /api/billing/downgrade` - Downgrade tier
- `POST /api/billing/topup` - Purchase PT top-up
- `POST /api/billing/cancel` - Cancel subscription
- `GET /api/billing/invoice/:id` - Download invoice

**Status:** Needs implementation

---

### 6. Stripe Checkout Integration (10 pts)

**Goal:** Implement Stripe checkout flow for subscriptions and top-ups

**Files to Create:**
- `src/lib/stripe/checkout.js` - Stripe checkout helper

**Implementation:**

```javascript
// src/lib/stripe/checkout.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(tier, billingCycle = 'monthly') {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, billingCycle }),
  });
  
  const { sessionId } = await response.json();
  
  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

export async function createTopUpSession(amount) {
  const response = await fetch('/api/stripe/create-topup-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  
  const { sessionId } = await response.json();
  
  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}
```

**Usage in PricingPage:**

```jsx
import { createCheckoutSession } from '../lib/stripe/checkout';

function PricingPage() {
  async function handleSubscribe(tier) {
    try {
      await createCheckoutSession(tier, billingCycle);
    } catch (error) {
      alert('Checkout failed. Please try again.');
    }
  }
  
  // Update CTA buttons to call handleSubscribe
}
```

**API Endpoints Needed:**
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/create-topup-session`

**Status:** Needs implementation

---

### 7. Usage Monitoring Dashboard (5 pts)

**Goal:** Add usage monitoring to Dashboard

**Files to Update:**
- `src/pages/Dashboard.jsx`
- Use existing `src/components/UsageMonitoringDashboard.jsx`

**Implementation:**

```jsx
// In Dashboard.jsx
import UsageMonitoringDashboard from '../components/UsageMonitoringDashboard';

function Dashboard() {
  return (
    <div>
      {/* PT Health Bar */}
      <PTHealthBar ... />
      
      {/* Usage Monitoring */}
      <UsageMonitoringDashboard userId={user.id} />
      
      {/* Rest of dashboard */}
    </div>
  );
}
```

**Status:** Component exists, needs integration

---

### 8. Admin Margin Monitoring Route (5 pts)

**Goal:** Add admin route for margin monitoring dashboard

**Files to Update:**
- `src/App.jsx` - Add admin route
- Use existing `src/pages/admin/MarginMonitoringDashboard.jsx`

**Implementation:**

```jsx
// In App.jsx
import MarginMonitoringDashboard from './pages/admin/MarginMonitoringDashboard';
import AdminLayout from './components/AdminLayout';

// Add route
<Route
  path="/admin/margin-monitoring"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <MarginMonitoringDashboard />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```

**Status:** Component exists, needs routing

---

## 📋 Complete Implementation Checklist

### Phase 1: Core Pages (20 pts) ✅
- [x] Create new PricingPage with PT tiers (10 pts)
- [x] Create SubscriptionSuccess page (5 pts)
- [x] Create SubscriptionCancel page (5 pts)

### Phase 2: PT Integration (15 pts)
- [ ] Integrate PT Health Bar into Dashboard (5 pts)
- [ ] Add Usage Monitoring Dashboard (5 pts)
- [ ] Connect to PT tracking API (5 pts)

### Phase 3: Billing System (15 pts)
- [ ] Update Billing page with subscription management (10 pts)
- [ ] Add payment method management (5 pts)

### Phase 4: Stripe Integration (10 pts)
- [ ] Implement Stripe checkout flow (5 pts)
- [ ] Add PT top-up purchase (3 pts)
- [ ] Test complete payment flow (2 pts)

### Phase 5: Admin & Routes (5 pts)
- [ ] Add admin margin monitoring route (2 pts)
- [ ] Update App.jsx with new routes (2 pts)
- [ ] Test all routes (1 pt)

**Total: 60 points**  
**Completed: 20 points (33%)**  
**Remaining: 40 points (67%)**

---

## 🔌 API Endpoints Reference

All these endpoints were created in the backend implementation:

### PT Tracking
- `GET /api/pt/usage` - Get current PT usage
- `POST /api/pt/consume` - Consume PT (called by chat API)
- `GET /api/pt/history` - Get PT usage history

### Billing
- `GET /api/billing/subscription` - Get current subscription
- `POST /api/billing/upgrade` - Upgrade tier
- `POST /api/billing/downgrade` - Downgrade tier
- `GET /api/billing/history` - Get billing history
- `GET /api/billing/invoice/:id` - Download invoice
- `POST /api/billing/cancel` - Cancel subscription

### Stripe
- `POST /api/stripe/create-checkout-session` - Create checkout session
- `POST /api/stripe/create-topup-session` - Create top-up session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/stripe/session?session_id=xxx` - Get session details

### Admin
- `GET /api/admin/margin-monitoring` - Get margin data
- `POST /api/admin/mitigate` - Trigger mitigation action

---

## 🧪 Testing Checklist

### Pricing Page
- [ ] All 5 tiers display correctly
- [ ] Monthly/Annual toggle works
- [ ] Feature comparison table accurate
- [ ] CTA buttons link correctly
- [ ] Responsive on mobile

### Subscription Flow
- [ ] Clicking "Start Pro" opens Stripe checkout
- [ ] Successful payment redirects to success page
- [ ] Cancelled payment redirects to cancel page
- [ ] PT allocation updates after subscription

### PT Tracking
- [ ] PT health bar shows correct usage
- [ ] Colors change based on usage (green/yellow/red)
- [ ] Advanced PT tracked separately
- [ ] Usage updates in real-time

### Billing Page
- [ ] Current subscription displays correctly
- [ ] PT usage shows Core + Advanced breakdown
- [ ] Billing history loads
- [ ] Upgrade/downgrade works
- [ ] PT top-up purchase works
- [ ] Invoice download works

### Admin Dashboard
- [ ] Margin monitoring loads
- [ ] Traffic light system works
- [ ] Alerts display correctly
- [ ] Mitigation actions work

---

## 🚀 Deployment Steps

### Step 1: Update Routes

```jsx
// In App.jsx
import PricingPage from './pages/PricingPage-new';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import MarginMonitoringDashboard from './pages/admin/MarginMonitoringDashboard';

// Add routes
<Route path="/pricing" element={<PricingPage />} />
<Route path="/subscription/success" element={<SubscriptionSuccess />} />
<Route path="/subscription/cancel" element={<SubscriptionCancel />} />
<Route path="/admin/margin-monitoring" element={<ProtectedRoute><MarginMonitoringDashboard /></ProtectedRoute>} />
```

### Step 2: Add Environment Variables

```bash
# In Vercel
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Configure Stripe

1. Create products in Stripe Dashboard
2. Set up webhook endpoint
3. Add price IDs to environment variables

### Step 4: Test Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5173/api/stripe/webhook

# Test checkout
npm run dev
# Navigate to /pricing
# Click "Start Pro"
# Complete test checkout
```

### Step 5: Deploy

```bash
git add -A
git commit -m "feat: integrate PT-based pricing system"
git push origin main
```

---

## 📊 Progress Tracking

| Task | Points | Status | Notes |
|------|--------|--------|-------|
| New Pricing Page | 10 | ✅ Complete | Ready to use |
| Subscription Success | 5 | ✅ Complete | Needs API integration |
| Subscription Cancel | 5 | ✅ Complete | Ready to use |
| PT Health Bar Integration | 5 | ⏳ Pending | Component exists |
| Usage Monitoring | 5 | ⏳ Pending | Component exists |
| Billing Page Update | 10 | ⏳ Pending | Major work needed |
| Stripe Checkout | 5 | ⏳ Pending | Helper needed |
| PT Top-up | 3 | ⏳ Pending | Part of Stripe |
| Admin Route | 2 | ⏳ Pending | Simple routing |
| App.jsx Routes | 2 | ⏳ Pending | Simple routing |
| Testing | 3 | ⏳ Pending | After integration |
| **TOTAL** | **60** | **20/60** | **33% complete** |

---

## 🔄 Next Steps

**Immediate (10 pts):**
1. Integrate PT Health Bar into Dashboard (5 pts)
2. Add admin margin monitoring route (2 pts)
3. Update App.jsx with new routes (3 pts)

**Short-term (15 pts):**
1. Implement Stripe checkout flow (10 pts)
2. Add Usage Monitoring to Dashboard (5 pts)

**Medium-term (15 pts):**
1. Complete Billing page update (15 pts)

---

## 💡 Implementation Tips

### For PT Health Bar Integration

The `PTHealthBar` component is already built and accepts these props:

```jsx
<PTHealthBar
  corePT={{
    used: 450,
    total: 1000,
    percentage: 45
  }}
  advancedPT={{
    used: 12,
    total: 50,
    percentage: 24
  }}
  tier="Pro"
/>
```

Just fetch the data from the API and pass it in.

### For Stripe Integration

Use the existing `stripeBilling.js` service we created:

```javascript
import { createSubscription, createTopUpCheckout } from '../api/services/stripeBilling';

// For subscriptions
const session = await createSubscription(userId, priceId);
window.location.href = session.url;

// For top-ups
const session = await createTopUpCheckout(userId, amount);
window.location.href = session.url;
```

### For Billing Page

Break it into smaller components:

1. `CurrentPlanCard.jsx` - Shows current subscription
2. `PTUsageCard.jsx` - Shows PT usage with charts
3. `BillingHistoryTable.jsx` - Shows past invoices
4. `PaymentMethodCard.jsx` - Manages payment methods
5. `PlanManagementCard.jsx` - Upgrade/downgrade controls

Then compose them in `Billing.jsx`.

---

**Status:** 🟡 Partial implementation complete  
**Next Action:** Integrate PT Health Bar and add routes  
**Estimated Time:** 2-3 hours for remaining 40 points

