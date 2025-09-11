import createError from "http-errors";
import { z } from "zod";
import { Booking } from "../models/Booking.js";

const createSchema = z.object({
  placeId: z.string().length(24).optional(),
  activityId: z.string().length(24).optional(),
  date: z.coerce.date(),
  peopleCount: z.number().int().min(1).max(50).optional(),
  notes: z.string().max(500).optional(),
}).refine((d) => d.placeId || d.activityId, { message: "placeId or activityId required" });

export const createBooking = async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const booking = await Booking.create({
      user: req.user._id,
      place: body.placeId,
      activity: body.activityId,
      date: body.date,
      peopleCount: body.peopleCount || 1,
      notes: body.notes || "",
    });
    res.status(201).json({ message: "Booking created", data: { booking } });
  } catch (err) { next(err); }
};

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("place", "name")
      .populate("activity", "title")
      .sort({ createdAt: -1 });
    res.json({ data: { bookings } });
  } catch (err) { next(err); }
};

export const allBookings = async (_req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("place", "name")
      .populate("activity", "title")
      .sort({ createdAt: -1 });
    res.json({ data: { bookings } });
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) }).parse(req.body);
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) throw createError(404, "Booking not found");
    res.json({ message: "Status updated", data: { booking } });
  } catch (err) { next(err); }
};
