import { db } from '../firebaseAdmin';
import { recordFirestoreRequest } from '../quota';

/**
 * Looks up a single user's warnings. Search-only by design — never lists every
 * warned user in the server, which keeps this both fast and read-cheap (one doc
 * read per search, not a collection scan).
 */
export async function getWarningsForUser(userId) {
  const snap = await db().collection('warnings').doc(userId).get();
  recordFirestoreRequest(1);

  if (!snap.exists) return [];
  const data = snap.data();
  return (data.warnings || []).slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Matches the bot's own warn.js exactly: same 6-digit random ID scheme (no
 * uniqueness check, same as the bot itself), same document shape, so a warning
 * issued from the dashboard is indistinguishable in storage from one issued with
 * `.warn` in Discord.
 */
export async function addWarning(userId, { moderatorLabel, reason }) {
  const ref = db().collection('warnings').doc(userId);
  const snap = await ref.get();
  recordFirestoreRequest(1);

  const existing = snap.exists ? snap.data().warnings || [] : [];
  const warnId = Math.floor(100000 + Math.random() * 900000).toString();
  const newWarning = { id: warnId, moderator: moderatorLabel, reason, timestamp: new Date().toISOString() };

  await ref.set({ warnings: [...existing, newWarning] });
  recordFirestoreRequest(1);
  return newWarning;
}

export async function removeWarningById(userId, warnId) {
  const ref = db().collection('warnings').doc(userId);
  const snap = await ref.get();
  recordFirestoreRequest(1);
  if (!snap.exists) return false;

  const existing = snap.data().warnings || [];
  const filtered = existing.filter((w) => w.id !== warnId);
  if (filtered.length === existing.length) return false; // nothing matched

  await ref.set({ warnings: filtered });
  recordFirestoreRequest(1);
  return true;
}

export async function resetWarningsForUser(userId) {
  await db().collection('warnings').doc(userId).set({ warnings: [] });
  recordFirestoreRequest(1);
}
