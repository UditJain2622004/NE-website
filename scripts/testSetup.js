import { db } from '../functions/api/_utils/firebaseAdmin.js';

// 1. CHOOSE A REAL DOCTOR AND APPOINTMENT ID FROM YOUR CONSOLE
const REAL_DOCTOR_ID = "doctor_akshath";
const REAL_APP_ID = "89EyNatZyIkR6akQJ3z6";

async function setup() {
    console.log("Cloning Doctor...");
    const docData = (await db.collection('doctors').doc(REAL_DOCTOR_ID).get()).data();
    // Ensure the local function thinks it's the same doctor
    await db.collection('doctors').doc(REAL_DOCTOR_ID).set(docData);

    console.log("Cloning Appointment...");
    const appData = (await db.collection('appointments').doc(REAL_APP_ID).get()).data();

    // RENAME TO RETRY_TEST TO TRIGGER OUR FAIL-TWICE LOGIC
    appData.patientName = "RETRY_TEST";
    appData.status = "pending";

    await db.collection('appointments').doc('test-retry-trigger').set(appData);

    console.log("\nSUCCESS! Check your Emulator UI.");
    console.log("Now just change that appointment's status to 'confirmed' in the UI.");
}

setup();
