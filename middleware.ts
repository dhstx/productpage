import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC = [
  /^\/$/,
  /^\/site\.webmanifest$/,
  /^\/favicon\.ico$/,
  /^\/icons\/.*$/,
  /^\/robots\.txt$/,
  /^\/api\/stripe\/webhook$/
];

const PROTECTED = [
  /^\/app(\/.*)?$/,
  /^\/dashboard(\/.*)?$/,
  /^\/agents(\/.*)?$/,
  /^\/settings(\/.*)?$/
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  if (PROTECTED.some((pattern) => pattern.test(pathname))) {
    const hasSession = req.cookies.get('sb-access-token') || req.headers.get('authorization');

    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|public|images|assets).*)']
};
