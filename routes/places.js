import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  createPlace,
  listPlaces,
  getPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";

const r = Router();

r.get("/", listPlaces);
r.get("/:id", validateObjectIdParam("id"), getPlace);

r.post("/", requireAuth, requireRole("admin"), createPlace);
r.put("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), updatePlace);
r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deletePlace);

export default r;
