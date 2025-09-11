import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  createCampaign,
  listCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";

const r = Router();

r.get("/", listCampaigns);
r.get("/:id", validateObjectIdParam("id"), getCampaign);

r.post("/", requireAuth, requireRole("admin"), createCampaign);
r.put("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), updateCampaign);
r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deleteCampaign);

export default r;
