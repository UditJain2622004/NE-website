// Central dispatcher that fans out booking notifications to all channels.
// Each channel lives in its own file:
//   brevoEmail.js    — Transactional email via Brevo SMTP API
//   brevoSms.js      — Transactional SMS via Brevo SMS API
//   brevoWhatsApp.js — WhatsApp messages via Brevo REST API

import { sendBookingEmail } from './brevoEmail.js';
import { sendBookingSms } from './brevoSms.js';
import { sendBookingWhatsApp } from './brevoWhatsApp.js';

// ─── Resolve Doctor Name ─────────────────────────────────────────────────────

async function getDoctorName(doctorId) {
  try {
    const { db } = await import('./firebaseAdmin.js');
    const doc = await db.collection('doctors').doc(doctorId).get();
    return doc.exists ? doc.data().name : doctorId;
  } catch {
    return doctorId;
  }
}

// ─── Main Notification Dispatcher ────────────────────────────────────────────

const VALID_EVENTS = [
  'booking_created',
  'booking_confirmed',
  'booking_rejected',
  'booking_cancelled',
  'booking_completed',
];

/**
 * Send all configured notifications (email + SMS + WhatsApp) for a booking event.
 * Runs in the background — never blocks or throws.
 *
 * @param {'booking_created'|'booking_confirmed'|'booking_rejected'|'booking_cancelled'|'booking_completed'} event
 * @param {object} appointmentData - Must include: patientName, patientPhone, doctorId, appointmentDate, timeSlot, bookingType
 * @param {string} [appointmentData.patientEmail] - Optional email address
 * @param {string} [appointmentData.doctorName] - Optional; fetched from Firestore if missing
 */
export async function sendBookingNotification(event, appointmentData) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('[Brevo] BREVO_API_KEY not set — skipping notifications');
    return;
  }

  if (!VALID_EVENTS.includes(event)) {
    console.warn(`[Brevo] Unknown event: ${event}`);
    return;
  }

  try {
    const doctorName = appointmentData.doctorName || await getDoctorName(appointmentData.doctorId);
    const data = { ...appointmentData, doctorName };

    await Promise.allSettled([
      sendBookingEmail(event, data),
      sendBookingSms(event, data),
      sendBookingWhatsApp(event, data),
    ]);
  } catch (err) {
    console.error(`[Brevo] Notification dispatch error for ${event}:`, err.message);
  }
}

/**
 * Map a status-change action to its notification event name.
 * @param {'confirm'|'reject'|'cancel'|'complete'} action
 * @returns {string|null}
 */
export function actionToEvent(action) {
  const map = {
    confirm: 'booking_confirmed',
    reject: 'booking_rejected',
    cancel: 'booking_cancelled',
    complete: 'booking_completed',
  };
  return map[action] || null;
}
