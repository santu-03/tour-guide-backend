import createError from "http-errors";
import { z } from "zod";
import { Review } from "../models/Review.js";

const schema = z.object({
  placeId: z.string().length(24).optional(),
  activityId: z.string().length(24).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
}).refine((d) => d.placeId || d.activityId, { message: "placeId or activityId required" });

export const createReview = async (req, res, next) => {
  try {
    const body = schema.parse(req.body);
    const review = await Review.create({
      user: req.user._id,
      place: body.placeId,
      activity: body.activityId,
      rating: body.rating,
      comment: body.comment || "",
    });
    res.status(201).json({ message: "Review created", data: { review } });
  } catch (err) { next(err); }
};

export const listReviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.placeId?.length === 24) filter.place = req.query.placeId;
    if (req.query.activityId?.length === 24) filter.activity = req.query.activityId;
    const reviews = await Review.find(filter).populate("user", "name").sort({ createdAt: -1 });
    res.json({ data: { reviews } });
  } catch (err) { next(err); }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw createError(404, "Review not found");
    // allow owner or admin
    const isOwner = review.user?.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) throw createError(403, "Forbidden");
    await review.deleteOne();
    res.json({ message: "Review deleted", data: { id: req.params.id } });
  } catch (err) { next(err); }
};
