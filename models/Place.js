import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true, index: true },
      // GeoJSON-like [lng, lat]
      coordinates: { type: [Number], index: "2dsphere", default: undefined },
    },
    images: [{ type: String }],
    tags: [{ type: String, index: true }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

placeSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Place = mongoose.model("Place", placeSchema);
