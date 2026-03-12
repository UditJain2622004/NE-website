import handler from '../api/slots.js';
import { db } from '../api/_utils/firebaseAdmin.js';
import { config } from 'dotenv';
config();

async function testSlots(doctorId, date) {
  const req = {
    method: 'GET',
    query: { doctorId, date }
  };
  const res = {
    status: (code) => ({
      json: (data) => console.log(JSON.stringify(data, null, 2))
    }),
    setHeader: () => {}
  };
  
  await handler(req, res);
}

testSlots('doctor_abhijith', '2026-03-13').then(() => process.exit(0));
