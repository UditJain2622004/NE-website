// Brevo WhatsApp message sender for booking notifications.
// Uses direct REST calls since the SDK doesn't have a stable WhatsApp method.

import { formatDate, formatTime } from './brevoHelpers.js';

const WHATSAPP_SENDER = () => process.env.BREVO_WHATSAPP_SENDER_NUMBER;

// ─── Send ────────────────────────────────────────────────────────────────────

/**
 * Send a booking notification via WhatsApp.
 * Requires a pre-created template in the Brevo dashboard.
 * The template ID is read from env var BREVO_WA_TEMPLATE_<EVENT> (e.g. BREVO_WA_TEMPLATE_BOOKING_CREATED).
 *
 * @param {string} event - One of the booking event names
 * @param {object} data  - Appointment data (with doctorName already resolved)
 * @returns {Promise<object|null>}
 */
export async function sendBookingWhatsApp(event, data) {
  const senderNumber = WHATSAPP_SENDER();
  if (!data.patientPhone || !process.env.BREVO_API_KEY || !senderNumber) return null;

  const waTemplateEnvKey = `BREVO_WA_TEMPLATE_${event.toUpperCase()}`;
  const waTemplateId = process.env[waTemplateEnvKey];
  if (!waTemplateId) return null;

  try {
    const response = await fetch('https://api.brevo.com/v3/whatsapp/sendMessage', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        senderNumber,
        contactNumbers: [data.patientPhone.replace('+', '')],
        templateId: Number(waTemplateId),
        params: {
          PATIENT_NAME: data.patientName,
          DOCTOR_NAME: data.doctorName,
          DATE: formatDate(data.appointmentDate),
          TIME: formatTime(data.timeSlot),
        },
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(body));
    }

    console.log(`[Brevo:WhatsApp] Sent to ${data.patientPhone}`);
    return body;
  } catch (err) {
    console.error(`[Brevo:WhatsApp] Failed for ${data.patientPhone}:`, err.message);
    return null;
  }
}
