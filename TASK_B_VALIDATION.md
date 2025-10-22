# Task B Validation Checklist
## Stripe Checkout Integration (10 pts)

**Date:** October 22, 2025  
**Status:** ✅ Complete - Ready for Testing

---

## 📋 What Was Implemented

### 1. Stripe Checkout Helper Library (5 pts) ✅

**File:** `src/lib/stripe/checkout.js`

**Functions Implemented:**
- ✅ `createSubscriptionCheckout()` - Create subscription checkout session
- ✅ `createTopUpCheckout()` - Create PT top-up checkout session
- ✅ `getTopUpPackages()` - Get PT packages with volume discounts
- ✅ `getTierPriceIds()` - Get price IDs from env vars
- ✅ `validateStripeConfig()` - Validate Stripe configuration
- ✅ `getCheckoutSession()` - Get session details after checkout
- ✅ `cancelSubscription()` - Cancel subscription
- ✅ `updateSubscription()` - Upgrade/downgrade subscription
- ✅ `getCustomerPortalUrl()` - Get Stripe customer portal URL

**Features:**
- Loads Stripe.js dynamically
- Handles both direct URL redirect and Stripe.js redirect
- Comprehensive error handling
- Volume discounts for PT top-ups (20-40% off)
- Configuration validation

**Validation:**
```bash
# Check file exists
ls -la src/lib/stripe/checkout.js

# Check exports
grep -n "export.*function" src/lib/stripe/checkout.js

# Count functions
grep -c "export.*function" src/lib/stripe/checkout.js
# Should be 9 functions
```

---

### 2. Updated Pricing Page with Stripe Integration (3 pts) ✅

**File:** `src/pages/PricingPage-with-stripe.jsx`

**Features Added:**
- ✅ Import Stripe checkout helper
- ✅ Import useAuth hook
- ✅ `handleSubscribe()` function with loading states
- ✅ Check if user is logged in before checkout
- ✅ Redirect to register if not logged in
- ✅ Loading spinner on CTA buttons during checkout
- ✅ Error handling with user-friendly messages
- ✅ Disabled state while processing

**User Flow:**
1. User clicks "Start Pro" button
2. If not logged in → Redirect to `/register?tier=pro`
3. If logged in → Show loading spinner
4. Call `createSubscriptionCheckout('pro', 'monthly', userId)`
5. Redirect to Stripe Checkout
6. After payment → Redirect to `/subscription/success`
7. If cancelled → Redirect to `/subscription/cancel`

**Validation:**
```bash
# Check file exists
ls -la src/pages/PricingPage-with-stripe.jsx

# Check imports
grep -n "import.*createSubscriptionCheckout" src/pages/PricingPage-with-stripe.jsx
grep -n "import.*useAuth" src/pages/PricingPage-with-stripe.jsx

# Check handleSubscribe function
grep -n "handleSubscribe" src/pages/PricingPage-with-stripe.jsx
```

---

### 3. Backend API Endpoints (2 pts) ✅

#### Create Checkout Session Endpoint

**File:** `api/stripe/create-checkout-session.js`

**Features:**
- ✅ POST endpoint
- ✅ Validates tier and billing cycle
- ✅ Gets or creates Stripe customer
- ✅ Creates checkout session with metadata
- ✅ Returns session ID and URL
- ✅ Handles errors gracefully

