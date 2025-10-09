// Stripe Webhook Handler
import Stripe from 'stripe';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📨 Received webhook: ${event.type}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout completed:', session.id);
  
  const userId = session.metadata.user_id;
  const planId = session.metadata.plan_id;

  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Update subscription
  await db.subscriptions.upsert({
    user_id: userId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: session.subscription,
    plan_id: planId,
    status: 'active'
  });

  console.log(`Updated subscription for user ${userId} to ${planId}`);
}

async function handleSubscriptionCreated(subscription) {
  console.log('✅ Subscription created:', subscription.id);
  
  const userId = subscription.metadata.user_id;
  const planId = subscription.metadata.plan_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  await db.subscriptions.upsert({
    user_id: userId,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    plan_id: planId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end
  });
}

async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);

  await db.subscriptions.updateByStripeId(subscription.id, {
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
  });
}

async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  await db.subscriptions.updateByStripeId(subscription.id, {
    status: 'canceled',
    canceled_at: new Date()
  });
}

async function handleInvoicePaid(invoice) {
  console.log('💰 Invoice paid:', invoice.id);

  // Find user by customer ID
  const subscription = await db.subscriptions.findByStripeId(invoice.subscription);
  
  if (!subscription) {
    console.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Store invoice
  await db.invoices.create({
    user_id: subscription.user_id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status,
    invoice_pdf_url: invoice.invoice_pdf,
    invoice_number: invoice.number,
    period_start: new Date(invoice.period_start * 1000),
    period_end: new Date(invoice.period_end * 1000)
  });
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('⚠️ Invoice payment failed:', invoice.id);

  const subscription = await db.subscriptions.findByStripeId(invoice.subscription);
  
  if (subscription) {
    await db.subscriptions.updateByStripeId(invoice.subscription, {
      status: 'past_due'
    });
  }
}

