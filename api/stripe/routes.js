// Stripe payment routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
// Use the tier/billingCycle aware handler used by the frontend
import createCheckoutSession from './create-checkout-session.js';
// Retain the getCheckoutSession from the generic checkout file
import { getCheckoutSession } from './checkout.js';
import createTopupSession from './create-topup-session.js';
import createPortalSession from './create-portal-session.js';
import updateSubscription from './update-subscription.js';
import cancelSubscription from './cancel-subscription.js';
import getSessionByQuery from './session.js';
import { handleWebhook } from './webhooks.js';
import { downloadInvoicePDF, listInvoices } from './invoices.js';

const router = express.Router();

// Checkout routes (allow public; validation done server-side with userId lookups)
router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-topup-session', createTopupSession);
router.get('/checkout-session/:sessionId', getCheckoutSession);
// Alias used by frontend success pages: /api/stripe/session?session_id=...
router.get('/session', getSessionByQuery);

// Backward-compatibility alias: POST /api/stripe/checkout
router.post('/checkout', createCheckoutSession);

// Customer portal and subscription management
router.post('/create-portal-session', createPortalSession);
router.post('/update-subscription', updateSubscription);
router.post('/cancel-subscription', cancelSubscription);

// Webhook route (no auth - verified by Stripe signature)
router.post('/webhooks', express.raw({ type: 'application/json' }), handleWebhook);

// Invoice routes (require authentication)
router.get('/invoices', requireAuth, listInvoices);
router.get('/invoices/:invoiceId/pdf', requireAuth, downloadInvoicePDF);

export default router;

