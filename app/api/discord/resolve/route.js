import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/getSession';
import { resolveUsernames } from '../../../../lib/discordUsers';
import { rateLimit, getClientIP, LIMITS } from '../../../../lib/rateLimit';

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, reason: 'Not authenticated.' }, { status: 401 });

  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = rateLimit(`resolve:${ip}`, LIMITS.READ.limit, LIMITS.READ.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, reason: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.slice(0, 50) : []; // hard cap per request
  if (ids.length === 0) return NextResponse.json({ ok: true, users: {} });

  const userMap = await resolveUsernames(ids);
  return NextResponse.json({ ok: true, users: Object.fromEntries(userMap) });
}
