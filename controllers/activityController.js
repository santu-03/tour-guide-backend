import createError from "http-errors";
import { z } from "zod";
import { Activity } from "../models/Activity.js";

const baseSchema = z.object({
  title: z.string().min(2),
  place: z.string().length(24),
  price: z.number().nonnegative(),
  durationMinutes: z.number().int().min(15).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const createActivity = async (req, res, next) => {
  try {
    const data = baseSchema.parse(req.body);
    const activity = await Activity.create(data);
    res.status(201).json({ message: "Activity created", data: { activity } });
  } catch (err) { next(err); }
};

export const listActivities = async (req, res, next) => {
  try {
    const { q, place, tag } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: String(q), $options: "i" };
    if (place?.length === 24) filter.place = place;
    if (tag) filter.tags = String(tag);
    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    res.json({ data: { activities } });
  } catch (err) { next(err); }
};

export const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) throw createError(404, "Activity not found");
    res.json({ data: { activity } });
  } catch (err) { next(err); }
};

export const updateActivity = async (req, res, next) => {
  try {
    const data = baseSchema.partial().parse(req.body);
    const activity = await Activity.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!activity) throw createError(404, "Activity not found");
    res.json({ message: "Activity updated", data: { activity } });
  } catch (err) { next(err); }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) throw createError(404, "Activity not found");
    res.json({ message: "Activity deleted", data: { id: activity._id } });
  } catch (err) { next(err); }
};
