// import mongoose from "mongoose";

// const MediaSchema = new mongoose.Schema(
//   {
//     ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
//     url: { type: String, required: true },
//     public_id: { type: String, required: true, unique: true },
//     resource_type: { type: String, enum: ["image", "video", "raw"], default: "image" },
//     format: String,
//     bytes: Number,
//     width: Number,
//     height: Number,
//     folder: String,
//     tags: [String],
//     context: Object,
//     meta: Object
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Media", MediaSchema);


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
    // Removed index: true to avoid duplicate with schema.index() below
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
  tags: [String], // Removed index: true to avoid duplicate
  context: { type: Object, default: {} },
  meta: { type: MetaSchema, default: () => ({}) },
  title: String,
  description: String,
  altText: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for performance (these are the only index definitions)
MediaSchema.index({ 'meta.uploadType': 1, createdAt: -1 });
MediaSchema.index({ ownerId: 1, isActive: 1 });
MediaSchema.index({ public_id: 1 }); // Single index definition for public_id
MediaSchema.index({ tags: 1 }); // Single index definition for tags
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