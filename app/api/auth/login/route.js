import { NextResponse } from 'next/server';
import { login } from '../../../../lib/dashboardAuth';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from '../../../../lib/session';

// Rate limiting for this route already happens in middleware.js, before this handler
// is ever reached — kept there rather than here so it applies even if this file's
// logic changes later.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { discordId, accessCode } = body;

  const result = await login(discordId, accessCode);
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, level: result.level });
  response.cookies.set(SESSION_COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
    path: '/',
  });
  return response;
}
