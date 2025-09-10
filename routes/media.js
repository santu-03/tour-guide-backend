import { Router } from "express";
import { uploadSingle, uploadMany } from "../middleware/upload.js";
import { uploadOne, uploadManyCtrl, listMedia, removeMedia } from "../controllers/mediaController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", listMedia);
router.post("/", protect, uploadSingle, uploadOne);
router.post("/many", protect, uploadMany, uploadManyCtrl);
router.delete("/:id", protect, removeMedia);

export default router;
