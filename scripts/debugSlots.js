import { db } from '../api/_utils/firebaseAdmin.js';
import { config } from 'dotenv';
config();

async function checkSlots(doctorId, date) {
  console.log(`Checking slots for ${doctorId} on ${date}...`);
  
  const doctorDoc = await db.collection('doctors').doc(doctorId).get();
  if (!doctorDoc.exists) {
    console.log('Doctor not found');
    return;
  }
  
  const doctor = doctorDoc.data();
  console.log('Schedule for day:', doctor.weeklySchedule[new Date(date).getDay()]);
  
  const appointmentsSnapshot = await db.collection('appointments')
    .where('doctorId', '==', doctorId)
    .where('appointmentDate', '==', date)
    .get();
  
  console.log(`Found ${appointmentsSnapshot.size} appointments:`);
  appointmentsSnapshot.forEach(doc => {
    const d = doc.data();
    console.log(`- ${d.timeSlot}: ${d.status}`);
  });

  const slotsSnapshot = await db.collection('doctorSlots')
    .where('doctorId', '==', doctorId)
    .where('date', '==', date)
    .get();
  
  console.log(`Found ${slotsSnapshot.size} manual slot overrides:`);
  slotsSnapshot.forEach(doc => {
    const d = doc.data();
    console.log(`- ${d.time}: booked=${d.booked}, appId=${d.appointmentId}`);
  });
}

const docId = process.argv[2] || 'doctor_abhijith';
const date = process.argv[3] || '2026-03-13'; // Tomorrow
checkSlots(docId, date);
