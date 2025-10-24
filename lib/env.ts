const req = (k: string) => {
  const v = process.env[k];
  if (!v) {
    throw new Error(`Missing env: ${k}`);
  }
  return v;
};

export const ENV = {
  SUPABASE_URL: req('SUPABASE_URL'),
  SUPABASE_ANON_KEY: req('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_KEY: req('SUPABASE_SERVICE_KEY'),
  STRIPE_SECRET_KEY: req('STRIPE_SECRET_KEY'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: req('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  STRIPE_WEBHOOK_SECRET: req('STRIPE_WEBHOOK_SECRET'),
  ANTHROPIC_API_KEY: req('ANTHROPIC_API_KEY'),
  NEXTAUTH_URL: req('NEXTAUTH_URL')
};
