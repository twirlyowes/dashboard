import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/getSession';
import { searchGuildMembers } from '../../../../lib/discordRest';
import { rateLimit, getClientIP, LIMITS } from '../../../../lib/rateLimit';

export async function GET(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, reason: 'Not authenticated.' }, { status: 401 });

  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = rateLimit(`search-members:${ip}`, LIMITS.READ.limit, LIMITS.READ.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, reason: 'Too many searches.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  const query = new URL(request.url).searchParams.get('query') || '';
  if (query.trim().length < 2) return NextResponse.json({ ok: true, members: [] });

  try {
    const members = await searchGuildMembers(query);
    return NextResponse.json({ ok: true, members });
  } catch (err) {
    return NextResponse.json({ ok: false, reason: 'Search failed.' }, { status: 500 });
  }
}
