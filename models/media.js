import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    url: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
    resource_type: { type: String, enum: ["image", "video", "raw"], default: "image" },
    format: String,
    bytes: Number,
    width: Number,
    height: Number,
    folder: String,
    tags: [String],
    context: Object,
    meta: Object
  },
  { timestamps: true }
);

export default mongoose.model("Media", MediaSchema);
