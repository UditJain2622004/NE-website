// Script to seed Firestore with dummy bookings for testing the admin panel.
// Run with: node scripts/seedTestBookings.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { format, addDays, subDays } from 'date-fns';

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

const patientNames = [
  'Rahul Sharma', 'Priya Singh', 'Amit Verma', 'Anjali Gupta', 'Suresh Kumar',
  'Deepak Chenoy', 'Sunita Williams', 'Rohan Mehra', 'Sonia Gandhi', 'Rajiv Bajaj',
  'Arvind Kejriwal', 'Mamata Banerjee', 'Narendra Modi', 'Rahul Gandhi', 'Smriti Irani'
];

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const targetDoctorId = 'doctor_akshath';

const TEST_BOOKINGS = [
  // Keeping the original ones
  {
    doctorId: 'doctor_akshath',
    patientName: 'Amit Verma',
    patientPhone: '+917654321098',
    appointmentDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    timeSlot: '09:30',
    status: 'pending',
    bookingType: 'instant',
  },
  {
    doctorId: 'doctor_vijaya',
    patientName: 'Anjali Gupta',
    patientPhone: '+916543210987',
    appointmentDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    timeSlot: '15:00',
    status: 'completed',
    bookingType: 'instant',
  },
];

// Generate 30+ appointments for doctor_abhijith over a range of 10 days
for (let i = -3; i <= 7; i++) {
  const date = addDays(new Date(), i);
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // 3-4 appointments per day
  const dailyCount = 3 + Math.floor(Math.random() * 2);
  
  for (let j = 0; j < dailyCount; j++) {
    const timeSlot = timeSlots[(j * 2) % timeSlots.length]; // Spread them out a bit
    const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
    
    // Bias status based on date
    let status = 'pending';
    if (i < 0) {
      status = Math.random() > 0.2 ? 'completed' : 'cancelled';
    } else if (i === 0) {
      status = Math.random() > 0.5 ? 'confirmed' : 'pending';
    } else {
      status = Math.random() > 0.3 ? 'confirmed' : 'pending';
    }

    TEST_BOOKINGS.push({
      doctorId: targetDoctorId,
      patientName: patientName,
      patientPhone: `+919${Math.floor(100000000 + Math.random() * 899999999)}`,
      patientEmail: `${patientName.toLowerCase().replace(' ', '.')}@example.com`,
      appointmentDate: formattedDate,
      timeSlot,
      status: status,
      bookingType: 'instant',
    });
  }
}


async function seed() {
  console.log('🌱 Starting test bookings seed...\n');
  const batch = db.batch();

  for (const booking of TEST_BOOKINGS) {
    const ref = db.collection('appointments').doc();
    batch.set(ref, {
      ...booking,
      patientId: booking.patientPhone,
      type: 'new',
      createdAt: FieldValue.serverTimestamp(),
      confirmedAt: booking.status === 'confirmed' ? FieldValue.serverTimestamp() : null,
    });
    
    // Also mark the slot if it's an instant booking (simplified for testing)
    const slotId = `${booking.doctorId}_${booking.appointmentDate}_${booking.timeSlot}`;
    const slotRef = db.collection('doctorSlots').doc(slotId);
    batch.set(slotRef, {
      doctorId: booking.doctorId,
      date: booking.appointmentDate,
      time: booking.timeSlot,
      booked: true,
      appointmentId: ref.id,
      expiresAt: new Date(booking.appointmentDate + 'T23:59:59+05:30'),
    }, { merge: true });

    console.log(`  📋 Prepared: ${booking.patientName} for ${booking.doctorId} on ${booking.appointmentDate}`);
  }

  await batch.commit();
  console.log('\n✅ Successfully seeded test bookings.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
