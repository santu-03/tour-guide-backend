import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.TRAVELLER },
    avatarUrl: { type: String },
    verified: { type: Boolean, default: false },
    wallet: {
      points: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compare = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
