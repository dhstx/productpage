// Stripe payment routes
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createCheckoutSession, getCheckoutSession } from './checkout.js';
import createTopupSession from './create-topup-session.js';
import { handleWebhook } from './webhooks.js';
import { downloadInvoicePDF, listInvoices } from './invoices.js';

const router = express.Router();

// Checkout routes (allow public; validation done server-side with userId lookups)
router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-topup-session', createTopupSession);
router.get('/checkout-session/:sessionId', getCheckoutSession);

// Backward-compatibility alias: POST /api/stripe/checkout
router.post('/checkout', createCheckoutSession);

// Webhook route (no auth - verified by Stripe signature)
router.post('/webhooks', express.raw({ type: 'application/json' }), handleWebhook);

// Invoice routes (require authentication)
router.get('/invoices', requireAuth, listInvoices);
router.get('/invoices/:invoiceId/pdf', requireAuth, downloadInvoicePDF);

export default router;

