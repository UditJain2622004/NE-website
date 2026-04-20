import { sendAppointmentEmail, sendSMS, TYPES } from './brevo.js';
import { normalizePhone } from './phoneUtils.js';
import { db } from './firebaseAdmin.js';
import { format } from 'date-fns';
import { FieldValue } from 'firebase-admin/firestore';

const ACTION_TO_BREVO_TYPE = {
  // From Firestore trigger (via dispatchNotification)
  booking_confirmed: TYPES.CONFIRM,
  booking_rejected: TYPES.REJECT,
  // Legacy: direct calls from admin API
  confirm: TYPES.CONFIRM,
  reject: TYPES.REJECT,
};

function formatDate(dateStr) {
  try {
    return format(new Date(dateStr + 'T00:00:00'), 'd MMMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Send email + SMS notification when a booking is confirmed or rejected.
 * Logs the notification result against the appointment in Firestore.
 * Silently skips a channel if the patient's contact info is missing.
 */
export async function sendBookingNotification(action, appointmentData) {
  const brevoType = ACTION_TO_BREVO_TYPE[action];
  if (!brevoType) return;

  const {
    appointmentId,
    patientName,
    patientPhone,
    patientEmail,
    doctorName,
    appointmentDate,
    timeSlot,
  } = appointmentData;

  const formattedDate = formatDate(appointmentDate);
  const notificationLog = {
    action,
    email: null,
    sms: null,
    timestamp: FieldValue.serverTimestamp(),
  };

  if (patientEmail) {
    const result = await sendAppointmentEmail(
      patientName,
      patientEmail,
      doctorName,
      formattedDate,
      timeSlot,
      brevoType,
      appointmentId
    );
    notificationLog.email = { status: 'sent', messageId: result?.messageId || null };
    console.log(`[Brevo] Email (${action}) sent to ${patientEmail}`);
  }

  if (patientPhone) {
    const normalizedPhone = normalizePhone(patientPhone);
    const result = await sendSMS(
      patientName,
      normalizedPhone,
      doctorName,
      formattedDate,
      timeSlot,
      brevoType
    );
    notificationLog.sms = { status: 'sent', messageId: result?.messageId || null };
    console.log(`[Brevo] SMS (${action}) sent to ${normalizedPhone}`);
  }

  if (appointmentId) {
    await db.collection('appointments').doc(appointmentId).update({
      lastNotification: notificationLog,
    });
  }
}
