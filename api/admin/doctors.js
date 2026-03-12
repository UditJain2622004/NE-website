// GET /api/admin/doctors (~/admin/doctors.js and ~/admin/leaves.js GET)
// POST /api/admin/doctors (~/admin/leaves.js POST)
// DELETE /api/admin/doctors (~/admin/leaves.js DELETE)

import { db } from '../_utils/firebaseAdmin.js';
import { verifyAuth, requireAdmin } from '../_utils/authMiddleware.js';
import { sendError, sendSuccess, validateRequired, isValidDate } from '../_utils/apiHelpers.js';

export default async function handler(req, res) {
  const result = await verifyAuth(req);
  if (result.error) return sendError(res, result.status, result.error);

  const { method } = req;
  const { user } = result;

  if (method === 'GET') {
    const { type } = req.query; // 'list' or 'leaves'

    if (type === 'leaves') {
      const { doctorId } = req.query;
      const targetDoctorId = user.role === 'admin' ? doctorId : user.doctorId;
      
      let query = db.collection('doctorLeaves');
      if (targetDoctorId) query = query.where('doctorId', '==', targetDoctorId);
      
      const snapshot = await query.get();
      const leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leaves.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
      return sendSuccess(res, { leaves });
    }

    // Default: List all doctors (Admin only)
    if (user.role !== 'admin') return sendError(res, 403, 'Unauthorized');
    const snapshot = await db.collection('doctors').get();
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return sendSuccess(res, { doctors });
  }

  if (method === 'POST') {
    // Create a leave/block
    const { doctorId, startDate, endDate, reason } = req.body;
    const targetDoctorId = user.role === 'admin' ? doctorId : user.doctorId;
    if (!targetDoctorId) return sendError(res, 400, 'Doctor ID is required');

    const validationError = validateRequired(req.body, ['startDate', 'endDate']);
    if (validationError) return sendError(res, 400, validationError);

    if (!isValidDate(startDate) || !isValidDate(endDate)) return sendError(res, 400, 'Invalid date format');

    const docRef = await db.collection('doctorLeaves').add({
      doctorId: targetDoctorId,
      startDate,
      endDate,
      reason: reason || 'Personal Leave',
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
    });
    return sendSuccess(res, { id: docRef.id, message: 'Blockage created successfully' });
  }

  if (method === 'DELETE') {
    // Delete a leave
    const { id } = req.query;
    if (!id) return sendError(res, 400, 'Missing leave ID');

    const docRef = db.collection('doctorLeaves').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return sendError(res, 404, 'Leave not found');
    
    if (user.role === 'doctor' && doc.data().doctorId !== user.doctorId) {
      return sendError(res, 403, 'Unauthorized');
    }

    await docRef.delete();
    return sendSuccess(res, { message: 'Blockage removed successfully' });
  }

  return sendError(res, 405, 'Method not allowed');
}
