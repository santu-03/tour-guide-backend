import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true, index: true, unique: true },
    valid: { type: Boolean, default: true },
    userAgent: String,
    ip: String
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);
