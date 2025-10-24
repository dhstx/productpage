import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';

export async function GET() {
  try {
    await requireSession();
    return NextResponse.json({
      agents: 12,
      conversations: 0,
      team: 1,
      plan: 'Enterprise'
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
