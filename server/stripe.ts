import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

/**
 * Create a Stripe Checkout session for domain compliance report
 */
export async function createCheckoutSession(
  domainId: string,
  domain: string,
  couponCode?: string
): Promise<{ sessionId: string; url: string }> {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is not set");
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/?canceled=1`,
    metadata: {
      domainId,
      domain,
    },
  };

  // Apply coupon if provided
  if (couponCode) {
    sessionParams.discounts = [{ coupon: couponCode }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

