import Razorpay from 'razorpay';
import crypto from 'crypto';

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async ({ amount, currency = 'INR', receipt }) => {
  // amount in paise
  return await razor.orders.create({ amount, currency, receipt });
};

export const verifySignature = ({ orderId, paymentId, signature }) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
  return expected === signature;
};
