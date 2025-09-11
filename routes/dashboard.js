import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { summary } from "../controllers/dashboardController.js";

const r = Router();

r.get("/summary", requireAuth, requireRole("admin"), summary);

export default r;
