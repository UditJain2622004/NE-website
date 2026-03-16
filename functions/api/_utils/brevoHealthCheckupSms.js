// Brevo transactional SMS sender for health checkup bookings.

import Brevo from '@getbrevo/brevo';
import { formatDate } from './brevoHelpers.js';

const { TransactionalSMSApi, TransactionalSMSApiApiKeys } = Brevo;

let smsApi = null;

function getSmsApi() {
  if (!smsApi) {
    smsApi = new TransactionalSMSApi();
    smsApi.setApiKey(TransactionalSMSApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return smsApi;
}

const SENDER = () => process.env.BREVO_SMS_SENDER || 'NexusEnlvn';

const SMS_TEMPLATES = {
  checkup_booked: (d) =>
    `Nexus Enliven: Your ${d.packageName} health checkup is CONFIRMED for ${formatDate(d.preferredDate)}. Please arrive early and follow preparation guidelines.`,

  checkup_cancelled: (d) =>
    `Nexus Enliven: Your ${d.packageName} health checkup on ${formatDate(d.preferredDate)} has been cancelled. Visit our website to rebook.`,

  checkup_completed: (d) =>
    `Nexus Enliven: Thank you for completing your ${d.packageName} health checkup! Your reports will be shared shortly. Stay healthy!`,
};

export async function sendHealthCheckupSms(event, data) {
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
    console.log(`[Brevo:HealthCheckup:SMS] Sent to ${data.patientPhone}:`, result.body?.reference);
    return result;
  } catch (err) {
    console.error(`[Brevo:HealthCheckup:SMS] Failed for ${data.patientPhone}:`, err.body || err.message);
    return null;
  }
}
