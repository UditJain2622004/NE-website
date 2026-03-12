// POST /api/createAppointment
//
// Creates a new appointment booking.
// For instant bookings (≤20 days): Uses a Firestore transaction to atomically lock the slot.
// For request bookings (21-90 days): Validates against schedule, creates appointment without slot lock.
// Also handles patient upsert and follow-up detection.

import { db } from './_utils/firebaseAdmin.js';
import { normalizePhone } from './_utils/phoneUtils.js';
import { generateSlotTimes, buildSlotId, classifyBookingDate } from './_utils/slotGenerator.js';
import { checkDoctorLeave } from './_utils/leaveChecker.js';
import { sendError, sendSuccess, validateRequired, isValidDate, isValidTime } from './_utils/apiHelpers.js';
import { sendBookingNotification } from './_utils/brevoNotifications.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const body = req.body;

  // --- Validate required fields ---
  const validationError = validateRequired(body, ['doctorId', 'date', 'time', 'patientName', 'patientPhone']);
  if (validationError) {
    return sendError(res, 400, validationError);
  }

  const { doctorId, date, time, patientName, patientEmail } = body;

  if (!isValidDate(date)) {
    return sendError(res, 400, 'Invalid date format. Use YYYY-MM-DD');
  }

  if (!isValidTime(time)) {
    return sendError(res, 400, 'Invalid time format. Use HH:mm');
  }

  // --- Normalize phone ---
  let patientPhone;
  try {
    patientPhone = normalizePhone(body.patientPhone);
  } catch (err) {
    return sendError(res, 400, err.message);
  }

  try {
    // --- Check doctor exists and is active ---
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
      return sendError(res, 400, `Doctor is on leave: ${leaveStatus.reason}`);
    }

    // --- Classify booking date ---
    const dateClass = classifyBookingDate(date);

    if (dateClass.isOutOfRange) {
      if (dateClass.daysDiff < 0) {
        return sendError(res, 400, 'Cannot book appointments in the past');
      }
      return sendError(res, 400, 'Appointments can only be booked up to 90 days in advance');
    }

    // --- Validate time against doctor schedule ---
    const validSlotTimes = generateSlotTimes(doctor, date);
    if (!validSlotTimes.includes(time)) {
      return sendError(res, 400, 'Invalid time slot. This time is not available in the doctor\'s schedule.');
    }

    // --- Detect follow-up ---
    const appointmentType = await detectFollowUp(patientPhone, doctorId);

    const bookingType = dateClass.isInstant ? 'instant' : 'request';

    // --- Create appointment ---
    let appointmentId;

    if (dateClass.isInstant) {
      // INSTANT BOOKING: Use a Firestore transaction to lock the slot
      const slotId = buildSlotId(doctorId, date, time);
      const slotRef = db.collection('doctorSlots').doc(slotId);

      appointmentId = await db.runTransaction(async (transaction) => {
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists) {
          throw new Error('SLOT_NOT_FOUND');
        }

        const slotData = slotDoc.data();
        if (slotData.booked) {
          throw new Error('SLOT_ALREADY_BOOKED');
        }

        // Create the appointment document
        const appointmentRef = db.collection('appointments').doc();
        const appointmentData = {
          patientId: patientPhone,
          doctorId,
          patientName,
          patientPhone,
          patientEmail: patientEmail || null,
          appointmentDate: date,
          timeSlot: time,
          bookingType: 'instant',
          type: appointmentType,
          status: 'pending',
          createdAt: FieldValue.serverTimestamp(),
          confirmedAt: null,
        };

        transaction.set(appointmentRef, appointmentData);

        // Mark the slot as booked
        transaction.update(slotRef, {
          booked: true,
          appointmentId: appointmentRef.id,
        });

        return appointmentRef.id;
      });

    } else {
      // REQUEST BOOKING: No slot to lock, just create the appointment
      const appointmentRef = db.collection('appointments').doc();
      const appointmentData = {
        patientId: patientPhone,
        doctorId,
        patientName,
        patientPhone,
        patientEmail: patientEmail || null,
        appointmentDate: date,
        timeSlot: time,
        bookingType: 'request',
        type: appointmentType,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp(),
        confirmedAt: null,
      };

      await appointmentRef.set(appointmentData);
      appointmentId = appointmentRef.id;
    }

    // --- Upsert patient document ---
    const patientRef = db.collection('patients').doc(patientPhone);
    const patientDoc = await patientRef.get();

    if (patientDoc.exists) {
      // Existing patient: update info but preserve createdAt
      await patientRef.update({
        name: patientName,
        phone: patientPhone,
        ...(patientEmail ? { email: patientEmail } : {}),
        lastAppointmentAt: FieldValue.serverTimestamp(),
      });
    } else {
      // New patient: set all fields including createdAt
      await patientRef.set({
        name: patientName,
        phone: patientPhone,
        ...(patientEmail ? { email: patientEmail } : {}),
        createdAt: FieldValue.serverTimestamp(),
        lastAppointmentAt: FieldValue.serverTimestamp(),
      });
    }

    // Fire-and-forget: send notifications without blocking the response
    sendBookingNotification('booking_created', {
      patientName,
      patientPhone,
      patientEmail: patientEmail || null,
      doctorId,
      doctorName: doctor.name,
      appointmentDate: date,
      timeSlot: time,
      bookingType,
    }).catch(err => console.error('[Brevo] Notification error:', err.message));
//end here bravo
    return sendSuccess(res, {
      appointmentId,
      bookingType,
      appointmentType,
      message: bookingType === 'instant'
        ? 'Appointment booked successfully. Awaiting doctor confirmation.'
        : 'Appointment request submitted. The doctor will review and confirm.',
    });

  } catch (error) {
    // Handle known transaction errors
    if (error.message === 'SLOT_NOT_FOUND') {
      return sendError(res, 400, 'This time slot is no longer available. Please select another slot.');
    }
    if (error.message === 'SLOT_ALREADY_BOOKED') {
      return sendError(res, 409, 'This slot has already been booked. Please select another time.');
    }

    console.error('Error in /api/createAppointment:', error);
    return sendError(res, 500, `Internal server error: ${error.message}`);
  }
}

/**
 * Detect if this appointment is a follow-up.
 * A follow-up is defined as booking within 7 days of the last completed/confirmed appointment
 * with the same doctor.
 * 
 * @param {string} patientId - Patient phone in E.164
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<string>} "followup" or "new"
 */
async function detectFollowUp(patientId, doctorId) {
  try {
    // Simple query: just get recent appointments for this patient.
    // Uses single equality filter to avoid needing composite indexes.
    const recentAppointments = await db
      .collection('appointments')
      .where('patientId', '==', patientId)
      .get();

    if (recentAppointments.empty) {
      return 'new';
    }

    // Filter in memory: same doctor, confirmed/completed status
    const matching = recentAppointments.docs
      .map(doc => doc.data())
      .filter(a => a.doctorId === doctorId && ['confirmed', 'completed'].includes(a.status))
      .sort((a, b) => (b.appointmentDate || '').localeCompare(a.appointmentDate || ''));

    if (matching.length === 0) {
      return 'new';
    }

    const lastAppointment = matching[0];
    const lastDate = new Date(lastAppointment.appointmentDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays <= 7 ? 'followup' : 'new';
  } catch (err) {
    // If the query fails, default to "new"
    console.warn('Follow-up detection failed, defaulting to "new":', err.message);
    return 'new';
  }
}
