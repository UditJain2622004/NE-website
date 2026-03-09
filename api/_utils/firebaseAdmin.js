// Firebase Admin SDK initialization for Vercel Serverless Functions
// This runs server-side only — bypasses Firestore security rules.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let _db = null;

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Missing Firebase Admin credentials. Ensure these env vars are set on Vercel:\n` +
      `  FIREBASE_PROJECT_ID: ${projectId ? '✅ set' : '❌ MISSING'}\n` +
      `  FIREBASE_CLIENT_EMAIL: ${clientEmail ? '✅ set' : '❌ MISSING'}\n` +
      `  FIREBASE_PRIVATE_KEY: ${privateKey ? '✅ set' : '❌ MISSING'}`
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/**
 * Get the Firestore database instance.
 * Lazily initializes Firebase Admin on first call.
 * @returns {FirebaseFirestore.Firestore}
 */
export function getDb() {
  if (!_db) {
    const app = getAdminApp();
    _db = getFirestore(app);
  }
  return _db;
}

// For backward compatibility — but prefer getDb() for lazy init
export const db = new Proxy({}, {
  get(_, prop) {
    return getDb()[prop];
  }
});

export default { getDb };
