// API Test Script
// Run with: node scripts/testAPIs.js
//
// Tests all booking system API endpoints against the live Vercel deployment.

const BASE_URL = 'https://ne-website-blue.vercel.app';

// ─── Helpers ────────────────────────────────────────────────────────────────────

let passCount = 0;
let failCount = 0;
let createdAppointmentId = null; // stored for later tests

async function callAPI(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, data };
}

function log(icon, message) {
  console.log(`  ${icon} ${message}`);
}

async function runTest(name, fn) {
  process.stdout.write(`\n🧪 ${name}... `);
  try {
    await fn();
    console.log('✅ PASS');
    passCount++;
  } catch (err) {
    console.log('❌ FAIL');
    log('💥', err.message);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── Compute test dates ─────────────────────────────────────────────────────────

function getDateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// Find the next weekday (Mon-Sat) from a given offset
function getNextWeekday(daysFromNow) {
  for (let i = daysFromNow; i < daysFromNow + 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = d.getDay();
    if (day >= 1 && day <= 6) return getDateString(i); // Mon=1 to Sat=6
  }
  return getDateString(daysFromNow); // fallback
}

const INSTANT_DATE = getNextWeekday(2);    // 2 days from now (within 20-day window)
const REQUEST_DATE = getNextWeekday(30);   // 30 days from now (request booking window)
const PAST_DATE = '2025-01-01';
const FAR_FUTURE_DATE = getDateString(120); // 120 days out (out of range)

const TEST_DOCTOR = 'doctor_akshath';
const TEST_PATIENT = {
  patientName: 'Test Patient',
  patientPhone: '9876543210',
  patientEmail: 'test@example.com',
};

// ─── TESTS ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       🏥 Appointment Booking API Test Suite             ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n  Base URL:      ${BASE_URL}`);
  console.log(`  Instant Date:  ${INSTANT_DATE} (within 20 days)`);
  console.log(`  Request Date:  ${REQUEST_DATE} (21-90 days)`);
  console.log(`  Test Doctor:   ${TEST_DOCTOR}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 1. DOCTORS ENDPOINT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await runTest('GET /api/doctors — list all active doctors', async () => {
    const { status, data } = await callAPI('GET', '/api/doctors');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, `Expected success=true, got ${JSON.stringify(data)}`);
    assert(Array.isArray(data.doctors), 'Expected doctors array');
    assert(data.doctors.length >= 4, `Expected >= 4 doctors, got ${data.doctors.length}`);
    log('📋', `Found ${data.doctors.length} doctors: ${data.doctors.map(d => d.name).join(', ')}`);
  });

  await runTest('GET /api/doctors?id=doctor_akshath — single doctor', async () => {
    const { status, data } = await callAPI('GET', `/api/doctors?id=${TEST_DOCTOR}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, `Expected success=true`);
    assert(data.doctor.name === 'Dr. Akshath Ramesh Acharya', `Wrong doctor name: ${data.doctor.name}`);
    assert(data.doctor.weeklySchedule, 'Missing weeklySchedule');
    const scheduleDays = Object.keys(data.doctor.weeklySchedule);
    log('📋', `Schedule: ${scheduleDays.length} days, slot duration: ${data.doctor.weeklySchedule['1']?.slotDuration}min`);
  });

  await runTest('GET /api/doctors?id=nonexistent — 404 for invalid doctor', async () => {
    const { status, data } = await callAPI('GET', '/api/doctors?id=doctor_doesnotexist');
    assert(status === 404, `Expected 404, got ${status}`);
    assert(data.success === false, 'Expected success=false');
    log('📋', `Error: ${data.error}`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 2. SLOTS ENDPOINT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await runTest(`GET /api/slots — instant booking date (${INSTANT_DATE})`, async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, `Expected success=true, got ${JSON.stringify(data)}`);
    assert(data.bookingType === 'instant', `Expected bookingType=instant, got ${data.bookingType}`);
    assert(Array.isArray(data.slots), 'Expected slots array');
    assert(data.slots.length > 0, 'Expected at least 1 slot');
    assert(data.onLeave === false, 'Expected onLeave=false');
    const firstSlot = data.slots[0];
    assert(firstSlot.time, 'Slot missing time field');
    assert(typeof firstSlot.booked === 'boolean', 'Slot missing booked field');
    log('📋', `Got ${data.slots.length} slots. First: ${firstSlot.time}, Last: ${data.slots[data.slots.length - 1].time}`);
  });

  await runTest(`GET /api/slots — request booking date (${REQUEST_DATE})`, async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${REQUEST_DATE}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.bookingType === 'request', `Expected bookingType=request, got ${data.bookingType}`);
    assert(data.slots.length > 0, 'Expected virtual slots');
    log('📋', `Got ${data.slots.length} virtual slots (not stored in Firestore)`);
  });

  await runTest('GET /api/slots — past date should fail', async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${PAST_DATE}`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.success === false, 'Expected success=false');
    log('📋', `Error: ${data.error}`);
  });

  await runTest('GET /api/slots — far future date should fail', async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${FAR_FUTURE_DATE}`);
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.success === false, 'Expected success=false');
    log('📋', `Error: ${data.error}`);
  });

  await runTest('GET /api/slots — missing params should fail', async () => {
    const { status, data } = await callAPI('GET', '/api/slots');
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('GET /api/slots — invalid date format should fail', async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=March-15`);
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('GET /api/slots — Sunday should return empty (no schedule)', async () => {
    // Find the next Sunday
    const today = new Date();
    const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
    const sundayDate = getDateString(daysUntilSunday);
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${sundayDate}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.slots.length === 0, `Expected 0 slots on Sunday, got ${data.slots.length}`);
    log('📋', `Sunday ${sundayDate}: 0 slots (correct — no schedule)`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 3. CREATE APPOINTMENT ENDPOINT ━━━━━━━━━━━━━━━━━━━━━━━');

  // First, get a valid slot time
  let validSlotTime = null;
  {
    const { data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    const availableSlot = data.slots.find(s => !s.booked);
    validSlotTime = availableSlot?.time;
    log('ℹ️ ', `Using slot time: ${validSlotTime} on ${INSTANT_DATE}`);
  }

  await runTest('POST /api/createAppointment — instant booking (valid)', async () => {
    assert(validSlotTime, 'No available slot found for test');
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: validSlotTime,
      ...TEST_PATIENT,
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.success === true, `Expected success=true. Response: ${JSON.stringify(data)}`);
    assert(data.appointmentId, 'Missing appointmentId');
    assert(data.bookingType === 'instant', `Expected instant, got ${data.bookingType}`);
    assert(data.appointmentType === 'new' || data.appointmentType === 'followup', `Unexpected type: ${data.appointmentType}`);
    createdAppointmentId = data.appointmentId;
    log('📋', `Created appointment: ${data.appointmentId} (type: ${data.appointmentType})`);
  });

  await runTest('POST /api/createAppointment — double booking should fail (409)', async () => {
    assert(validSlotTime, 'No slot time from previous test');
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: validSlotTime,
      patientName: 'Another Patient',
      patientPhone: '8765432109',
    });
    assert(status === 409, `Expected 409 (conflict), got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.success === false, 'Expected success=false');
    log('📋', `Double booking blocked: ${data.error}`);
  });

  await runTest('POST /api/createAppointment — request booking (21-90 days)', async () => {
    // Get a valid time from the request-range schedule
    const { data: slotsData } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${REQUEST_DATE}`);
    const requestSlotTime = slotsData.slots[0]?.time;
    assert(requestSlotTime, 'No request-range slot found');

    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: REQUEST_DATE,
      time: requestSlotTime,
      patientName: 'Request Patient',
      patientPhone: '7654321098',
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.bookingType === 'request', `Expected request, got ${data.bookingType}`);
    log('📋', `Request booking created: ${data.appointmentId}`);
  });

  await runTest('POST /api/createAppointment — missing fields should fail', async () => {
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('POST /api/createAppointment — invalid phone should fail', async () => {
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: '09:00',
      patientName: 'Bad Phone',
      patientPhone: '12345',
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('POST /api/createAppointment — invalid time slot should fail', async () => {
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: '03:33', // Not a valid slot time
      ...TEST_PATIENT,
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('POST /api/createAppointment — past date should fail', async () => {
    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: PAST_DATE,
      time: '09:00',
      ...TEST_PATIENT,
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('POST /api/createAppointment — phone normalization (various formats)', async () => {
    // Get another available slot
    const { data: slotsData } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    const anotherSlot = slotsData.slots.find(s => !s.booked);
    assert(anotherSlot, 'No available slot for phone normalization test');

    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: anotherSlot.time,
      patientName: 'Phone Format Test',
      patientPhone: '+91 987 654 3210', // with spaces and country code
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    log('📋', `Phone "+91 987 654 3210" normalized successfully. Appointment: ${data.appointmentId}`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 4. SLOT AVAILABILITY AFTER BOOKING ━━━━━━━━━━━━━━━━━━━');

  await runTest('GET /api/slots — booked slot should show booked=true', async () => {
    const { status, data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    assert(status === 200, `Expected 200, got ${status}`);
    const bookedSlot = data.slots.find(s => s.time === validSlotTime);
    assert(bookedSlot, `Slot ${validSlotTime} not found in response`);
    assert(bookedSlot.booked === true, `Expected slot ${validSlotTime} to be booked=true`);
    const bookedCount = data.slots.filter(s => s.booked).length;
    const availableCount = data.slots.filter(s => !s.booked).length;
    log('📋', `${bookedCount} booked, ${availableCount} available out of ${data.slots.length} total`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 5. APPOINTMENTS ENDPOINT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await runTest('GET /api/appointments — by doctorId', async () => {
    const { status, data } = await callAPI('GET', `/api/appointments?doctorId=${TEST_DOCTOR}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.success === true, 'Expected success=true');
    assert(Array.isArray(data.appointments), 'Expected appointments array');
    assert(data.appointments.length > 0, 'Expected at least 1 appointment');
    log('📋', `Found ${data.appointments.length} appointments for ${TEST_DOCTOR}`);
  });

  await runTest('GET /api/appointments — filter by status=pending', async () => {
    const { status, data } = await callAPI('GET', `/api/appointments?doctorId=${TEST_DOCTOR}&status=pending`);
    assert(status === 200, `Expected 200, got ${status}`);
    const allPending = data.appointments.every(a => a.status === 'pending');
    assert(allPending, 'Not all appointments have status=pending');
    log('📋', `${data.appointments.length} pending appointments`);
  });

  await runTest('PATCH /api/appointments — confirm appointment', async () => {
    assert(createdAppointmentId, 'No appointment ID from earlier test');
    const { status, data } = await callAPI('PATCH', '/api/appointments', {
      appointmentId: createdAppointmentId,
      action: 'confirm',
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.newStatus === 'confirmed', `Expected confirmed, got ${data.newStatus}`);
    log('📋', `Appointment ${createdAppointmentId} → confirmed`);
  });

  await runTest('PATCH /api/appointments — complete confirmed appointment', async () => {
    const { status, data } = await callAPI('PATCH', '/api/appointments', {
      appointmentId: createdAppointmentId,
      action: 'complete',
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.newStatus === 'completed', `Expected completed, got ${data.newStatus}`);
    log('📋', `Appointment ${createdAppointmentId} → completed`);
  });

  await runTest('PATCH /api/appointments — invalid transition should fail', async () => {
    // Trying to confirm an already completed appointment
    const { status, data } = await callAPI('PATCH', '/api/appointments', {
      appointmentId: createdAppointmentId,
      action: 'confirm',
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('PATCH /api/appointments — invalid action should fail', async () => {
    const { status, data } = await callAPI('PATCH', '/api/appointments', {
      appointmentId: createdAppointmentId,
      action: 'destroy',
    });
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  await runTest('PATCH /api/appointments — missing fields should fail', async () => {
    const { status, data } = await callAPI('PATCH', '/api/appointments', {});
    assert(status === 400, `Expected 400, got ${status}`);
    log('📋', `Error: ${data.error}`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\n━━━ 6. CANCEL + SLOT FREEING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Create a new appointment to test cancellation + slot freeing
  let cancelTestApptId = null;
  let cancelTestSlotTime = null;

  await runTest('Setup: Create appointment for cancel test', async () => {
    const { data: slotsData } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    const slot = slotsData.slots.find(s => !s.booked);
    assert(slot, 'No available slot for cancel test');
    cancelTestSlotTime = slot.time;

    const { status, data } = await callAPI('POST', '/api/createAppointment', {
      doctorId: TEST_DOCTOR,
      date: INSTANT_DATE,
      time: cancelTestSlotTime,
      patientName: 'Cancel Test Patient',
      patientPhone: '6543210987',
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    cancelTestApptId = data.appointmentId;
    log('📋', `Created appointment ${cancelTestApptId} at ${cancelTestSlotTime} for cancel test`);
  });

  await runTest('Verify slot is booked before cancel', async () => {
    const { data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    const slot = data.slots.find(s => s.time === cancelTestSlotTime);
    assert(slot?.booked === true, `Expected slot ${cancelTestSlotTime} to be booked`);
    log('📋', `Slot ${cancelTestSlotTime} is booked ✓`);
  });

  await runTest('PATCH /api/appointments — cancel appointment (should free slot)', async () => {
    const { status, data } = await callAPI('PATCH', '/api/appointments', {
      appointmentId: cancelTestApptId,
      action: 'cancel',
    });
    assert(status === 200, `Expected 200, got ${status}. Response: ${JSON.stringify(data)}`);
    assert(data.newStatus === 'cancelled', `Expected cancelled, got ${data.newStatus}`);
    assert(data.slotFreed === true, `Expected slotFreed=true, got ${data.slotFreed}`);
    log('📋', `Appointment cancelled and slot freed`);
  });

  await runTest('Verify slot is freed after cancel', async () => {
    const { data } = await callAPI('GET', `/api/slots?doctorId=${TEST_DOCTOR}&date=${INSTANT_DATE}`);
    const slot = data.slots.find(s => s.time === cancelTestSlotTime);
    assert(slot?.booked === false, `Expected slot ${cancelTestSlotTime} to be freed (booked=false)`);
    log('📋', `Slot ${cancelTestSlotTime} is now available again ✓`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RESULTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  console.log('\n\n╔══════════════════════════════════════════════════════════╗');
  console.log(`║  Results:  ${passCount} passed  │  ${failCount} failed  │  ${passCount + failCount} total      ║`);
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
