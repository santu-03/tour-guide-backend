import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["draft", "active", "completed"], default: "draft", index: true },
  },
  { timestamps: true }
);

campaignSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Campaign = mongoose.model("Campaign", campaignSchema);
