// Script to export specific Firestore collections to a JSON file
// Run this BEFORE switching your .env to the new project.
//
// Usage: node scripts/exportData.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import fs from 'fs';

config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

const COLLECTIONS = ['doctors', 'doctorLeaves', 'adminUsers'];

async function exportData() {
  const backup = {};

  for (const colName of COLLECTIONS) {
    console.log(`📦 Exporting ${colName}...`);
    const snapshot = await db.collection(colName).get();
    backup[colName] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`  ✅ Found ${backup[colName].length} documents.`);
  }

  fs.writeFileSync('firestore_backup.json', JSON.stringify(backup, null, 2));
  console.log('\n🎉 Export complete! Data saved to firestore_backup.json');
}

exportData().catch(console.error);
