import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import { Activity } from '../models/Activity.js';
import { Place } from '../models/Place.js';
import { Payment } from '../models/Payment.js';

import dayjs from 'dayjs';

export const overviewStats = async () => {
  const [users, activities, places, bookings, paid] = await Promise.all([
    User.countDocuments(),
    Activity.countDocuments({ isPublished: true }),
    Place.countDocuments(),
    Booking.countDocuments(),
    Payment.countDocuments({ status: 'paid' })
  ]);

  const since30 = dayjs().subtract(30, 'day').toDate();
  const last30RevenueAgg = await Payment.aggregate([
    { $match: { status: 'paid', createdAt: { $gte: since30 } } },
    { $group: { _id: null, sum: { $sum: '$amount' } } }
  ]);
  const last30Revenue = last30RevenueAgg?.[0]?.sum || 0;

  return { users, activities, places, bookings, paidPayments: paid, last30Revenue };
};
