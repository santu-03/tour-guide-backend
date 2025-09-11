import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { uploadSingle } from "../middleware/upload.js";
import { validateObjectIdParam } from "../middleware/objectIdParam.js";
import { uploadImage, deleteImage, listMedia } from "../controllers/mediaController.js";

const r = Router();

r.post("/upload", requireAuth, uploadSingle("file"), uploadImage);
r.get("/mine", requireAuth, listMedia);
r.delete("/:id", requireAuth, validateObjectIdParam("id"), deleteImage);

export default r;
