import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import express from "express";
import cors from "cors";

// API Handlers
import appointmentsHandler from "./api/appointments.js";
import doctorsHandler from "./api/doctors.js";
import healthCheckupsHandler from "./api/healthCheckups.js";
import slotsHandler from "./api/slots.js";
import adminBookingsHandler from "./api/admin/bookings.js";
import adminDoctorsHandler from "./api/admin/doctors.js";
import adminHealthCheckupsHandler from "./api/admin/healthCheckups.js";
import adminLeavesHandler from "./api/admin/leaves.js";
import adminMeHandler from "./api/admin/me.js";
import adminProfileHandler from "./api/admin/profile.js";
import adminSlotsHandler from "./api/admin/slots.js";

// Notification logic
import { sendBookingNotification } from "./api/_utils/brevoNotifications.js";

setGlobalOptions({ 
    maxInstances: 10,
    region: 'asia-south1'
});

// ─── Express API Function ──────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Public routes
app.all("/appointments", appointmentsHandler);
app.all("/doctors", doctorsHandler);
app.all("/healthCheckups", healthCheckupsHandler);
app.all("/slots", slotsHandler);

// Admin routes (prefixed to avoid collision)
app.all("/admin/bookings", adminBookingsHandler);
app.all("/admin/doctors", adminDoctorsHandler);
app.all("/admin/healthCheckups", adminHealthCheckupsHandler);
app.all("/admin/leaves", adminLeavesHandler);
app.all("/admin/me", adminMeHandler);
app.all("/admin/profile", adminProfileHandler);
app.all("/admin/slots", adminSlotsHandler);

export const api = onRequest(app);


// ─── Background Notifications Function ──────────────────────────────────────
// This function listens to Firestore changes and handles all notifications
export const notifications = onDocumentWritten("appointments/{id}", async (event) => {
    const beforeData = event.data.before ? event.data.before.data() : null;
    const afterData = event.data.after ? event.data.after.data() : null;

    if (!afterData) return; // Ignore deletions

    // Case 1: New booking created
    if (!beforeData) {
        console.log(`[Notification] New booking detected for ID: ${event.params.id}`);
        return sendBookingNotification('booking_created', afterData);
    }

    // Case 2: Status change
    if (beforeData.status !== afterData.status) {
        console.log(`[Notification] Status change for ${event.params.id}: ${beforeData.status} -> ${afterData.status}`);
        
        const statusToEventMap = {
            'confirmed': 'booking_confirmed',
            'rejected': 'booking_rejected',
            'cancelled': 'booking_cancelled',
            'completed': 'booking_completed',
        };

        const notificationEvent = statusToEventMap[afterData.status];
        if (notificationEvent) {
            return sendBookingNotification(notificationEvent, afterData);
        }
    } else {
        console.log(`[Notification] Ignoring non-status update for ID: ${event.params.id}`);
    }
});

// Separate trigger for health checkups
export const healthCheckupNotifications = onDocumentWritten("healthCheckups/{id}", async (event) => {
    const beforeData = event.data.before ? event.data.before.data() : null;
    const afterData = event.data.after ? event.data.after.data() : null;

    if (!afterData) return;

    // Use dynamic import to match existing logic if needed
    const { sendHealthCheckupNotification } = await import('./api/_utils/brevoHealthCheckupNotifications.js');

    if (!beforeData) {
        console.log(`[Notification] New health checkup for ID: ${event.params.id}`);
        return sendHealthCheckupNotification('checkup_booked', afterData);
    }

    if (beforeData.status !== afterData.status) {
        console.log(`[Notification] Health checkup status change for ${event.params.id}: ${beforeData.status} -> ${afterData.status}`);
        const eventMap = {
            'cancelled': 'checkup_cancelled',
            'completed': 'checkup_completed',
        };
        const notifyEvent = eventMap[afterData.status];
        if (notifyEvent) {
            return sendHealthCheckupNotification(notifyEvent, afterData);
        }
    } else {
        console.log(`[Notification] Ignoring minor health checkup update for ID: ${event.params.id}`);
    }
});
