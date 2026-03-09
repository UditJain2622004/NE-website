// GET /api/appointments?doctorId=X&date=YYYY-MM-DD&status=pending
// PATCH /api/appointments  { appointmentId, action: "confirm"|"reject"|"complete" }
//
// GET: Fetches appointments filtered by doctorId, date, and/or status.
// PATCH: Updates appointment status (confirm/reject/complete).

import { db } from './_utils/firebaseAdmin.js';
import { sendError, sendSuccess, validateRequired } from './_utils/apiHelpers.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res);
  }

  return sendError(res, 405, 'Method not allowed');
}

// ─── GET: Fetch appointments ────────────────────────────────────────────────────

async function handleGet(req, res) {
  const { doctorId, date, status, patientPhone } = req.query;

  try {
    let query = db.collection('appointments');

    // Apply filters
    if (doctorId) {
      query = query.where('doctorId', '==', doctorId);
    }

    if (date) {
      query = query.where('appointmentDate', '==', date);
    }

    if (status) {
      // Support comma-separated statuses: "pending,confirmed"
      const statuses = status.split(',').map(s => s.trim());
      if (statuses.length === 1) {
        query = query.where('status', '==', statuses[0]);
      } else {
        query = query.where('status', 'in', statuses);
      }
    }

    if (patientPhone) {
      query = query.where('patientId', '==', patientPhone);
    }

    // Order by appointment date
    query = query.orderBy('appointmentDate', 'asc');

    const snapshot = await query.get();

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      confirmedAt: doc.data().confirmedAt?.toDate?.()?.toISOString() || null,
    }));

    return sendSuccess(res, { appointments });

  } catch (error) {
    console.error('Error in GET /api/appointments:', error);
    return sendError(res, 500, 'Internal server error');
  }
}

// ─── PATCH: Update appointment status ──────────────────────────────────────────

async function handlePatch(req, res) {
  const { appointmentId, action } = req.body;

  // Validate inputs
  const validationError = validateRequired(req.body, ['appointmentId', 'action']);
  if (validationError) {
    return sendError(res, 400, validationError);
  }

  const validActions = ['confirm', 'reject', 'cancel', 'complete'];
  if (!validActions.includes(action)) {
    return sendError(res, 400, `Invalid action. Must be one of: ${validActions.join(', ')}`);
  }

  try {
    const appointmentRef = db.collection('appointments').doc(appointmentId);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) {
      return sendError(res, 404, 'Appointment not found');
    }

    const appointment = appointmentDoc.data();

    // --- Validate state transitions ---
    const allowedTransitions = {
      pending: ['confirm', 'reject', 'cancel'],
      confirmed: ['complete', 'cancel'],
      rejected: [],
      cancelled: [],
      completed: [],
    };

    const allowed = allowedTransitions[appointment.status] || [];
    if (!allowed.includes(action)) {
      return sendError(
        res,
        400,
        `Cannot ${action} an appointment with status "${appointment.status}"`
      );
    }

    // --- Build the update ---
    const statusMap = {
      confirm: 'confirmed',
      reject: 'rejected',
      cancel: 'cancelled',
      complete: 'completed',
    };

    const updateData = {
      status: statusMap[action],
    };

    if (action === 'confirm') {
      updateData.confirmedAt = FieldValue.serverTimestamp();
    }

    // --- If rejecting or cancelling an instant booking, free the slot ---
    if ((action === 'reject' || action === 'cancel') && appointment.bookingType === 'instant') {
      const slotId = `${appointment.doctorId}_${appointment.appointmentDate}_${appointment.timeSlot}`;
      const slotRef = db.collection('doctorSlots').doc(slotId);
      const slotDoc = await slotRef.get();

      if (slotDoc.exists && slotDoc.data().booked) {
        // Use a batch to update both atomically
        const batch = db.batch();
        batch.update(appointmentRef, updateData);
        batch.update(slotRef, {
          booked: false,
          appointmentId: null,
        });
        await batch.commit();

        return sendSuccess(res, {
          appointmentId,
          newStatus: statusMap[action],
          slotFreed: true,
          message: `Appointment ${statusMap[action]}. Slot has been freed.`,
        });
      }
    }

    // --- Standard update (no slot to free) ---
    await appointmentRef.update(updateData);

    return sendSuccess(res, {
      appointmentId,
      newStatus: statusMap[action],
      message: `Appointment ${statusMap[action]} successfully.`,
    });

  } catch (error) {
    console.error('Error in PATCH /api/appointments:', error);
    return sendError(res, 500, 'Internal server error');
  }
}
