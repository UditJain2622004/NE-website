// GET /api/admin/account (metadata & profile)
// PATCH /api/admin/account (profile update)

import { verifyAuth } from '../_utils/authMiddleware.js';
import { db } from '../_utils/firebaseAdmin.js';
import { sendError, sendSuccess } from '../_utils/apiHelpers.js';

export default async function handler(req, res) {
  const result = await verifyAuth(req);
  if (result.error) return sendError(res, result.status, result.error);

  const { method } = req;
  const { user } = result;

  // targetDoctorId: for admins, they can pass it to view/edit someone else.
  // for doctors, it's locked to their own ID.
  const targetDoctorId = user.role === 'admin' ? (req.query.doctorId || user.doctorId) : user.doctorId;

  try {
    if (method === 'GET') {
      // 1. Get Me (metadata)
      const userDoc = await db.collection('adminUsers').doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      // 2. Get Profile (doctor data)
      let profile = null;
      if (targetDoctorId) {
        const doc = await db.collection('doctors').doc(targetDoctorId).get();
        if (doc.exists) {
          profile = { id: doc.id, ...doc.data() };
        }
      }

      return sendSuccess(res, {
        user: { 
          uid: user.uid, 
          email: user.email, 
          name: userData.name || user.name, 
          role: user.role, 
          doctorId: user.doctorId 
        },
        profile
      });
    }

    if (method === 'PATCH') {
      if (!targetDoctorId) return sendError(res, 400, 'Doctor ID required');

      const updates = req.body;
      const allowedFields = ['name', 'specialization', 'department', 'weeklySchedule', 'breakTimes', 'isActive'];
      const filteredUpdates = {};
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) filteredUpdates[key] = updates[key];
      });

      await db.collection('doctors').doc(targetDoctorId).update({
        ...filteredUpdates,
        updatedAt: new Date().toISOString()
      });

      return sendSuccess(res, { message: 'Account profile updated successfully' });
    }

    return sendError(res, 405, 'Method not allowed');
  } catch (error) {
    console.error('Error in /api/admin/account:', error);
    return sendError(res, 500, error.message);
  }
}
