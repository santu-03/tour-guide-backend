import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import { createReview, listReviews, deleteReview } from "../controllers/reviewController.js";

const r = Router();

r.get("/", listReviews);
r.post("/", requireAuth, createReview);
r.delete("/:id", requireAuth, validateObjectIdParam("id"), deleteReview);

export default r;
