// import mongoose from 'mongoose';
// import { PAYMENT_STATUS } from '../config/constants.js';

// const paymentSchema = new mongoose.Schema(
//   {
//     provider: { type: String, default: 'razorpay' },
//     status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.CREATED },
//     currency: { type: String, default: 'INR' },
//     amount: { type: Number, required: true }, // in paise
//     orderId: String,
//     paymentId: String,
//     signature: String,
//     booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
//     meta: {}
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Payment', paymentSchema);
