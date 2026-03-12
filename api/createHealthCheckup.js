// POST /api/createHealthCheckup
//
// Creates a new health checkup package booking.
// No doctor/slot system — user picks a date (no time slot needed).
// Auto-confirmed: no admin/doctor approval required.
// Stores in separate "healthCheckups" Firebase collection.
// Patient identified by phone number (same as appointments).

import { db } from './_utils/firebaseAdmin.js';
import { normalizePhone } from './_utils/phoneUtils.js';
import { sendError, sendSuccess, validateRequired, isValidDate } from './_utils/apiHelpers.js';
import { FieldValue } from 'firebase-admin/firestore';

async function trySendNotification(event, data) {
  try {
    const { sendHealthCheckupNotification } = await import('./_utils/brevoHealthCheckupNotifications.js');
    await sendHealthCheckupNotification(event, data);
  } catch (err) {
    console.warn('[Brevo] Notification skipped (module load failed):', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const body = req.body;

  const validationError = validateRequired(body, [
    'packageId', 'packageName', 'patientName', 'patientPhone', 'preferredDate',
  ]);
  if (validationError) {
    return sendError(res, 400, validationError);
  }

  const { packageId, packageName, packagePrice, patientName, patientEmail, preferredDate } = body;

  if (!isValidDate(preferredDate)) {
    return sendError(res, 400, 'Invalid date format. Use YYYY-MM-DD');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(preferredDate + 'T00:00:00');
  if (selectedDate < today) {
    return sendError(res, 400, 'Cannot book health checkups in the past');
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  if (selectedDate > maxDate) {
    return sendError(res, 400, 'Health checkups can only be booked up to 90 days in advance');
  }

  let patientPhone;
  try {
    patientPhone = normalizePhone(body.patientPhone);
  } catch (err) {
    return sendError(res, 400, err.message);
  }

  try {
    const checkupRef = db.collection('healthCheckups').doc();
    const checkupData = {
      patientId: patientPhone,
      patientName,
      patientPhone,
      patientEmail: patientEmail || null,
      packageId: String(packageId),
      packageName,
      packagePrice: packagePrice || null,
      preferredDate,
      status: 'confirmed',
      createdAt: FieldValue.serverTimestamp(),
    };

    await checkupRef.set(checkupData);

    // Upsert patient document (same collection as doctor appointments)
    const patientRef = db.collection('patients').doc(patientPhone);
    const patientDoc = await patientRef.get();

    if (patientDoc.exists) {
      await patientRef.update({
        name: patientName,
        phone: patientPhone,
        ...(patientEmail ? { email: patientEmail } : {}),
        lastHealthCheckupAt: FieldValue.serverTimestamp(),
      });
    } else {
      await patientRef.set({
        name: patientName,
        phone: patientPhone,
        ...(patientEmail ? { email: patientEmail } : {}),
        createdAt: FieldValue.serverTimestamp(),
        lastHealthCheckupAt: FieldValue.serverTimestamp(),
      });
    }

    trySendNotification('checkup_booked', {
      patientName,
      patientPhone,
      patientEmail: patientEmail || null,
      packageName,
      packagePrice,
      preferredDate,
    });

    return sendSuccess(res, {
      checkupId: checkupRef.id,
      status: 'confirmed',
      message: 'Health checkup booked successfully! No further approval needed.',
    });

  } catch (error) {
    console.error('Error in /api/createHealthCheckup:', error);
    return sendError(res, 500, `Internal server error: ${error.message}`);
  }
}
