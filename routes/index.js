import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import placeRoutes from "./places.js";
import activityRoutes from "./activities.js";
import bookingRoutes from "./bookings.js";
import reviewRoutes from "./reviews.js";
import mediaRoutes from "./media.js";
import paymentRoutes from "./payments.js";
import campaignRoutes from "./campaigns.js";
import dashboardRoutes from "./dashboard.js";

const router = Router();

// mount versioned api in server.js at /api/v1 -> here we export the subrouter
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/places", placeRoutes);
router.use("/activities", activityRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/media", mediaRoutes);
router.use("/payments", paymentRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
