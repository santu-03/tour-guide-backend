import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, index: true }, // store hashed refresh token if possible
    expiresAt: { type: Date, required: true, index: true },
    ua: { type: String }, // user agent
    ip: { type: String },
  },
  { timestamps: true }
);

// Optional TTL: uncomment if you want Mongo to auto-delete expired sessions
// sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

sessionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Session = mongoose.model("Session", sessionSchema);
