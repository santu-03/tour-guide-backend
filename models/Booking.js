import mongoose from 'mongoose';
import { BOOKING_STATUS, TARGET_TYPE } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, enum: Object.values(TARGET_TYPE), required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    partySize: { type: Number, default: 1 },
    price: {
      currency: { type: String, default: 'INR' },
      total: { type: Number, required: true }
    },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
