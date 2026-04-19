import { db } from '../_utils/firebaseAdmin.js';
import { sendError } from '../_utils/apiHelpers.js';
import { FieldValue } from 'firebase-admin/firestore';

const TRACKED_EVENTS = ['delivered', 'soft_bounce', 'hard_bounce', 'error', 'blocked', 'invalid_email', 'deferred', 'opened', 'clicked', 'complaint', 'unsubscribed'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const payload = req.body;

    if (!payload || !payload.event) {
      return res.status(200).json({ received: true, skipped: 'no event' });
    }

    const { event, email, date, tags, 'message-id': messageId } = payload;

    if (!TRACKED_EVENTS.includes(event)) {
      return res.status(200).json({ received: true, skipped: `untracked event: ${event}` });
    }

    const appointmentId = tags?.find(t => t !== 'confirm' && t !== 'reject');

    const webhookLog = {
      event,
      email: email || null,
      messageId: messageId || null,
      brevoDate: date || null,
      tags: tags || [],
      appointmentId: appointmentId || null,
      receivedAt: FieldValue.serverTimestamp(),
    };

    await db.collection('brevoWebhookLogs').add(webhookLog);

    if (appointmentId) {
      try {
        const appointmentRef = db.collection('appointments').doc(appointmentId);
        const doc = await appointmentRef.get();
        if (doc.exists) {
          await appointmentRef.update({
            [`emailStatus.${event}`]: {
              at: date || new Date().toISOString(),
              messageId: messageId || null,
            },
            'emailStatus.latest': event,
          });
        }
      } catch (err) {
        console.error(`[Webhook] Failed to update appointment ${appointmentId}:`, err.message);
      }
    }

    return res.status(200).json({ received: true, event, appointmentId: appointmentId || null });

  } catch (error) {
    console.error('[Webhook] Brevo webhook error:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
}
