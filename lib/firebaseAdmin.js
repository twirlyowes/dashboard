import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './config';

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const sa = config.firebaseKey;
  return initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    }),
  });
}

export function db() {
  return getFirestore(getAdminApp());
}
