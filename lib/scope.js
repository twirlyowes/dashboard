// Enforces the standing rule: admins can look up anyone, non-admin staff can only see
// their own data. Applied to any page where a Discord ID is searched.

/**
 * Given the requested userId (from a search box / query param) and the current
 * session, returns the userId that should actually be queried — the requester's own
 * ID if they're non-admin staff, regardless of what they typed, or the requested ID
 * as-is for admins.
 */
export function scopedUserId(session, requestedUserId) {
  if (!session) return null;
  if (session.level === 'admin') return requestedUserId || null;
  // Non-admin: always their own ID, ignoring anything else requested.
  return session.discordId;
}

export function isScopeRestricted(session, requestedUserId) {
  return session?.level !== 'admin' && requestedUserId && requestedUserId !== session.discordId;
}
