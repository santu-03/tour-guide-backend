import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, default: 60, min: 15 },
    description: { type: String, default: "" },
    images: [{ type: String }],
    tags: [{ type: String, index: true }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

activitySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Activity = mongoose.model("Activity", activitySchema);
