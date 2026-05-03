// Script to import Firestore data from a JSON backup file
// Run this AFTER switching your .env to the new project.
//
// Usage: node scripts/importData.js

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

async function importData() {
  if (!fs.existsSync('firestore_backup.json')) {
    console.error('❌ firestore_backup.json not found! Run exportData.js first.');
    return;
  }

  const backup = JSON.parse(fs.readFileSync('firestore_backup.json', 'utf8'));

  for (const [colName, docs] of Object.entries(backup)) {
    console.log(`🚀 Importing ${colName}...`);
    const batch = db.batch();
    
    docs.forEach(docData => {
      const { id, ...data } = docData;
      const ref = db.collection(colName).doc(id);
      batch.set(ref, data);
    });

    await batch.commit();
    console.log(`  ✅ Imported ${docs.length} documents.`);
  }

  console.log('\n🎉 Import complete! New Firestore is populated.');
}

importData().catch(console.error);
