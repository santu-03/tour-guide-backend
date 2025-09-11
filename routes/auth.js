import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const r = Router();

r.post("/signup", authLimiter, signup);
r.post("/login", authLimiter, login);
r.get("/me", requireAuth, me);

export default r;
