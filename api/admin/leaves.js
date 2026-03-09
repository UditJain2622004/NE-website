// GET    /api/admin/leaves  — List doctor leaves
// POST   /api/admin/leaves  — Create a leave (block days)
// DELETE /api/admin/leaves  — Remove a leave

import { db } from '../_utils/firebaseAdmin.js';
import { requireAdmin } from '../_utils/authMiddleware.js';
import { sendError, sendSuccess, validateRequired, isValidDate } from '../_utils/apiHelpers.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return sendError(res, 405, 'Method not allowed');
}

async function handleGet(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { doctorId } = req.query;

  try {
    let query = db.collection('doctorLeaves');
    if (doctorId) {
      query = query.where('doctorId', '==', doctorId);
    }

    const snapshot = await query.get();
    const leaves = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by start date
    leaves.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));

    return sendSuccess(res, { leaves });
  } catch (error) {
    console.error('Error in GET /api/admin/leaves:', error);
    return sendError(res, 500, error.message);
  }
}

async function handlePost(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { doctorId, startDate, endDate, reason } = req.body;

  const validationError = validateRequired(req.body, ['doctorId', 'startDate', 'endDate']);
  if (validationError) return sendError(res, 400, validationError);

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return sendError(res, 400, 'Invalid date format. Use YYYY-MM-DD');
  }

  try {
    const docRef = await db.collection('doctorLeaves').add({
      doctorId,
      startDate,
      endDate,
      reason: reason || 'Blocked by admin',
      createdAt: new Date().toISOString()
    });

    return sendSuccess(res, { id: docRef.id, message: 'Leave created successfully' });
  } catch (error) {
    console.error('Error in POST /api/admin/leaves:', error);
    return sendError(res, 500, error.message);
  }
}

async function handleDelete(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;
  if (!id) return sendError(res, 400, 'Missing leave ID');

  try {
    await db.collection('doctorLeaves').doc(id).delete();
    return sendSuccess(res, { message: 'Leave deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/leaves:', error);
    return sendError(res, 500, error.message);
  }
}
