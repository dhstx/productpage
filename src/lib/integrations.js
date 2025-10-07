export function getIntegrationHealth() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripeWebhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  return [
    {
      name: 'Supabase Auth',
      status: supabaseUrl && supabaseAnonKey ? 'configured' : 'missing',
      details: supabaseUrl && supabaseAnonKey ? 'API keys detected' : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    },
    {
      name: 'Stripe Payments',
      status: stripeKey ? 'configured' : 'missing',
      details: stripeKey ? 'Publishable key detected' : 'Set VITE_STRIPE_PUBLISHABLE_KEY.'
    },
    {
      name: 'Stripe Webhooks',
      status: stripeWebhookSecret ? 'configured' : 'missing',
      details: stripeWebhookSecret ? 'Webhook secret detected' : 'Set VITE_STRIPE_WEBHOOK_SECRET.'
    },
    {
      name: 'Error Monitoring',
      status: sentryDsn ? 'configured' : 'missing',
      details: sentryDsn ? 'Sentry DSN detected' : 'Set VITE_SENTRY_DSN to enable error logging.'
    }
  ];
}

export function logIntegrationIssue(source, error) {
  // eslint-disable-next-line no-console
  console.error(`[integration:${source}]`, error);
}
