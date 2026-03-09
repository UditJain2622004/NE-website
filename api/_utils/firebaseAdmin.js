// Firebase Admin SDK initialization for Vercel Serverless Functions
// This runs server-side only — bypasses Firestore security rules.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // The private key comes as a string with escaped newlines from env vars.
  // We need to convert \\n to actual newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const app = getAdminApp();
const db = getFirestore(app);

export { db };
export default app;
