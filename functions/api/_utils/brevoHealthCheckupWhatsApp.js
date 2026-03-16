// Brevo WhatsApp message sender for health checkup bookings.

import { formatDate } from './brevoHelpers.js';

const WHATSAPP_SENDER = () => process.env.BREVO_WHATSAPP_SENDER_NUMBER;

export async function sendHealthCheckupWhatsApp(event, data) {
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
          PACKAGE_NAME: data.packageName,
          DATE: formatDate(data.preferredDate),
        },
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(body));
    }

    console.log(`[Brevo:HealthCheckup:WhatsApp] Sent to ${data.patientPhone}`);
    return body;
  } catch (err) {
    console.error(`[Brevo:HealthCheckup:WhatsApp] Failed for ${data.patientPhone}:`, err.message);
    return null;
  }
}
