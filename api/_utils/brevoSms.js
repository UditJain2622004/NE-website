// Brevo transactional SMS sender for booking notifications.

import {
  TransactionalSMSApi,
  TransactionalSMSApiApiKeys,
} from '@getbrevo/brevo';
import { formatDate, formatTime } from './brevoHelpers.js';

// ─── API Client (lazy-initialized) ──────────────────────────────────────────

let smsApi = null;

function getSmsApi() {
  if (!smsApi) {
    smsApi = new TransactionalSMSApi();
    smsApi.setApiKey(TransactionalSMSApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return smsApi;
}

const SENDER = () => process.env.BREVO_SMS_SENDER || 'NexusEnlvn';

// ─── SMS Templates ───────────────────────────────────────────────────────────

const SMS_TEMPLATES = {
  booking_created: (d) =>
    `Nexus Enliven: Appointment booked with ${d.doctorName} on ${formatDate(d.appointmentDate)} at ${formatTime(d.timeSlot)}. Status: Pending. You'll be notified on confirmation.`,

  booking_confirmed: (d) =>
    `Nexus Enliven: Your appointment with ${d.doctorName} on ${formatDate(d.appointmentDate)} at ${formatTime(d.timeSlot)} is CONFIRMED. Please arrive 10 min early.`,

  booking_rejected: (d) =>
    `Nexus Enliven: Your appointment with ${d.doctorName} on ${formatDate(d.appointmentDate)} at ${formatTime(d.timeSlot)} could not be accommodated. Please try another slot.`,

  booking_cancelled: (d) =>
    `Nexus Enliven: Your appointment with ${d.doctorName} on ${formatDate(d.appointmentDate)} at ${formatTime(d.timeSlot)} has been cancelled. Visit our website to rebook.`,

  booking_completed: (d) =>
    `Nexus Enliven: Thank you for visiting! Your appointment with ${d.doctorName} on ${formatDate(d.appointmentDate)} is complete. Book a follow-up at our website.`,
};

// ─── Send ────────────────────────────────────────────────────────────────────

/**
 * Send a booking notification SMS.
 * @param {string} event - One of the booking event names
 * @param {object} data  - Appointment data (with doctorName already resolved)
 * @returns {Promise<object|null>}
 */
export async function sendBookingSms(event, data) {
  if (!data.patientPhone || !process.env.BREVO_API_KEY) return null;

  const templateFn = SMS_TEMPLATES[event];
  if (!templateFn) return null;

  try {
    const result = await getSmsApi().sendTransacSms({
      sender: SENDER(),
      recipient: data.patientPhone.replace('+', ''),
      content: templateFn(data),
      type: 'transactional',
    });
    console.log(`[Brevo:SMS] Sent to ${data.patientPhone}:`, result.body?.reference);
    return result;
  } catch (err) {
    console.error(`[Brevo:SMS] Failed for ${data.patientPhone}:`, err.body || err.message);
    return null;
  }
}
