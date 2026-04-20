import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import { initializeApp, getApp } from "firebase-admin/app";
import { getFunctions } from "firebase-admin/functions";
import express from "express";
import cors from "cors";

initializeApp();

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

// 1. Prefix-stripping middleware
// Handles the difference between Firebase Hosting rewrites (which include /api) 
// and direct function calls (which typically do not).
app.use((req, res, next) => {
    if (req.url.startsWith('/api/') || req.url === '/api') {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }
    next();
});

// 2. Health check route for diagnostics
app.get("/health", (req, res) => res.json({
    success: true,
    message: "API is alive",
    timestamp: new Date().toISOString()
}));

// 3. Define the routes in a router
const router = express.Router();

// Public routes
router.all("/appointments", appointmentsHandler);
router.all("/doctors", doctorsHandler);
router.all("/healthCheckups", healthCheckupsHandler);
router.all("/slots", slotsHandler);

// Admin routes
router.all("/admin/bookings", adminBookingsHandler);
router.all("/admin/doctors", adminDoctorsHandler);
router.all("/admin/healthCheckups", adminHealthCheckupsHandler);
router.all("/admin/leaves", adminLeavesHandler);
router.all("/admin/me", adminMeHandler);
router.all("/admin/profile", adminProfileHandler);
router.all("/admin/slots", adminSlotsHandler);

// 4. Mount the router
app.use(router);

export const api = onRequest(app);


// ─── Task Queue Handlers ───────────────────────────────────────────────────

export const processNotificationTask = onTaskDispatched({
    retryConfig: {
        maxAttempts: 5,
        minBackoffSeconds: 60,
    },
    rateLimits: {
        maxConcurrentDispatches: 5,
    },
    region: 'asia-south1'
}, async (event) => {
    const { action, appointmentData, type } = event.data;
    return runNotification(action, appointmentData, type);
});

// ─── Background Notifications Function ──────────────────────────────────────
// This function listens to Firestore changes and enqueues tasks
export const notifications = onDocumentWritten("appointments/{id}", async (event) => {
    const beforeData = event.data.before ? event.data.before.data() : null;
    const afterData = event.data.after ? event.data.after.data() : null;

    if (!afterData) return; // Ignore deletions

    let notificationEvent = null;

    // Case 1: New booking created
    if (!beforeData) {
        console.log(`[Queue] Enqueuing new booking notification: ${event.params.id}`);
        notificationEvent = 'booking_created';
    }
    // Case 2: Status change
    else if (beforeData.status !== afterData.status) {
        console.log(`[Queue] Enqueuing status change notification for ${event.params.id}: ${afterData.status}`);
        const statusToEventMap = {
            'confirmed': 'booking_confirmed',
            'rejected': 'booking_rejected',
            'cancelled': 'booking_cancelled',
            'completed': 'booking_completed',
        };
        notificationEvent = statusToEventMap[afterData.status];
    }

    if (notificationEvent) {
        await dispatchNotification({ action: notificationEvent, appointmentData: afterData });
    }
});

// Separate trigger for health checkups
export const healthCheckupNotifications = onDocumentWritten("healthCheckups/{id}", async (event) => {
    const beforeData = event.data.before ? event.data.before.data() : null;
    const afterData = event.data.after ? event.data.after.data() : null;

    if (!afterData) return;

    let notificationEvent = null;

    if (!beforeData) {
        notificationEvent = 'checkup_booked';
    } else if (beforeData.status !== afterData.status) {
        const eventMap = {
            'cancelled': 'checkup_cancelled',
            'completed': 'checkup_completed',
        };
        notificationEvent = eventMap[afterData.status];
    }

    if (notificationEvent) {
        await dispatchNotification({ action: notificationEvent, appointmentData: afterData, type: 'healthCheckup' });
    }
});

// ─── Dispatch Helper ─────────────────────────────────────────────────────────
// In the local emulator, the Tasks queue SDK cannot reach the local task runner.
// So we detect this and call the notification logic directly.
// In production, tasks are properly enqueued for resilient retry handling.
async function dispatchNotification(payload) {
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

    if (isEmulator) {
        // Emulator: call directly since the task queue SDK doesn't self-enqueue locally
        const { action, appointmentData, type } = payload;
        return runNotification(action, appointmentData, type);
    }

    // Production: use the Task Queue for reliable, retryable delivery
    const queue = getFunctions().taskQueue('locations/asia-south1/functions/processNotificationTask'); await queue.enqueue(payload);
}

async function runNotification(action, appointmentData, type) {
    if (type === 'healthCheckup') {
        const { sendHealthCheckupNotification } = await import('./api/_utils/brevoHealthCheckupNotifications.js');
        return sendHealthCheckupNotification(action, appointmentData);
    }
    return sendBookingNotification(action, appointmentData);
}
