// import { Router } from "express";
// import { uploadSingle, uploadMany } from "../middleware/upload.js";
// import { uploadOne, uploadManyCtrl, listMedia, removeMedia } from "../controllers/mediaController.js";
// import { protect } from "../middleware/auth.js";

// const router = Router();
// router.get("/", listMedia);
// router.post("/", protect, uploadSingle, uploadOne);
// router.post("/many", protect, uploadMany, uploadManyCtrl);
// router.delete("/:id", protect, removeMedia);

// export default router;



import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const MetaSchema = new Schema({
  original_filename: String,
  etag: String,
  version: Number,
  uploadType: {
    type: String,
    enum: ['places', 'activities', 'profiles', 'reviews', 'campaigns'],
    default: 'places'
  },
  relatedId: { type: Types.ObjectId }
}, { _id: false });

const MediaSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: "User" },
  url: { type: String, required: true },
  public_id: { 
    type: String, 
    required: true, 
    unique: true
    // Removed: index: true (unique already creates an index)
  },
  resource_type: { 
    type: String, 
    enum: ["image", "video", "raw"], 
    default: "image" 
  },
  format: String,
  bytes: Number,
  width: Number,
  height: Number,
  folder: String,
  tags: [String],
  context: { type: Object, default: {} },
  meta: { type: MetaSchema, default: () => ({}) },
  title: String,
  description: String,
  altText: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for performance (removed duplicate public_id index)
MediaSchema.index({ 'meta.uploadType': 1, createdAt: -1 });
MediaSchema.index({ ownerId: 1, isActive: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ title: 'text', description: 'text', altText: 'text' });
MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ ownerId: 1, createdAt: -1 });

// Virtual for human readable file size
MediaSchema.virtual('humanFileSize').get(function() {
  if (!this.bytes) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.bytes) / Math.log(1024));
  return Math.round(this.bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

MediaSchema.set('toJSON', { 
  virtuals: true, 
  versionKey: false, 
  transform: (_d, r) => { 
    r.id = r._id; 
    delete r._id; 
  }
});

export default (mongoose.models.Media || mongoose.model('Media', MediaSchema));