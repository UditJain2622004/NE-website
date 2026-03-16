import { BrevoClient } from '@getbrevo/brevo';
import { formatDate, formatTime } from './brevoHelpers.js';

// ─── API Client (lazy-initialized) ──────────────────────────────────────────

let brevo = null;

function getBrevo() {
  if (!brevo) {
    brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });
  }
  return brevo;
}

const SENDER = () => ({
  name: process.env.BREVO_SENDER_NAME || 'Nexus Enliven',
  email: process.env.BREVO_SENDER_EMAIL || 'noreply@nexusenliven.com',
});

// ─── Email Templates ─────────────────────────────────────────────────────────

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

const EMAIL_TEMPLATES = {
  booking_created: (d) => ({
    subject: `Appointment Booked – ${formatDate(d.appointmentDate)}`,
    text: `Dear ${d.patientName},\n\nYour appointment has been booked successfully.\n\nDoctor: ${d.doctorName}\nDate: ${formatDate(d.appointmentDate)}\nTime: ${formatTime(d.timeSlot)}\nType: ${d.bookingType === 'instant' ? 'Instant Booking' : 'Booking Request'}\nStatus: Pending confirmation\n\nYou will receive a notification once the doctor confirms your appointment.\n\nThank you,\nNexus Enliven`,
    html: wrap('Appointment Booked', '#0f766e', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Your appointment has been booked successfully.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Doctor', d.doctorName)}
        ${row('Date', formatDate(d.appointmentDate))}
        ${row('Time', formatTime(d.timeSlot))}
        ${row('Type', d.bookingType === 'instant' ? 'Instant Booking' : 'Booking Request')}
        ${row('Status', 'Pending confirmation', 'color:#b45309')}
      </table>
      <p>You will receive a notification once the doctor confirms your appointment.</p>`),
  }),

  booking_confirmed: (d) => ({
    subject: `Appointment Confirmed – ${formatDate(d.appointmentDate)}`,
    text: `Dear ${d.patientName},\n\nYour appointment has been confirmed!\n\nDoctor: ${d.doctorName}\nDate: ${formatDate(d.appointmentDate)}\nTime: ${formatTime(d.timeSlot)}\n\nPlease arrive 10 minutes before your scheduled time.\n\nThank you,\nNexus Enliven`,
    html: wrap('Appointment Confirmed ✓', '#15803d', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Your appointment has been <strong style="color:#15803d">confirmed</strong>!</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Doctor', d.doctorName)}
        ${row('Date', formatDate(d.appointmentDate))}
        ${row('Time', formatTime(d.timeSlot))}
      </table>
      <p>Please arrive <strong>10 minutes</strong> before your scheduled time.</p>`),
  }),

  booking_rejected: (d) => ({
    subject: `Appointment Not Available – ${formatDate(d.appointmentDate)}`,
    text: `Dear ${d.patientName},\n\nUnfortunately, your appointment request could not be accommodated.\n\nDoctor: ${d.doctorName}\nDate: ${formatDate(d.appointmentDate)}\nTime: ${formatTime(d.timeSlot)}\n\nPlease try booking a different slot. We apologize for the inconvenience.\n\nThank you,\nNexus Enliven`,
    html: wrap('Appointment Not Available', '#dc2626', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Unfortunately, your appointment request could not be accommodated.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Doctor', d.doctorName)}
        ${row('Date', formatDate(d.appointmentDate))}
        ${row('Time', formatTime(d.timeSlot))}
      </table>
      <p>Please try booking a different slot. We apologize for the inconvenience.</p>`),
  }),

  booking_cancelled: (d) => ({
    subject: `Appointment Cancelled – ${formatDate(d.appointmentDate)}`,
    text: `Dear ${d.patientName},\n\nYour appointment has been cancelled.\n\nDoctor: ${d.doctorName}\nDate: ${formatDate(d.appointmentDate)}\nTime: ${formatTime(d.timeSlot)}\n\nIf you wish to rebook, please visit our website or contact us.\n\nThank you,\nNexus Enliven`,
    html: wrap('Appointment Cancelled', '#dc2626', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Your appointment has been <strong style="color:#dc2626">cancelled</strong>.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Doctor', d.doctorName)}
        ${row('Date', formatDate(d.appointmentDate))}
        ${row('Time', formatTime(d.timeSlot))}
      </table>
      <p>If you wish to rebook, please visit our website or contact us.</p>`),
  }),

  booking_completed: (d) => ({
    subject: `Visit Complete – Thank You, ${d.patientName}`,
    text: `Dear ${d.patientName},\n\nThank you for visiting Nexus Enliven.\n\nDoctor: ${d.doctorName}\nDate: ${formatDate(d.appointmentDate)}\n\nWe hope you had a good experience. If you need a follow-up appointment, please book through our website.\n\nThank you,\nNexus Enliven`,
    html: wrap('Visit Complete', '#0f766e', `
      <p>Dear <strong>${d.patientName}</strong>,</p>
      <p>Thank you for visiting Nexus Enliven.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        ${row('Doctor', d.doctorName)}
        ${row('Date', formatDate(d.appointmentDate))}
      </table>
      <p>We hope you had a good experience. If you need a follow-up appointment, please book through our website.</p>`),
  }),
};

// ─── Send ────────────────────────────────────────────────────────────────────

/**
 * Send a booking notification email.
 * @param {string} event - One of the booking event names
 * @param {object} data  - Appointment data (with doctorName already resolved)
 * @returns {Promise<object|null>}
 */
export async function sendBookingEmail(event, data) {
  if (!data.patientEmail || !process.env.BREVO_API_KEY) return null;

  const templateFn = EMAIL_TEMPLATES[event];
  if (!templateFn) return null;

  const template = templateFn(data);

  try {
    const result = await getBrevo().transactionalEmails.sendTransacEmail({
      sender: SENDER(),
      to: [{ email: data.patientEmail }],
      subject: template.subject,
      htmlContent: template.html,
      textContent: template.text,
    });
    
    console.log(`[Brevo:Email] Sent to ${data.patientEmail}`);
    return result;
  } catch (err) {
    console.error(`[Brevo:Email] Failed for ${data.patientEmail}:`, err.message);
    return null;
  }
}
