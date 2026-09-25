import { db } from '../firebaseAdmin';
import { recordFirestoreRequest, cached, TTL } from '../quota';

/**
 * Search-only for non-admin staff, one doc read per lookup — never a full collection
 * dump for them.
 */
export async function getAfkStatus(userId) {
  const snap = await db().collection('afk').doc(userId).get();
  recordFirestoreRequest(1);

  if (!snap.exists) return null;
  return snap.data(); // { reason, time, setupAt, originalNickname }
}

/**
 * Admin-only: every currently-AFK user, fetched automatically rather than requiring
 * a search. A full collection scan, but this collection only ever holds docs for
 * users who are *currently* AFK (the bot deletes the doc when they return), so it
 * stays small in practice — the bot itself already does this same full scan
 * elsewhere. Cached briefly since AFK status changes often.
 */
export async function getAllAfkUsers() {
  return cached('afk:all', TTL.SHORT, async () => {
    const snap = await db().collection('afk').get();
    recordFirestoreRequest(snap.size || 1);
    return snap.docs.map((doc) => ({ userId: doc.id, ...doc.data() }));
  });
}
