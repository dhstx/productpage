/**
 * Webhook Handler Service
 * 
 * Provides reliable webhook processing with:
 * - Idempotency (prevent duplicate processing)
 * - Retry logic with exponential backoff
 * - Signature verification
 * - Dead letter queue for failed webhooks
 * - Event logging
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Verify webhook signature
 */
export async function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Check if webhook has already been processed (idempotency)
 */
export async function isWebhookProcessed(webhookId) {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('id, status')
    .eq('webhook_id', webhookId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found is OK
    throw error;
  }
  
  return data && data.status === 'processed';
}

/**
 * Log webhook event
 */
export async function logWebhookEvent(webhookData) {
  const { data, error } = await supabase
    .from('webhook_events')
    .insert({
      webhook_id: webhookData.id,
      source: webhookData.source,
      event_type: webhookData.type,
      payload: webhookData.payload,
      status: 'received',
      received_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update webhook status
 */
export async function updateWebhookStatus(webhookId, status, result = null, error = null) {
  const updateData = {
    status,
    processed_at: new Date().toISOString()
  };
  
  if (result) updateData.result = result;
  if (error) updateData.error_message = error;
  
  const { data, error: updateError } = await supabase
    .from('webhook_events')
    .update(updateData)
    .eq('webhook_id', webhookId)
    .select()
    .single();
  
  if (updateError) throw updateError;
  return data;
}

/**
 * Process webhook with retry logic
 */
export async function processWebhookWithRetry(webhookData, handler, maxRetries = 3) {
  let attempt = 0;
  let lastError = null;
  
  while (attempt < maxRetries) {
    try {
      // Check idempotency
      if (await isWebhookProcessed(webhookData.id)) {
        console.log(`Webhook ${webhookData.id} already processed, skipping`);
        return { success: true, duplicate: true };
      }
      
      // Log webhook receipt
      if (attempt === 0) {
        await logWebhookEvent(webhookData);
      }
      
      // Process webhook
      const result = await handler(webhookData);
      
      // Mark as processed
      await updateWebhookStatus(webhookData.id, 'processed', result);
      
      return { success: true, result };
      
    } catch (error) {
      lastError = error;
      attempt++;
      
      console.error(`Webhook processing failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Max retries reached, move to dead letter queue
        await moveToDeadLetterQueue(webhookData, lastError);
        await updateWebhookStatus(webhookData.id, 'failed', null, lastError.message);
      }
    }
  }
  
  return { success: false, error: lastError };
}

/**
 * Move failed webhook to dead letter queue
 */
export async function moveToDeadLetterQueue(webhookData, error) {
  const { data, error: dlqError } = await supabase
    .from('webhook_dead_letter_queue')
    .insert({
      webhook_id: webhookData.id,
      source: webhookData.source,
      event_type: webhookData.type,
      payload: webhookData.payload,
      error_message: error.message,
      error_stack: error.stack,
      failed_at: new Date().toISOString()
    });
  
  if (dlqError) {
    console.error('Failed to add to dead letter queue:', dlqError);
  }
  
  // Send alert
  await sendWebhookFailureAlert(webhookData, error);
}

/**
 * Send alert for webhook failure
 */
async function sendWebhookFailureAlert(webhookData, error) {
  // Send to Slack or email
  const alertMessage = {
    text: '🚨 Webhook Processing Failed',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Webhook ID:* ${webhookData.id}\n*Source:* ${webhookData.source}\n*Event Type:* ${webhookData.type}\n*Error:* ${error.message}`
        }
      }
    ]
  };
  
  // Send to Slack webhook if configured
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertMessage)
      });
    } catch (err) {
      console.error('Failed to send Slack alert:', err);
    }
  }
}

/**
 * Retry failed webhooks from dead letter queue
 */
export async function retryDeadLetterQueue(limit = 10) {
  const { data: failedWebhooks, error } = await supabase
    .from('webhook_dead_letter_queue')
    .select('*')
    .eq('retry_count', 0)
    .limit(limit);
  
  if (error) throw error;
  
  const results = [];
  
  for (const webhook of failedWebhooks) {
    try {
      // Reconstruct webhook data
      const webhookData = {
        id: webhook.webhook_id,
        source: webhook.source,
        type: webhook.event_type,
        payload: webhook.payload
      };
      
      // Get appropriate handler
      const handler = getWebhookHandler(webhook.source, webhook.event_type);
      
      // Retry processing
      const result = await processWebhookWithRetry(webhookData, handler, 1);
      
      if (result.success) {
        // Remove from DLQ
        await supabase
          .from('webhook_dead_letter_queue')
          .delete()
          .eq('id', webhook.id);
        
        results.push({ id: webhook.id, success: true });
      } else {
        // Increment retry count
        await supabase
          .from('webhook_dead_letter_queue')
          .update({ retry_count: webhook.retry_count + 1 })
          .eq('id', webhook.id);
        
        results.push({ id: webhook.id, success: false });
      }
    } catch (err) {
      console.error(`Failed to retry webhook ${webhook.id}:`, err);
      results.push({ id: webhook.id, success: false, error: err.message });
    }
  }
  
  return results;
}

