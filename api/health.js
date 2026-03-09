// GET /api/health
// Quick diagnostic endpoint to verify serverless functions are working.

export default async function handler(req, res) {
  const diagnostics = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ set' : '❌ MISSING',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ set' : '❌ MISSING',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? `✅ set (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : '❌ MISSING',
    },
  };

  // Try to initialize Firebase Admin
  try {
    const { getDb } = await import('./_utils/firebaseAdmin.js');
    const db = getDb();
    // Try a simple read
    const testDoc = await db.collection('doctors').limit(1).get();
    diagnostics.firebase = {
      connected: true,
      testRead: `Found ${testDoc.size} doctor(s)`,
    };
  } catch (err) {
    diagnostics.firebase = {
      connected: false,
      error: err.message,
    };
  }

  return res.status(200).json(diagnostics);
}
