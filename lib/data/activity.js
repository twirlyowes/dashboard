import { db } from '../firebaseAdmin';
import { cached, TTL, recordFirestoreRequest } from '../quota';

/**
 * Full leaderboard read — this is the one place a full collection scan is justified
 * (there's no way to rank without seeing everyone), so it's cached for TTL.MEDIUM to
 * avoid re-scanning on every page view within a staff session.
 */
export async function getActivityLeaderboard() {
  return cached('activity:leaderboard', TTL.MEDIUM, async () => {
    const snap = await db().collection('activetime').get();
    recordFirestoreRequest(snap.size || 1);

    return snap.docs
      .map((doc) => ({ userId: doc.id, ...doc.data() }))
      .sort((a, b) => (b.activeTime || 0) - (a.activeTime || 0));
  });
}

export async function getActivityForUser(userId) {
  const snap = await db().collection('activetime').doc(userId).get();
  recordFirestoreRequest(1);

  if (!snap.exists) return null;
  return { userId, ...snap.data() };
}

export async function getLastResetInfo() {
  return cached('activity:lastReset', TTL.MEDIUM, async () => {
    const snap = await db().collection('meta').doc('dailyReset').get();
    recordFirestoreRequest(1);
    return snap.exists ? snap.data() : null;
  });
}
