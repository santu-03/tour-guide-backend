import createError from "http-errors";
import cloudinary from "../config/cloudinary.js";
import { Media } from "../models/media.js";

const FOLDER = process.env.CLOUDINARY_DEFAULT_FOLDER || "tour-guide";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) throw createError(400, "No file uploaded");
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const up = await cloudinary.uploader.upload(b64, { folder: FOLDER });

    const media = await Media.create({
      url: up.secure_url,
      publicId: up.public_id,
      folder: FOLDER,
      uploadedBy: req.user?._id,
      meta: up,
    });

    res.status(201).json({ message: "Uploaded", data: { media } });
  } catch (err) { next(err); }
};

export const deleteImage = async (req, res, next) => {
  try {
    const doc = await Media.findById(req.params.id);
    if (!doc) throw createError(404, "Media not found");
    await cloudinary.uploader.destroy(doc.publicId);
    await doc.deleteOne();
    res.json({ message: "Deleted", data: { id: req.params.id } });
  } catch (err) { next(err); }
};

export const listMedia = async (req, res, next) => {
  try {
    const filter = req.user ? { uploadedBy: req.user._id } : {};
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json({ data: { media } });
  } catch (err) { next(err); }
};
