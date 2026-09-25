// In-memory sliding-window rate limiter. Per-server-instance, same tradeoff as the
// cache in quota.js — fine for this traffic scale, wouldn't hold up distributed across
// many instances, which this dashboard doesn't run at.

const buckets = new Map(); // key -> array of request timestamps (ms)

/**
 * Returns { allowed, remaining, retryAfterMs }.
 * @param {string} key - unique per limiter + identity, e.g. `login:${ip}`
 * @param {number} limit - max requests allowed in the window
 * @param {number} windowMs - window size in ms
 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const retryAfterMs = windowMs - (now - timestamps[0]);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length, retryAfterMs: 0 };
}

/**
 * Extracts a best-effort client IP from a Next.js Request, for rate-limit keying.
 * Render sits behind a proxy, so x-forwarded-for is the real source of truth there.
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

// Named limit presets so every route uses a deliberate, documented number rather than
// a magic value invented inline.
export const LIMITS = {
  // Login is the single most attack-prone route: brute-forcing the shared access code.
  LOGIN: { limit: 5, windowMs: 5 * 60 * 1000 }, // 5 attempts per 5 minutes per IP
  // Any authenticated write action taken from the dashboard.
  WRITE_ACTION: { limit: 20, windowMs: 60 * 1000 },
  // Read-heavy API routes (search, username resolution) — generous but not unlimited.
  READ: { limit: 60, windowMs: 60 * 1000 },
};
