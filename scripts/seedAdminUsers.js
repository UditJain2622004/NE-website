// Seed script to create admin and doctor accounts in Firebase Auth
// and set custom claims for roles.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

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

const auth = getAuth();
const db = getFirestore();

const ADMIN_EMAIL = 'admin@nexusenliven.com';
const ADMIN_PASSWORD = 'AdminPassword123!'; // User should change this

const DOCTORS = [
  { id: 'doctor_abhijith', name: 'Dr. Abhijith Reddy A', email: 'dr.abhijith@nexusenliven.com' },
  { id: 'doctor_akshath', name: 'Dr. Akshath Ramesh Acharya', email: 'dr.akshath@nexusenliven.com' },
  { id: 'doctor_vijaya', name: 'Dr. Vijaya Narayana Holla', email: 'dr.vijaya@nexusenliven.com' },
  { id: 'doctor_tara', name: 'Dr. Tara H', email: 'dr.tara@nexusenliven.com' },
];

async function findOrCreateUser(email, password, displayName) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    console.log(`User already exists: ${email} (${userRecord.uid})`);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      console.log(`Created new user: ${email} (${userRecord.uid})`);
      return userRecord;
    }
    throw error;
  }
}

async function setClaims(uid, role, doctorId = null) {
  await auth.setCustomUserClaims(uid, { role, doctorId });
  console.log(`Set claims for ${uid}: role=${role}${doctorId ? `, doctorId=${doctorId}` : ''}`);
  
  // Store role in Firestore as well for easy fetching
  await db.collection('adminUsers').doc(uid).set({
    role,
    doctorId,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

async function run() {
  console.log('--- Starting Admin/Doctor Seeding ---');

  // 1. Create Main Admin
  const adminUser = await findOrCreateUser(ADMIN_EMAIL, ADMIN_PASSWORD, 'Hospital Admin');
  await setClaims(adminUser.uid, 'admin');

  // 2. Create Doctors
  for (const doc of DOCTORS) {
    // Check if doctor exists in Firestore first (to ensure matching ID)
    const docDoc = await db.collection('doctors').doc(doc.id).get();
    if (!docDoc.exists) {
      console.warn(`Warning: Doctor ${doc.id} not found in Firestore. Skipping...`);
      continue;
    }

    const doctorUser = await findOrCreateUser(doc.email, 'DoctorPassword123!', doc.name);
    await setClaims(doctorUser.uid, 'doctor', doc.id);
  }

  console.log('--- Seeding Complete ---');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
