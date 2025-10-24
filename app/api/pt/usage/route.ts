import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';

export async function GET() {
  try {
    await requireSession();
    return NextResponse.json({
      core: { used: 0, total: 100 },
      advanced: { used: 0, total: 50 }
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
