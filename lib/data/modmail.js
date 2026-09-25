import { db } from '../firebaseAdmin';
import { cached, TTL, recordFirestoreRequest } from '../quota';

/**
 * Open tickets specifically — this is what staff actually check repeatedly, so it's
 * a targeted query (status == "open"), not a full collection scan, and cached briefly
 * since ticket status can change mid-session.
 */
export async function getOpenTickets() {
  return cached('modmail:open', TTL.SHORT, async () => {
    const snap = await db().collection('modmail_tickets').where('status', '==', 'open').get();
    recordFirestoreRequest(snap.size || 1);
    return snap.docs.map((doc) => doc.data()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });
}

/**
 * Recent closed tickets — capped with a Firestore-side limit (not fetch-then-slice)
 * so this never scans the whole ticket history just to show the last 25.
 */
export async function getRecentClosedTickets(limit = 25) {
  return cached(`modmail:closed:${limit}`, TTL.MEDIUM, async () => {
    const snap = await db()
      .collection('modmail_tickets')
      .where('status', '==', 'closed')
      .orderBy('closedAt', 'desc')
      .limit(limit)
      .get();
    recordFirestoreRequest(snap.size || 1);
    return snap.docs.map((doc) => doc.data());
  });
}

export async function getTicketsForUser(userId) {
  const snap = await db().collection('modmail_tickets').where('userId', '==', userId).get();
  recordFirestoreRequest(snap.size || 1);
  return snap.docs.map((doc) => doc.data()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getPendingCount() {
  return cached('modmail:pendingCount', TTL.SHORT, async () => {
    const snap = await db().collection('modmail_pending').count().get();
    recordFirestoreRequest(1); // count() aggregation is a single read regardless of collection size
    return snap.data().count;
  });
}
