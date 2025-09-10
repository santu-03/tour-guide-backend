// // import httpStatus from 'http-status';
// // import Payment from '../models/Payment.js';
// // import Booking from '../models/Booking.js';
// // import { createOrder, verifySignature } from '../services/paymentService.js';
// // import { PAYMENT_STATUS } from '../config/constants.js';
// // import { send } from '../utils/helpers.js';

// // export const createRazorpayOrder = async (req, res) => {
// //   const { bookingId } = req.body;
// //   const booking = await Booking.findById(bookingId);
// //   if (!booking) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Booking not found' });

// //   const amountPaise = Math.round((booking.price.total || 0) * 100);
// //   const order = await createOrder({ amount: amountPaise, receipt: bookingId });

// //   const payment = await Payment.create({
// //     provider: 'razorpay',
// //     status: PAYMENT_STATUS.CREATED,
// //     currency: order.currency,
// //     amount: order.amount,
// //     orderId: order.id,
// //     booking: booking._id
// //   });
// //   booking.payment = payment._id;
// //   await booking.save();

// //   return send(res, httpStatus.CREATED, { order, paymentId: payment._id });
// // };

// // export const verifyRazorpay = async (req, res) => {
// //   const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
// //   const payment = await Payment.findOne({ orderId: order_id });
// //   if (!payment) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Payment not found' });

// //   const ok = verifySignature({ orderId: order_id, paymentId: razorpay_payment_id, signature: razorpay_signature });
// //   if (!ok) {
// //     payment.status = PAYMENT_STATUS.FAILED;
// //     payment.paymentId = razorpay_payment_id;
// //     payment.signature = razorpay_signature;
// //     await payment.save();
// //     return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Signature verification failed' });
// //   }

// //   payment.status = PAYMENT_STATUS.PAID;
// //   payment.paymentId = razorpay_payment_id;
// //   payment.signature = razorpay_signature;
// //   await payment.save();

// //   await Booking.updateOne({ _id: payment.booking }, { $set: { status: 'confirmed' } });

// //   return send(res, httpStatus.OK, { verified: true });
// // };


