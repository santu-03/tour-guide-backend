import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import { createPayment, markPaid, listPayments } from "../controllers/paymentController.js";

const r = Router();

r.post("/", requireAuth, createPayment);
r.get("/", requireAuth, requireRole("admin"), listPayments);
r.patch("/:id/paid", requireAuth, requireRole("admin"), validateObjectIdParam("id"), markPaid);

export default r;