**Request:**
```json
POST /api/stripe/create-checkout-session
{
  "tier": "pro",
  "billingCycle": "monthly",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Create Top-Up Session Endpoint

**File:** `api/stripe/create-topup-session.js`

**Features:**
- ✅ POST endpoint
- ✅ Validates amount and PT amount
- ✅ Creates one-time payment session
- ✅ Returns session ID and URL
- ✅ Handles errors gracefully

**Request:**
```json
POST /api/stripe/create-topup-session
{
  "amount": 20,
  "ptAmount": 500,
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Validation:**
```bash
# Check files exist
ls -la api/stripe/create-checkout-session.js
ls -la api/stripe/create-topup-session.js

# Check Stripe imports
grep -n "import Stripe" api/stripe/create-checkout-session.js
grep -n "import Stripe" api/stripe/create-topup-session.js
```

---

## 🧪 Testing Checklist

### Manual Testing

#### 1. Stripe Configuration
- [ ] Add environment variables:
  ```bash
  # Frontend (.env)
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  VITE_STRIPE_PRICE_ENTRY_MONTHLY=price_...
  VITE_STRIPE_PRICE_PRO_MONTHLY=price_...
  VITE_STRIPE_PRICE_PROPLUS_MONTHLY=price_...
  VITE_STRIPE_PRICE_BUSINESS_MONTHLY=price_...
  
  # Backend (.env)
  STRIPE_SECRET_KEY=sk_test_...
  FRONTEND_URL=http://localhost:5173
  ```

#### 2. Pricing Page Checkout
- [ ] Navigate to `/pricing`
- [ ] Click "Start Pro" (not logged in)
- [ ] Should redirect to `/register?tier=pro`
- [ ] Register and login
- [ ] Navigate back to `/pricing`
- [ ] Click "Start Pro" (logged in)
- [ ] Should show loading spinner
- [ ] Should redirect to Stripe Checkout
- [ ] Complete test payment
- [ ] Should redirect to `/subscription/success`

#### 3. Stripe Checkout Flow
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date
- [ ] CVC: Any 3 digits
- [ ] ZIP: Any 5 digits
- [ ] Click "Pay"
- [ ] Should redirect to success page

#### 4. Cancel Flow
- [ ] Start checkout
- [ ] Click browser back button
- [ ] Should redirect to `/subscription/cancel`

#### 5. Error Handling
- [ ] Try with invalid tier
- [ ] Try with missing user ID
- [ ] Try with invalid price ID
- [ ] Should show error message

### Automated Testing

```bash
# Run from project root

# 1. Check all files exist
echo "Checking files..."
test -f src/lib/stripe/checkout.js && echo "✅ checkout.js exists" || echo "❌ Missing"
test -f src/pages/PricingPage-with-stripe.jsx && echo "✅ PricingPage-with-stripe.jsx exists" || echo "❌ Missing"
test -f api/stripe/create-checkout-session.js && echo "✅ create-checkout-session.js exists" || echo "❌ Missing"
test -f api/stripe/create-topup-session.js && echo "✅ create-topup-session.js exists" || echo "❌ Missing"

# 2. Check function count in checkout.js
echo "\nChecking functions..."
FUNC_COUNT=$(grep -c "export.*function" src/lib/stripe/checkout.js)
echo "Functions in checkout.js: $FUNC_COUNT (should be 9)"
test $FUNC_COUNT -ge 9 && echo "✅ All functions present" || echo "❌ Missing functions"

# 3. Check imports
echo "\nChecking imports..."
grep -q "import.*Stripe" api/stripe/create-checkout-session.js && echo "✅ Stripe imported in create-checkout-session" || echo "❌ Missing"
grep -q "import.*createSubscriptionCheckout" src/pages/PricingPage-with-stripe.jsx && echo "✅ Checkout helper imported in PricingPage" || echo "❌ Missing"

# 4. Check environment variables
echo "\nChecking environment variables..."
test -f .env && grep -q "VITE_STRIPE_PUBLISHABLE_KEY" .env && echo "✅ Stripe key in .env" || echo "⚠️  Add VITE_STRIPE_PUBLISHABLE_KEY to .env"

echo "\n✅ Validation complete!"
```

---

## 📊 Summary

| Task | Points | Status | File |
|------|--------|--------|------|
| Stripe checkout helper | 5 | ✅ Complete | `checkout.js` |
| Update pricing page | 3 | ✅ Complete | `PricingPage-with-stripe.jsx` |
| Backend API endpoints | 2 | ✅ Complete | `create-checkout-session.js`, `create-topup-session.js` |
| **TOTAL** | **10** | **✅ Complete** | **4 files** |

---

## 🚀 Deployment Steps

### Step 1: Configure Stripe Products

1. Go to Stripe Dashboard → Products
2. Create products:
   - Entry ($19/mo)
   - Pro ($49/mo)
   - Pro Plus ($79/mo)
   - Business ($159/mo)
3. Copy price IDs to environment variables

### Step 2: Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://dhstx.co/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Step 3: Update Environment Variables

```bash
# Vercel
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_ENTRY_MONTHLY
vercel env add STRIPE_PRICE_PRO_MONTHLY
vercel env add STRIPE_PRICE_PROPLUS_MONTHLY
vercel env add STRIPE_PRICE_BUSINESS_MONTHLY
vercel env add FRONTEND_URL
```

### Step 4: Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### Step 5: Replace Files

```bash
cd src/pages
mv PricingPage-with-stripe.jsx PricingPage.jsx
```

### Step 6: Test Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5173/api/stripe/webhook

# Run dev server
npm run dev

# Test checkout flow
```

### Step 7: Commit and Deploy

```bash
git add -A
git commit -m "feat: complete Task B - Stripe checkout integration (10 pts)"
git push origin main
```

---

## ⚠️ Known Issues & Considerations

### Environment Variables Required

**Frontend (.env):**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ENTRY_MONTHLY=price_...
VITE_STRIPE_PRICE_ENTRY_ANNUAL=price_...
VITE_STRIPE_PRICE_PRO_MONTHLY=price_...
VITE_STRIPE_PRICE_PRO_ANNUAL=price_...
VITE_STRIPE_PRICE_PROPLUS_MONTHLY=price_...
VITE_STRIPE_PRICE_PROPLUS_ANNUAL=price_...
VITE_STRIPE_PRICE_BUSINESS_MONTHLY=price_...
VITE_STRIPE_PRICE_BUSINESS_ANNUAL=price_...
```

**Backend (.env):**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://dhstx.co
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

### Dependencies Required

```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0"
  }
}
```

### Database Schema Required

The `users` table must have:
- `stripe_customer_id` column (text, nullable)

### Webhook Handler Required

The webhook handler (`api/stripe/webhook.js`) must handle:
- `checkout.session.completed` - Activate subscription
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Cancel subscription
- `invoice.paid` - Record payment
- `invoice.payment_failed` - Handle failed payment

---

## ✅ Completion Criteria

- [x] Stripe checkout helper created with 9 functions
- [x] Pricing page updated with checkout integration
- [x] Backend API endpoints created
- [x] Loading states added
- [x] Error handling implemented
- [x] User authentication check added
- [x] Redirect logic implemented
- [x] Volume discounts for top-ups
- [x] Configuration validation
- [x] Validation script created
- [x] Documentation complete

**Status: ✅ READY FOR TESTING**

---

## 🔄 Next Steps

After validating Task B:

1. **Configure Stripe** - Create products and webhook
2. **Add environment variables** - All required keys
3. **Install dependencies** - `stripe` and `@stripe/stripe-js`
4. **Test locally** - Use Stripe CLI
5. **Deploy to production** - Push to Vercel
6. **Move to Task C** - Update Billing page (10 pts)

