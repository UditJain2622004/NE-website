import { format } from 'date-fns';
import { db } from './firebaseAdmin.js';
import { normalizePhone } from './phoneUtils.js';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

/**
 * Send email notification for health checkup bookings.
 * This is called by the Cloud Task queue.
 */
export async function sendHealthCheckupNotification(action, data) {
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] API Key missing. Skipping health checkup notification.');
    return;
  }

  const {
    id,
    patientName,
    patientEmail,
    patientPhone,
    packageName,
    preferredDate,
    status
  } = data;

  const formattedDate = formatDate(preferredDate);

  // 1. Send Email if available
  if (patientEmail) {
    try {
      await sendEmail(patientEmail, patientName, {
        packageName,
        preferredDate: formattedDate,
        status,
        action
      });
      console.log(`[Brevo] Health checkup email sent to ${patientEmail}`);
    } catch (err) {
      console.error('[Brevo] Email failed:', err.message);
    }
  }

  // 2. Send SMS if available
  if (patientPhone) {
    try {
      const normalized = normalizePhone(patientPhone);
      await sendSMS(normalized, patientName, {
        packageName,
        preferredDate: formattedDate,
        action
      });
      console.log(`[Brevo] Health checkup SMS sent to ${normalized}`);
    } catch (err) {
      console.error('[Brevo] SMS failed:', err.message);
    }
  }
}

function formatDate(dateStr) {
  try {
    return format(new Date(dateStr + 'T00:00:00'), 'd MMMM yyyy');
  } catch {
    return dateStr;
  }
}

async function sendEmail(email, name, params) {
  const subject = params.action === 'checkup_booked'
    ? `Health Package Booking Confirmed - Nexus Enliven`
    : `Health Package Update - Nexus Enliven`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #2c7be5; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Nexus Enliven Hospital</h1>
        <p style="margin: 5px 0 0;">Health Package Confirmation</p>
      </div>
      <div style="padding: 20px;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your health checkup package has been successfully booked.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Package:</strong> ${params.packageName}</p>
          <p><strong>Preferred Date:</strong> ${params.preferredDate}</p>
          <p><strong>Status:</strong> ${params.status}</p>
        </div>
        <p>Please arrive at the hospital in morning on an empty stomach for the checkup.</p>
        <p>If you have any questions, please contact us at +91 91876 34758.</p>
        <p style="margin-top: 20px;">Thank you,<br><strong>Nexus Enliven Team</strong></p>
      </div>
    </div>
  `;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Nexus Enliven Hospital', email: 'uditjain2622004@gmail.com' },
      to: [{ email, name }],
      subject,
      htmlContent
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo API Error: ${error}`);
  }
}

async function sendSMS(phone, name, params) {
  const content = `Dear ${name}, Your health checkup for ${params.packageName} is confirmed for ${params.preferredDate}. Please arrive by 8:30 AM on an empty stomach. Thank you, Nexus Enliven Hospital.`;

  const res = await fetch('https://api.brevo.com/v3/transactionalSMS/send', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: 'NE Hospital',
      recipient: phone,
      content,
      type: 'transactional'
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo SMS Error: ${error}`);
  }
}
