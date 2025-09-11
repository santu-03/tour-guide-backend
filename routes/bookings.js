import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  createBooking,
  myBookings,
  allBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const r = Router();

r.post("/", requireAuth, createBooking);
r.get("/me", requireAuth, myBookings);
r.get("/", requireAuth, requireRole("admin"), allBookings);
r.patch("/:id/status", requireAuth, requireRole("admin"), validateObjectIdParam("id"), updateBookingStatus);

export default r;
