// Brevo transactional email sender for health checkup bookings.

import Brevo from '@getbrevo/brevo';
import { formatDate } from './brevoHelpers.js';

const { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } = Brevo;

let emailApi = null;

function getEmailApi() {
  if (!emailApi) {
    emailApi = new TransactionalEmailsApi();
    emailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return emailApi;
}

const SENDER = () => ({
  name: process.env.BREVO_SENDER_NAME || 'Nexus Enliven',
  email: process.env.BREVO_SENDER_EMAIL || 'noreply@nexusenliven.com',
});

function row(label, value, valueStyle = '') {
  return `<tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold">${label}</td><td style="padding:8px;border:1px solid #e5e7eb${valueStyle ? `;${valueStyle}` : ''}">${value}</td></tr>`;
}

function wrap(heading, headingColor, bodyHtml) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h2 style="color:${headingColor}">${heading}</h2>
  ${bodyHtml}
  <p style="color:#6b7280;font-size:14px">Thank you,<br>Nexus Enliven</p>
</div>`;
}

function formatPrice(price) {
  if (!price) return 'N/A';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

const EMAIL_TEMPLATES = {
  checkup_booked: (d) => ({
    subject: `Health Checkup Booked – ${d.packageName} on ${formatDate(d.preferredDate)}`,
    text: `Dear ${d.patientName},\n\nYour health checkup has been booked and confirmed!\n\nPackage: ${d.packageName}\nPrice: ${formatPrice(d.packagePrice)}\nDate: ${formatDate(d.preferredDate)}\nStatus: Confirmed\n\nPlease arrive early on the day of your checkup. Follow the fasting and preparation guidelines provided on our website.\n\nThank you,\nNexus Enliven`,
    html: wrap('Health Checkup Confirmed', '#15803d', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Your health checkup has been booked and <strong style="color:#15803d">confirmed</strong>!</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Package', d.packageName)}
        ${row('Price', formatPrice(d.packagePrice))}
        ${row('Date', formatDate(d.preferredDate))}
        ${row('Status', 'Confirmed', 'color:#15803d;font-weight:bold')}
      </table>
      <p>Please arrive early on the day of your checkup. Follow the fasting and preparation guidelines provided on our website.</p>`),
  }),

  checkup_cancelled: (d) => ({
    subject: `Health Checkup Cancelled – ${d.packageName}`,
    text: `Dear ${d.patientName},\n\nYour health checkup booking has been cancelled.\n\nPackage: ${d.packageName}\nDate: ${formatDate(d.preferredDate)}\n\nIf you wish to rebook, please visit our website.\n\nThank you,\nNexus Enliven`,
    html: wrap('Health Checkup Cancelled', '#dc2626', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Your health checkup booking has been <strong style="color:#dc2626">cancelled</strong>.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Package', d.packageName)}
        ${row('Date', formatDate(d.preferredDate))}
      </table>
      <p>If you wish to rebook, please visit our website or contact us.</p>`),
  }),

  checkup_completed: (d) => ({
    subject: `Health Checkup Complete – Thank You, ${d.patientName}`,
    text: `Dear ${d.patientName},\n\nThank you for completing your health checkup at Nexus Enliven.\n\nPackage: ${d.packageName}\nDate: ${formatDate(d.preferredDate)}\n\nYour reports will be shared with you shortly. Stay healthy!\n\nThank you,\nNexus Enliven`,
    html: wrap('Health Checkup Complete', '#0f766e', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Thank you for completing your health checkup at Nexus Enliven.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Package', d.packageName)}
        ${row('Date', formatDate(d.preferredDate))}
      </table>
      <p>Your reports will be shared with you shortly. Stay healthy!</p>`),
  }),
};

export async function sendHealthCheckupEmail(event, data) {
  if (!data.patientEmail || !process.env.BREVO_API_KEY) return null;

  const templateFn = EMAIL_TEMPLATES[event];
  if (!templateFn) return null;

  const template = templateFn(data);

  try {
    const email = new SendSmtpEmail();
    email.sender = SENDER();
    email.to = [{ email: data.patientEmail }];
    email.subject = template.subject;
    email.htmlContent = template.html;
    email.textContent = template.text;

    const result = await getEmailApi().sendTransacEmail(email);
    console.log(`[Brevo:HealthCheckup:Email] Sent to ${data.patientEmail}:`, result.body?.messageId);
    return result;
  } catch (err) {
    console.error(`[Brevo:HealthCheckup:Email] Failed for ${data.patientEmail}:`, err.body || err.message);
    return null;
  }
}
