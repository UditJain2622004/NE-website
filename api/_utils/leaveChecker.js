// Doctor leave checking utility

import { db } from './firebaseAdmin.js';

/**
 * Check if a doctor is on leave for a given date.
 * 
 * @param {string} doctorId - Doctor document ID
 * @param {string} dateStr - Date in "YYYY-MM-DD" format
 * @returns {Promise<{onLeave: boolean, reason?: string}>}
 */
export async function checkDoctorLeave(doctorId, dateStr) {
  const leavesSnapshot = await db
    .collection('doctorLeaves')
    .where('doctorId', '==', doctorId)
    .where('startDate', '<=', dateStr)
    .get();

  // Filter further: endDate must be >= dateStr
  // (Firestore doesn't support range filters on two different fields without a composite index that
  //  matches this exact pattern. We do startDate <= dateStr in the query, then filter endDate in code.)
  for (const doc of leavesSnapshot.docs) {
    const leave = doc.data();
    if (leave.endDate >= dateStr) {
      return { onLeave: true, reason: leave.reason || 'Doctor is on leave' };
    }
  }

  return { onLeave: false };
}
