import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  createActivity,
  listActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const r = Router();

r.get("/", listActivities);
r.get("/:id", validateObjectIdParam("id"), getActivity);

r.post("/", requireAuth, requireRole("admin"), createActivity);
r.put("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), updateActivity);
r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deleteActivity);

export default r;
