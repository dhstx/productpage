import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { ENV } from '@/lib/env';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  try {
    const { session } = await requireSession();
    const { amount } = await req.json();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Points Top-Up' },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      success_url: `${ENV.NEXTAUTH_URL}/billing/topup-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.NEXTAUTH_URL}/billing/cancel`,
      customer_email: session.user.email!
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: `create-topup-session: ${e.message}` },
      { status: 500 }
    );
  }
}
