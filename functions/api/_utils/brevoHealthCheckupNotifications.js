// Notification dispatcher for health checkup package bookings.
// Mirrors brevoNotifications.js structure but for the healthCheckups collection.

import { sendHealthCheckupEmail } from './brevoHealthCheckupEmail.js';
import { sendHealthCheckupSms } from './brevoHealthCheckupSms.js';
import { sendHealthCheckupWhatsApp } from './brevoHealthCheckupWhatsApp.js';

const VALID_EVENTS = [
  'checkup_booked',
  'checkup_cancelled',
  'checkup_completed',
];

/**
 * Send all configured notifications for a health checkup event.
 * Runs in the background — never blocks or throws.
 */
export async function sendHealthCheckupNotification(event, data) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('[Brevo:HealthCheckup] BREVO_API_KEY not set — skipping notifications');
    return;
  }

  if (!VALID_EVENTS.includes(event)) {
    console.warn(`[Brevo:HealthCheckup] Unknown event: ${event}`);
    return;
  }

  try {
    await Promise.allSettled([
      sendHealthCheckupEmail(event, data),
      sendHealthCheckupSms(event, data),
      sendHealthCheckupWhatsApp(event, data),
    ]);
  } catch (err) {
    console.error(`[Brevo:HealthCheckup] Notification dispatch error for ${event}:`, err.message);
  }
}
