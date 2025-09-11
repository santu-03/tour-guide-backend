import multer from "multer";
import createError from "http-errors";

const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED.has(file.mimetype)) {
    return cb(createError(400, "Unsupported file type"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// helpers if you need multiple fields later
export const uploadSingle = (field = "file") => upload.single(field);
export const uploadArray = (field = "files", max = 5) => upload.array(field, max);
