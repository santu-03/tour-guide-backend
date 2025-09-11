import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ["stripe", "razorpay", "mock"], default: "mock", index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created", index: true },
    providerRef: { type: String, index: true }, // e.g., order_id or payment_id
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

paymentSchema.index({ status: 1, createdAt: -1 });

paymentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
