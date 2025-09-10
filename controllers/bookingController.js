import httpStatus from 'http-status';
import Booking from '../models/Booking.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { paginate, send } from '../utils/helpers.js';

export const createBooking = async (req, res) => {
  const doc = await Booking.create({ ...req.body, user: req.user._id });
  return send(res, httpStatus.CREATED, doc);
};

export const myBookings = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const items = await Booking.find({ user: req.user._id })
    .populate('payment')
    .skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Booking.countDocuments({ user: req.user._id });
  return send(res, httpStatus.OK, { items, page, total });
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!Object.values(BOOKING_STATUS).includes(status))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid status' });
  const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, updated);
};




