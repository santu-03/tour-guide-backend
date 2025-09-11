import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import {
  listUsers,
  updateMe,
  changePassword,
  adminCreateUser,
  setUserRole,
  deleteUser,
} from "../controllers/userController.js";

const r = Router();

/* me */
r.put("/me", requireAuth, updateMe);
r.patch("/me/password", requireAuth, changePassword);

/* admin */
r.get("/", requireAuth, requireRole("admin"), listUsers);
r.post("/admin-create", requireAuth, requireRole("admin"), adminCreateUser);
r.patch("/:id/role", requireAuth, requireRole("admin"), validateObjectIdParam("id"), setUserRole);
r.delete("/:id", requireAuth, requireRole("admin"), validateObjectIdParam("id"), deleteUser);

export default r;
