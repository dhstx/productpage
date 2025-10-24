import { cookies, headers } from 'next/headers';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

import { ENV } from '../env';

type SessionSummary = {
  access_token: string;
  user: User;
};

export async function requireSession(): Promise<{ sb: SupabaseClient; session: SessionSummary }> {
  const cookieStore = cookies();
  const authHeader = headers().get('authorization') ?? headers().get('Authorization');
  const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const accessToken = bearerToken ?? cookieStore.get('sb-access-token')?.value ?? null;

  if (!accessToken) {
    throw new Error('UNAUTHORIZED');
  }

  const adminClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);
  const { data, error } = await adminClient.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error('UNAUTHORIZED');
  }

  const refreshToken = cookieStore.get('sb-refresh-token')?.value ?? null;
  const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

  if (refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  return {
    sb: supabase,
    session: {
      access_token: accessToken,
      user: data.user
    }
  };
}
