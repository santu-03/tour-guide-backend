import { User } from "../models/User.js";
import { Place } from "../models/Place.js";
import { Activity } from "../models/Activity.js";
import { Booking } from "../models/Booking.js";
import { Review } from "../models/Review.js";
import { Payment } from "../models/Payment.js";

export const summary = async (_req, res, next) => {
  try {
    const [users, places, activities, bookings, reviews, paidCount, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Place.countDocuments(),
      Activity.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Payment.countDocuments({ status: "paid" }),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg?.[0]?.total || 0;

    res.json({
      data: { users, places, activities, bookings, reviews, paidPayments: paidCount, totalRevenue },
    });
  } catch (err) { next(err); }
};
