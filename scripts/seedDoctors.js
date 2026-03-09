// Seed script to populate Firestore with initial doctor data.
//
// Run with: node scripts/seedDoctors.js
//
// This script:
// 1. Creates doctor documents in Firestore with schedule data
// 2. Uses YOUR existing doctor data from src/data/doctors.js
// 3. Adds weeklySchedule and breakTimes fields for slot generation
//
// Prerequisites:
// - .env file with FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
//
// NOTE: This is a one-time setup script. Run it once to initialize your Firestore db.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Firebase Admin
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const app = getApps().length > 0
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

const db = getFirestore(app);

// ────────────────────────────────────────────────────────────────────────────────
// Doctor data — maps to your existing src/data/doctors.js IDs
//
// weeklySchedule keys: 0=Sunday, 1=Monday, 2=Tuesday, ... 6=Saturday
//
// IMPORTANT: Customize the schedules below to match your actual doctor availability.
// The schedules below are based on the "availability" field from your doctors.js file.
// ────────────────────────────────────────────────────────────────────────────────

const doctors = [
  {
    id: 'doctor_abhijith',
    name: 'Dr. Abhijith Reddy A',
    specialization: 'Managing Director & Clinical Consultant',
    department: 'medicine',
    isActive: true,
    // "By Appointment" — setting a default schedule, adjust as needed
    weeklySchedule: {
      '1': { startTime: '10:00', endTime: '16:00', slotDuration: 10 },
      '2': { startTime: '10:00', endTime: '16:00', slotDuration: 10 },
      '3': { startTime: '10:00', endTime: '16:00', slotDuration: 10 },
      '4': { startTime: '10:00', endTime: '16:00', slotDuration: 10 },
      '5': { startTime: '10:00', endTime: '16:00', slotDuration: 10 },
      '6': { startTime: '10:00', endTime: '14:00', slotDuration: 10 },
    },
    breakTimes: [
      { start: '13:00', end: '14:00' },
    ],
  },
  {
    id: 'doctor_akshath',
    name: 'Dr. Akshath Ramesh Acharya',
    specialization: 'General Practitioner',
    department: 'medicine',
    isActive: true,
    // "Mon - Sat, 9 AM to 1 PM ; 6 PM to 10 PM"
    // Splitting into two shifts — morning and evening
    // We'll model them as a single day with a large "break" between shifts
    weeklySchedule: {
      '1': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
      '2': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
      '3': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
      '4': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
      '5': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
      '6': { startTime: '09:00', endTime: '22:00', slotDuration: 10 },
    },
    breakTimes: [
      { start: '13:00', end: '18:00' },
    ],
  },
  {
    id: 'doctor_vijaya',
    name: 'Dr. Vijaya Narayana Holla',
    specialization: 'Consultant Radiologist',
    department: 'radiology',
    isActive: true,
    // "Mon - Sat, 8:00 AM - 6:00 PM"
    weeklySchedule: {
      '1': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
      '2': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
      '3': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
      '4': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
      '5': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
      '6': { startTime: '08:00', endTime: '18:00', slotDuration: 10 },
    },
    breakTimes: [
      { start: '13:00', end: '14:00' },
    ],
  },
  {
    id: 'doctor_tara',
    name: 'Dr. Tara H',
    specialization: 'Consultant Paediatrician & Neonatologist',
    department: 'pediatrics',
    isActive: true,
    // "Mon - Sat, 9:00 AM - 5:00 PM"
    weeklySchedule: {
      '1': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
      '2': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
      '3': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
      '4': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
      '5': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
      '6': { startTime: '09:00', endTime: '17:00', slotDuration: 10 },
    },
    breakTimes: [
      { start: '13:00', end: '14:00' },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────────
// Seed function
// ────────────────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting Firestore seed...\n');

  const batch = db.batch();

  for (const doctor of doctors) {
    const { id, ...data } = doctor;
    const ref = db.collection('doctors').doc(id);
    batch.set(ref, data, { merge: true });
    console.log(`  📋 Prepared: ${data.name} (${id})`);
  }

  await batch.commit();
  console.log(`\n✅ Successfully seeded ${doctors.length} doctors to Firestore.\n`);

  // Verify by reading back
  console.log('🔍 Verifying seed data...\n');
  const snapshot = await db.collection('doctors').get();
  for (const doc of snapshot.docs) {
    const d = doc.data();
    const scheduleDays = Object.keys(d.weeklySchedule || {}).length;
    console.log(`  ✓ ${doc.id}: ${d.name} | ${d.specialization} | ${scheduleDays} days scheduled`);
  }

  console.log('\n🎉 Seed complete! Your Firestore is ready.\n');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
