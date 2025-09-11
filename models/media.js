import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, index: true },
    folder: { type: String, default: "tour-guide", index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

mediaSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Media = mongoose.model("Media", mediaSchema);
