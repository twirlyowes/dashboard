import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from './session';
import { config } from './config';

/**
 * Reads and verifies the session cookie in a Server Component. Returns null if
 * missing/invalid/expired — callers decide what to do (middleware already redirects
 * unauthenticated requests away from /dashboard, so this is mostly for reading the
 * discordId/level once inside a page).
 */
export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token, config.sessionSecret);
}

export function isAdmin(session) {
  return session?.level === 'admin';
}
