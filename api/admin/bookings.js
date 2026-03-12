// GET    /api/admin/bookings?type=appointments|healthCheckups
// POST   /api/admin/bookings (create appointment)
// PATCH  /api/admin/bookings (update status/patient)
// DELETE /api/admin/bookings (delete record)

import { db } from '../_utils/firebaseAdmin.js';
import { verifyAuth, requireAdmin } from '../_utils/authMiddleware.js';
import { sendError, sendSuccess, validateRequired, isValidDate, isValidTime } from '../_utils/apiHelpers.js';
import { generateSlotTimes, buildSlotId, classifyBookingDate } from '../_utils/slotGenerator.js';
import { sendBookingNotification, actionToEvent } from '../_utils/brevoNotifications.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  const result = await verifyAuth(req);
  if (result.error) return sendError(res, result.status, result.error);
  const { user } = result;

  const type = req.query.type || 'appointments';

  if (req.method === 'GET') {
    if (type === 'healthCheckups') return handleGetHealth(req, res, user);
    return handleGetAppointments(req, res, user);
  }
  
  if (req.method === 'POST') {
    return handlePostAppointment(req, res, user);
  }

  if (req.method === 'PATCH') {
    if (type === 'healthCheckups') return handlePatchHealth(req, res, user);
    return handlePatchAppointment(req, res, user);
  }

  if (req.method === 'DELETE') {
    if (type === 'healthCheckups') return handleDeleteHealth(req, res, user);
    return handleDeleteAppointment(req, res, user);
  }

  return sendError(res, 405, 'Method not allowed');
}

// ─── GET: Appointments ─────────────────────────────────────────────────────────
async function handleGetAppointments(req, res, user) {
  const { doctorId, dateFrom, dateTo, status } = req.query;
  try {
    let query = db.collection('appointments');
    const filterDoctorId = user.role === 'doctor' ? user.doctorId : (doctorId || null);
    if (filterDoctorId) query = query.where('doctorId', '==', filterDoctorId);
    
    const snapshot = await query.get();
    let bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString() || null };
    });

    if (dateFrom) bookings = bookings.filter(b => b.appointmentDate >= dateFrom);
    if (dateTo) bookings = bookings.filter(b => b.appointmentDate <= dateTo);
    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      bookings = bookings.filter(b => statuses.includes(b.status));
    }
    bookings.sort((a,b) => (b.appointmentDate||'').localeCompare(a.appointmentDate||'') || (a.timeSlot||'').localeCompare(b.timeSlot||''));
    return sendSuccess(res, { bookings });
  } catch (err) { return sendError(res, 500, err.message); }
}

// ─── GET: Health Checkups ─────────────────────────────────────────────────────
async function handleGetHealth(req, res, user) {
  const { status, dateFrom, dateTo } = req.query;
  try {
    const snapshot = await db.collection('healthCheckups').get();
    let checkups = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data, createdAt: data.createdAt?.toDate?.()?.toISOString() || null };
    });
    if (dateFrom) checkups = checkups.filter(c => c.preferredDate >= dateFrom);
    if (dateTo) checkups = checkups.filter(c => c.preferredDate <= dateTo);
    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      checkups = checkups.filter(c => statuses.includes(c.status));
    }
    checkups.sort((a,b) => (a.preferredDate||'').localeCompare(b.preferredDate||''));
    return sendSuccess(res, { checkups });
  } catch (err) { return sendError(res, 500, err.message); }
}

// ─── POST: Create Appointment ──────────────────────────────────────────────────
async function handlePostAppointment(req, res, user) {
  if (user.role !== 'admin') return sendError(res, 403, 'Admin only');
  const body = req.body;
  const validationError = validateRequired(body, ['doctorId', 'date', 'time', 'patientName', 'patientPhone']);
  if (validationError) return sendError(res, 400, validationError);

  const { doctorId, date, time, patientName, patientPhone, patientEmail, status } = body;
  try {
    const doctorDoc = await db.collection('doctors').doc(doctorId).get();
    if (!doctorDoc.exists) return sendError(res, 404, 'Doctor not found');
    const doctor = doctorDoc.data();
    
    const appointmentId = await db.runTransaction(async (transaction) => {
      const appointmentRef = db.collection('appointments').doc();
      const appointmentData = {
        patientId: patientPhone, doctorId, patientName, patientPhone,
        patientEmail: patientEmail || null, appointmentDate: date, timeSlot: time,
        bookingType: 'instant', type: 'new', status: status || 'confirmed',
        createdAt: FieldValue.serverTimestamp(), createdByAdmin: true,
      };
      transaction.set(appointmentRef, appointmentData);
      return appointmentRef.id;
    });

    return sendSuccess(res, { appointmentId, message: 'Booking created' });
  } catch (err) { return sendError(res, 500, err.message); }
}

// ─── PATCH: Appointment ────────────────────────────────────────────────────────
async function handlePatchAppointment(req, res, user) {
  const { appointmentId, action, patientName, patientPhone, patientEmail } = req.body;
  try {
    const ref = db.collection('appointments').doc(appointmentId);
    const doc = await ref.get();
    if (!doc.exists) return sendError(res, 404, 'Not found');
    const app = doc.data();
    if (user.role === 'doctor' && app.doctorId !== user.doctorId) return sendError(res, 403, 'Unauthorized');

    const updateData = {};
    if (action) {
      const statusMap = { confirm: 'confirmed', reject: 'rejected', cancel: 'cancelled', complete: 'completed' };
      updateData.status = statusMap[action];
      if (action === 'confirm') updateData.confirmedAt = FieldValue.serverTimestamp();
    }
    if (user.role === 'admin') {
      if (patientName) updateData.patientName = patientName;
      if (patientPhone) { updateData.patientPhone = patientPhone; updateData.patientId = patientPhone; }
      if (patientEmail !== undefined) updateData.patientEmail = patientEmail || null;
    }
    await ref.update(updateData);
    return sendSuccess(res, { message: 'Updated' });
  } catch (err) { return sendError(res, 500, err.message); }
}

// ─── PATCH: Health Checkup ────────────────────────────────────────────────────
async function handlePatchHealth(req, res, user) {
  const { checkupId, action } = req.body;
  try {
    const ref = db.collection('healthCheckups').doc(checkupId);
    const doc = await ref.get();
    if (!doc.exists) return sendError(res, 404, 'Not found');
    const statusMap = { cancel: 'cancelled', complete: 'completed' };
    await ref.update({ status: statusMap[action] });
    return sendSuccess(res, { message: 'Updated' });
  } catch (err) { return sendError(res, 500, err.message); }
}

// ─── DELETE: ──────────────────────────────────────────────────────────────────
async function handleDeleteAppointment(req, res, user) {
  const { appointmentId } = req.query;
  try {
    const ref = db.collection('appointments').doc(appointmentId);
    const doc = await ref.get();
    if (!doc.exists) return sendError(res, 404, 'Not found');
    if (user.role === 'doctor' && doc.data().doctorId !== user.doctorId) return sendError(res, 403, 'Unauthorized');
    await ref.delete();
    return sendSuccess(res, { message: 'Deleted' });
  } catch (err) { return sendError(res, 500, err.message); }
}

async function handleDeleteHealth(req, res, user) {
  if (user.role !== 'admin') return sendError(res, 403, 'Admin only');
  const { checkupId } = req.query;
  try {
    await db.collection('healthCheckups').doc(checkupId).delete();
    return sendSuccess(res, { message: 'Deleted' });
  } catch (err) { return sendError(res, 500, err.message); }
}
