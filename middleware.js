import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from './lib/session';
import { rateLimit, getClientIP, LIMITS } from './lib/rateLimit';
import { config as appConfig } from './lib/config';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rate-limit the login route before it even reaches the handler — this is the
  // single most attack-prone surface (brute-forcing the shared access code).
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    const ip = getClientIP(request);
    const { allowed, retryAfterMs } = rateLimit(`login:${ip}`, LIMITS.LOGIN.limit, LIMITS.LOGIN.windowMs);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, reason: 'Too many login attempts. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
      );
    }
    return NextResponse.next();
  }

  // Everything under /dashboard requires a valid session.
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token, appConfig.sessionSecret) : null;

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Next.js requires this literal export name for route matching config.
export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/login'],
};
