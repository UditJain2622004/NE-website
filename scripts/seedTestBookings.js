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

const TEST_BOOKINGS = [
  {
    doctorId: 'doctor_abhijith',
    patientName: 'Rahul Sharma',
    patientPhone: '+919876543210',
    patientEmail: 'rahul@example.com',
    appointmentDate: format(new Date(), 'yyyy-MM-dd'), // Today
    timeSlot: '10:00',
    status: 'pending',
    bookingType: 'instant',
  },
  {
    doctorId: 'doctor_abhijith',
    patientName: 'Priya Singh',
    patientPhone: '+918765432109',
    appointmentDate: format(new Date(), 'yyyy-MM-dd'), // Today
    timeSlot: '11:00',
    status: 'confirmed',
    bookingType: 'instant',
  },
  {
    doctorId: 'doctor_akshath',
    patientName: 'Amit Verma',
    patientPhone: '+917654321098',
    appointmentDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // Tomorrow
    timeSlot: '09:30',
    status: 'pending',
    bookingType: 'instant',
  },
  {
    doctorId: 'doctor_vijaya',
    patientName: 'Anjali Gupta',
    patientPhone: '+916543210987',
    appointmentDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'), // Yesterday
    timeSlot: '15:00',
    status: 'completed',
    bookingType: 'instant',
  },
  {
    doctorId: 'doctor_tara',
    patientName: 'Suresh Kumar',
    patientPhone: '+915432109876',
    appointmentDate: format(new Date(), 'yyyy-MM-dd'), // Today
    timeSlot: '12:00',
    status: 'cancelled',
    bookingType: 'instant',
  }
];

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
