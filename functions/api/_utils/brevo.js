import 'dotenv/config';

export const TYPES = {
  CONFIRM: "confirm",
  REJECT: "reject"
};

const RETRY_DELAYS = [0, 10 * 60_000, 60 * 60_000, 2 * 60 * 60_000, 8 * 60 * 60_000];
const MAX_ATTEMPTS = 5;

async function withRetry(fn, label) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      console.log(`[Brevo] ${label} — retry #${attempt} in ${delay / 1000}s`);
      await new Promise(r => setTimeout(r, delay));
    }
    try {
      const res = await fn();
      if (res.ok || (res.status >= 200 && res.status < 300)) return res;

      if (res.status === 429 || res.status >= 500) {
        console.warn(`[Brevo] ${label} — attempt ${attempt + 1} got ${res.status}, will retry`);
        continue;
      }

      // 4xx (except 429) — don't retry, it won't help
      const body = await res.text();
      console.error(`[Brevo] ${label} — ${res.status}: ${body}`);
      return res;
    } catch (err) {
      console.warn(`[Brevo] ${label} — attempt ${attempt + 1} network error: ${err.message}`);
      if (attempt === MAX_ATTEMPTS - 1) throw err;
    }
  }
  throw new Error(`${label} failed after ${MAX_ATTEMPTS} attempts`);
}

const getSMSContent=(patientName,doctorName,appointmentDate,timeSlot,type)=>{
    const hasPrefix = /^dr\.?\s/i.test(doctorName) || /^doctor\s/i.test(doctorName);
    const doctorPrefix = hasPrefix ? "" : "Dr. ";

    const SMS_CONFIRM_CONTENT=`Dear ${patientName}, Your appointment with ${doctorPrefix}${doctorName} is confirmed for ${appointmentDate} at ${timeSlot}. Please arrive 10 minutes early. Thank you, Nexus Enliven Hospital. For assistance, contact us at +91 91876 34758.`

    const SMS_REJECT_CONTENT=`Dear ${patientName}, Your appointment request with ${doctorPrefix}${doctorName} on ${appointmentDate} at ${timeSlot} could not be confirmed. Please try booking a different slot. - Nexus Enliven Hospital. For assistance, contact us at +91 91876 34758.`

    if(type===TYPES.CONFIRM){
        return SMS_CONFIRM_CONTENT
    }else if(type===TYPES.REJECT){
        return SMS_REJECT_CONTENT
    }else{
    throw new Error("Invalid SMS type")
}
}

const getEmailContent=(type)=>{
    const EMAIL_CONFIRM_CONTENT=`
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: #2c7be5; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Nexus Enliven Hospital</h1>
              <p style="margin: 5px 0 0;">Appointment Confirmation</p>
            </div>

            <!-- Body -->
            <div style="padding: 25px;">
              <p style="font-size: 16px;">Hello, {{params.patientName}}</p>

              <p style="font-size: 15px; color: #555;">
                Your appointment has been successfully booked. Here are the details:
              </p>

              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Patient Name:</strong> {{params.patientName}}</p>
                <p><strong>Doctor:</strong> {{params.doctorName}}</p>
                <p><strong>Date:</strong> {{params.appointmentDate}}</p>
                <p><strong>Time Slot:</strong> {{params.timeSlot}}</p>
              </div>

              <p style="font-size: 14px; color: #777;">
                Please arrive 10 minutes early.
              </p>
              <p style="font-size: 14px; color: #777;">
                If you need to reschedule, contact us at +91 91876 34758.
              </p>

              <p style="margin-top: 20px;">Thank you,<br><strong>Nexus Enliven Team</strong></p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f3f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
              © 2026 Nexus Enliven. All rights reserved.
            </div>

          </div>
        </div>
      `

    const EMAIL_REJECT_CONTENT=`
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: #e5533d; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Nexus Enliven Hospital</h1>
      <p style="margin: 5px 0 0;">Appointment Update</p>
    </div>

    <!-- Body -->
    <div style="padding: 25px;">
      <p style="font-size: 16px;">Hello {{params.patientName}},</p>

      <p style="font-size: 15px; color: #555;">
        We regret to inform you that your appointment request could not be confirmed at this time.
      </p>

      <div style="background: #fff5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c2c0;">
        <p><strong>Doctor:</strong> {{params.doctorName}}</p>
        <p><strong>Date:</strong> {{params.appointmentDate}}</p>
        <p><strong>Requested Time Slot:</strong> {{params.timeSlot}}</p>
      </div>

      <p style="font-size: 14px; color: #777;">
        This may be due to slot unavailability or scheduling conflicts.
      </p>

      <p style="font-size: 14px; color: #555;">
        We recommend booking another slot at your convenience.
      </p>

      <p style="font-size: 14px; color: #777;">
        For assistance, contact us at +91 91876 34758.
      </p>

      <p style="margin-top: 20px;">We appreciate your understanding,<br><strong>Nexus Enliven Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background: #f1f3f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
      © 2026 Nexus Enliven. All rights reserved.
    </div>

  </div>
</div>
`

    if(type===TYPES.CONFIRM){
        return EMAIL_CONFIRM_CONTENT
    }else if(type===TYPES.REJECT){
        return EMAIL_REJECT_CONTENT
    }else{
    throw new Error("Invalid  Email type")
}
}

const getEmailSubject=(type)=>{
    if(type===TYPES.CONFIRM){
        return "Appointment Confirmation - Nexus Enliven"
    }else if(type===TYPES.REJECT){
        return "Appointment Update - Nexus Enliven"
    }else{
    throw new Error("Invalid Email type")
}
}



export async function sendSMS(patientName, patientPhone, doctorName, appointmentDate, timeSlot, type) {
  const response = await withRetry(
    () => fetch("https://api.brevo.com/v3/transactionalSMS/send", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: "NE Hospital",
        recipient: String(patientPhone),
        content: getSMSContent(patientName, doctorName, appointmentDate, timeSlot, type),
        type: "transactional",
        tag: type,
        organisationPrefix: "Nexus Enliven Hospital"
      })
    }),
    `SMS to ${patientPhone}`
  );

  const data = await response.json();
  return data;
}





export async function sendAppointmentEmail(patientName, patientEmail, doctorName, appointmentDate, timeSlot, type, appointmentId) {
  const response = await withRetry(
    () => fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Nexus Enliven Hospital",
          email: "uditjain2622004@gmail.com"
        },
        to: [
          {
            email: patientEmail,
            name: patientName
          }
        ],
        subject: getEmailSubject(type),
        params: {
          patientName,
          doctorName,
          appointmentDate,
          timeSlot
        },
        htmlContent: getEmailContent(type),
        tags: [type, ...(appointmentId ? [appointmentId] : [])]
      })
    }),
    `Email to ${patientEmail}`
  );

  const data = await response.json();
  return data;
}