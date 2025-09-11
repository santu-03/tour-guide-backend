import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", index: true },     // optional if activity is set
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", index: true }, // optional if place is set
    date: { type: Date, required: true, index: true },
    peopleCount: { type: Number, default: 1, min: 1, max: 50 },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending", index: true },
    notes: { type: String, default: "" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });

bookingSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
