import { config } from './config';

// A hard cutoff that starts refusing to serve pages once the budget is hit would make
// the dashboard less reliable, not more — so this tracks usage and logs loudly as it
// approaches the ceiling, while the actual budget compliance comes from the caching
// and read patterns used throughout lib/data/*, not from blocking requests here.

let dailyCount = 0;
let windowStartedAt = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

function rolloverIfNewDay() {
  if (Date.now() - windowStartedAt > DAY_MS) {
    dailyCount = 0;
    windowStartedAt = Date.now();
  }
}

export function recordFirestoreRequest(count = 1) {
  rolloverIfNewDay();
  dailyCount += count;
  const budget = config.dailyRequestBudget;
  if (dailyCount === budget) {
    console.warn(`[quota] Firestore request budget of ${budget}/day reached.`);
  } else if (dailyCount > budget && dailyCount % 500 === 0) {
    console.warn(`[quota] Over daily Firestore budget: ${dailyCount}/${budget} requests.`);
  }
}

export function getQuotaStatus() {
  rolloverIfNewDay();
  return { used: dailyCount, budget: config.dailyRequestBudget, windowStartedAt };
}

// --- Simple in-memory TTL cache, keyed by string ---
// Per-server-instance only (not shared across multiple Render instances), which is
// fine at this traffic scale — the point is avoiding repeat reads within one instance
// during a single staff session, not building a distributed cache.
const store = new Map();

export async function cached(key, ttlMs, fetcher) {
  const hit = store.get(key);
  if (hit && Date.now() < hit.expiresAt) return hit.value;

  const value = await fetcher();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function invalidateCache(key) {
  store.delete(key);
}

export const TTL = {
  SHORT: 30 * 1000, // fast-moving views (giveaways, tickets)
  MEDIUM: 2 * 60 * 1000, // config/roster views that rarely change mid-session
  LONG: 15 * 60 * 1000, // username resolution, bot config reference pages
};
