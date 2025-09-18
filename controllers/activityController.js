import createError from "http-errors";
import { z } from "zod";
import { Activity } from "../models/Activity.js";
import { Place } from "../models/Place.js";

const baseSchema = z.object({
  title: z.string().min(2).max(100),
  place: z.string().length(24),
  price: z.number().nonnegative().max(50000),
  durationMinutes: z.number().int().min(15).max(1440).optional(),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const createActivity = async (req, res, next) => {
  try {
    const data = baseSchema.parse(req.body);
    
    // Verify place exists
    const placeExists = await Place.findById(data.place);
    if (!placeExists) {
      throw createError(400, "Referenced place does not exist");
    }
    
    const activity = await Activity.create(data);
    
    // Return with populated place
    const populatedActivity = await Activity.findById(activity._id)
      .populate('place', 'name location');
    
    res.status(201).json({ 
      message: "Activity created", 
      data: { activity: populatedActivity } 
    });
  } catch (err) { next(err); }
};

export const listActivities = async (req, res, next) => {
  try {
    const { 
      q, place, tag, 
      page = 1, limit = 20,
      sortBy = 'createdAt', sortOrder = 'desc'
    } = req.query;
    
    const filter = { isActive: true };
    
    if (q) {
      filter.$or = [
        { title: { $regex: String(q), $options: "i" } },
        { description: { $regex: String(q), $options: "i" } }
      ];
    }
    if (place?.length === 24) filter.place = place;
    if (tag) filter.tags = String(tag);
    
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate('place', 'name location images')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Activity.countDocuments(filter)
    ]);
    
    res.json({ 
      data: { 
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      } 
    });
  } catch (err) { next(err); }
};

export const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('place', 'name description location images tags');
      
    if (!activity) throw createError(404, "Activity not found");
    
    res.json({ data: { activity } });
  } catch (err) { next(err); }
};

export const updateActivity = async (req, res, next) => {
  try {
    const data = baseSchema.partial().parse(req.body);
    
    // If updating place, verify it exists
    if (data.place) {
      const placeExists = await Place.findById(data.place);
      if (!placeExists) {
        throw createError(400, "Referenced place does not exist");
      }
    }
    
    const activity = await Activity.findByIdAndUpdate(
      req.params.id, 
      data, 
      { new: true }
    ).populate('place', 'name location');
    
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