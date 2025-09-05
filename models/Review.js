import mongoose from 'mongoose';
import { TARGET_TYPE } from '../config/constants.js';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: Object.values(TARGET_TYPE), required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
