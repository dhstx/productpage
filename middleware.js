import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/members", "/platforms", "/billing", "/settings"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    const authed = req.cookies.get("auth")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/members", "/platforms", "/billing", "/settings"]
};