/**
 * Get webhook handler based on source and event type
 */
function getWebhookHandler(source, eventType) {
  // Map of webhook handlers
  const handlers = {
    'stripe': {
      'payment_intent.succeeded': handleStripePaymentSuccess,
      'payment_intent.failed': handleStripePaymentFailed,
      'customer.subscription.created': handleStripeSubscriptionCreated,
      'customer.subscription.updated': handleStripeSubscriptionUpdated,
      'customer.subscription.deleted': handleStripeSubscriptionDeleted,
      'invoice.paid': handleStripeInvoicePaid,
      'invoice.payment_failed': handleStripeInvoicePaymentFailed
    }
  };
  
  const sourceHandlers = handlers[source];
  if (!sourceHandlers) {
    throw new Error(`No handlers found for source: ${source}`);
  }
  
  const handler = sourceHandlers[eventType];
  if (!handler) {
    throw new Error(`No handler found for event type: ${eventType}`);
  }
  
  return handler;
}

// Stripe webhook handlers
async function handleStripePaymentSuccess(webhookData) {
  const paymentIntent = webhookData.payload.data.object;
  
  // Update subscription status
  const { error } = await supabase
    .from('subscription_tiers')
    .update({ 
      status: 'active',
      last_payment_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', paymentIntent.customer);
  
  if (error) throw error;
  
  return { processed: true, payment_intent_id: paymentIntent.id };
}

async function handleStripePaymentFailed(webhookData) {
  const paymentIntent = webhookData.payload.data.object;
  
  // Mark subscription as past_due
  const { error } = await supabase
    .from('subscription_tiers')
    .update({ status: 'past_due' })
    .eq('stripe_customer_id', paymentIntent.customer);
  
  if (error) throw error;
  
  // Send notification to user
  // TODO: Implement email notification
  
  return { processed: true, payment_intent_id: paymentIntent.id };
}

async function handleStripeSubscriptionCreated(webhookData) {
  const subscription = webhookData.payload.data.object;
  
  // Create or update subscription record
  const { error } = await supabase
    .from('subscription_tiers')
    .upsert({
      user_id: subscription.metadata.user_id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      tier: subscription.metadata.tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    });
  
  if (error) throw error;
  
  return { processed: true, subscription_id: subscription.id };
}

async function handleStripeSubscriptionUpdated(webhookData) {
  const subscription = webhookData.payload.data.object;
  
  // Update subscription record
  const { error } = await supabase
    .from('subscription_tiers')
    .update({
      status: subscription.status,
      tier: subscription.metadata.tier,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
  
  if (error) throw error;
  
  return { processed: true, subscription_id: subscription.id };
}

async function handleStripeSubscriptionDeleted(webhookData) {
  const subscription = webhookData.payload.data.object;
  
  // Mark subscription as canceled
  const { error } = await supabase
    .from('subscription_tiers')
    .update({ 
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
  
  if (error) throw error;
  
  return { processed: true, subscription_id: subscription.id };
}

async function handleStripeInvoicePaid(webhookData) {
  const invoice = webhookData.payload.data.object;
  
  // Log invoice payment
  const { error } = await supabase
    .from('billing_history')
    .insert({
      user_id: invoice.metadata.user_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'paid',
      paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
    });
  
  if (error) throw error;
  
  return { processed: true, invoice_id: invoice.id };
}

async function handleStripeInvoicePaymentFailed(webhookData) {
  const invoice = webhookData.payload.data.object;
  
  // Log failed payment
  const { error } = await supabase
    .from('billing_history')
    .insert({
      user_id: invoice.metadata.user_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      failed_at: new Date().toISOString()
    });
  
  if (error) throw error;
  
  // Send notification to user
  // TODO: Implement email notification
  
  return { processed: true, invoice_id: invoice.id };
}

export default {
  verifyWebhookSignature,
  isWebhookProcessed,
  logWebhookEvent,
  updateWebhookStatus,
  processWebhookWithRetry,
  moveToDeadLetterQueue,
  retryDeadLetterQueue
};

