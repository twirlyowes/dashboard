import { config } from './config';
import { db } from './firebaseAdmin';
import { cached, TTL, recordFirestoreRequest } from './quota';

const CACHE_COLLECTION = 'discordUserCache';
const FIRESTORE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // usernames rarely change; 24h is generous, not lax

// In-memory layer avoids even the Firestore cache read for the very common case of
// resolving the same handful of staff IDs repeatedly within one dashboard session.
const memoryCache = new Map(); // id -> { username, globalName, avatarURL, cachedAt }

function memoryHit(id) {
  const hit = memoryCache.get(id);
  if (hit && Date.now() - hit.cachedAt < TTL.LONG) return hit;
  return null;
}

async function firestoreHit(id) {
  const snap = await db().collection(CACHE_COLLECTION).doc(id).get();
  recordFirestoreRequest(1);
  if (!snap.exists) return null;

  const data = snap.data();
  if (Date.now() - data.cachedAt > FIRESTORE_CACHE_TTL_MS) return null;
  return data;
}

async function fetchFromDiscord(id) {
  const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
    headers: { Authorization: `Bot ${config.botToken}` },
  });
  if (!res.ok) return null;

  const user = await res.json();
  const avatarURL = user.avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(id) >> 22n) % 6}.png`;

  return {
    id,
    username: user.username,
    globalName: user.global_name || user.username,
    avatarURL,
    cachedAt: Date.now(),
  };
}

/**
 * Resolves a single Discord user ID to a username/display name/avatar, using the
 * cache before ever touching Discord's API. Falls back to a raw-ID placeholder object
 * if resolution fails for any reason (deleted account, API hiccup) — callers should
 * always get something renderable back, never null.
 */
export async function resolveUsername(id) {
  const mem = memoryHit(id);
  if (mem) return mem;

  const fromFirestore = await firestoreHit(id);
  if (fromFirestore) {
    memoryCache.set(id, fromFirestore);
    return fromFirestore;
  }

  const fromDiscord = await fetchFromDiscord(id);
  const result = fromDiscord || { id, username: `Unknown (${id})`, globalName: `Unknown (${id})`, avatarURL: null, cachedAt: Date.now() };

  memoryCache.set(id, result);
  if (fromDiscord) {
    await db().collection(CACHE_COLLECTION).doc(id).set(result);
    recordFirestoreRequest(1);
  }

  return result;
}

/**
 * Batch-resolves many IDs at once, with a concurrency cap so we never fire dozens of
 * simultaneous requests at Discord's API and trip its rate limit.
 */
export async function resolveUsernames(ids) {
  const unique = [...new Set(ids)];
  const results = new Map();
  const CONCURRENCY = 5;

  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    const resolved = await Promise.all(batch.map((id) => resolveUsername(id)));
    batch.forEach((id, idx) => results.set(id, resolved[idx]));
  }

  return results;
}
