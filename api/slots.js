// GET /api/slots?doctorId=X&date=YYYY-MM-DD
//
// Returns available time slots for a doctor on a given date.
// For dates within 20 days: generates and stores slots in Firestore (lazy generation).
// For dates 21-90 days out: generates virtual slots from schedule (not stored).
// Checks doctor leaves and marks booked slots.

import { db } from './_utils/firebaseAdmin.js';
import { generateSlotTimes, buildSlotId, classifyBookingDate } from './_utils/slotGenerator.js';
import { checkDoctorLeave } from './_utils/leaveChecker.js';
import { sendError, sendSuccess, isValidDate } from './_utils/apiHelpers.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { doctorId, date } = req.query;

  // --- Validate inputs ---
  if (!doctorId || !date) {
    return sendError(res, 400, 'Missing required query params: doctorId, date');
  }

  if (!isValidDate(date)) {
    return sendError(res, 400, 'Invalid date format. Use YYYY-MM-DD');
  }

  try {
    // --- Check if doctor exists and is active ---
    const doctorDoc = await db.collection('doctors').doc(doctorId).get();
    if (!doctorDoc.exists) {
      return sendError(res, 404, 'Doctor not found');
    }

    const doctor = doctorDoc.data();
    if (!doctor.isActive) {
      return sendError(res, 400, 'Doctor is currently unavailable');
    }

    // --- Check doctor leave ---
    const leaveStatus = await checkDoctorLeave(doctorId, date);
    if (leaveStatus.onLeave) {
      return sendSuccess(res, {
        slots: [],
        onLeave: true,
        leaveReason: leaveStatus.reason,
        bookingType: null,
      });
    }

    // --- Classify the booking date ---
    const dateClass = classifyBookingDate(date);

    if (dateClass.isOutOfRange) {
      if (dateClass.daysDiff < 0) {
        return sendError(res, 400, 'Cannot book appointments in the past');
      }
      return sendError(res, 400, 'Appointments can only be booked up to 90 days in advance');
    }

    // --- Generate slot times from doctor schedule ---
    const slotTimes = generateSlotTimes(doctor, date);

    if (slotTimes.length === 0) {
      return sendSuccess(res, {
        slots: [],
        onLeave: false,
        bookingType: dateClass.isInstant ? 'instant' : 'request',
        message: 'Doctor does not have a schedule for this day',
      });
    }

    // --- INSTANT BOOKING (≤20 days): Use Firestore slots ---
    if (dateClass.isInstant) {
      // Check if slots already exist in Firestore
      const existingSlotsSnapshot = await db
        .collection('doctorSlots')
        .where('doctorId', '==', doctorId)
        .where('date', '==', date)
        .get();

      let slots;

      if (existingSlotsSnapshot.empty) {
        // Lazy generation: create slot documents
        const batch = db.batch();
        slots = [];

        // Set expiresAt to end of the slot's date (23:59:59 IST → converted to UTC)
        // IST is UTC+5:30, so 23:59:59 IST = 18:29:59 UTC
        const expireDate = new Date(date + 'T23:59:59+05:30');

        for (const time of slotTimes) {
          const slotId = buildSlotId(doctorId, date, time);
          const slotData = {
            doctorId,
            date,
            time,
            booked: false,
            appointmentId: null,
            expiresAt: expireDate,
          };

          batch.set(db.collection('doctorSlots').doc(slotId), slotData);
          slots.push({ id: slotId, ...slotData, expiresAt: expireDate.toISOString() });
        }

        await batch.commit();
      } else {
        // Return existing slots
        slots = existingSlotsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || null,
        }));
      }

      return sendSuccess(res, {
        slots: slots.map(s => ({
          id: s.id,
          time: s.time,
          booked: s.booked,
          appointmentId: s.appointmentId || null,
        })),
        onLeave: false,
        bookingType: 'instant',
      });
    }

    // --- REQUEST BOOKING (21-90 days): Virtual slots (not stored) ---
    const virtualSlots = slotTimes.map(time => ({
      id: buildSlotId(doctorId, date, time),
      time,
      booked: false,
      appointmentId: null,
    }));

    return sendSuccess(res, {
      slots: virtualSlots,
      onLeave: false,
      bookingType: 'request',
    });

  } catch (error) {
    console.error('Error in /api/slots:', error);
    return sendError(res, 500, 'Internal server error');
  }
}
