



import createError from "http-errors";
import { z } from "zod";
import { Place } from "../models/Place.js";
import { Activity } from "../models/Activity.js";

const schema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(2000).optional(),
  location: z.object({
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const createPlace = async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const place = await Place.create(data);
    res.status(201).json({ message: "Place created", data: { place } });
  } catch (err) { next(err); }
};

export const listPlaces = async (req, res, next) => {
  try {
    const { 
      q, country, tag, 
      page = 1, limit = 20,
      sortBy = 'createdAt', sortOrder = 'desc'
    } = req.query;
    
    const filter = { isActive: true };
    
    if (q) {
      filter.$or = [
        { name: { $regex: String(q), $options: "i" } },
        { description: { $regex: String(q), $options: "i" } }
      ];
    }
    if (country) filter["country"] = { $regex: String(country), $options: "i" };
    if (tag) filter.tags = String(tag);
    
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [places, total] = await Promise.all([
      Place.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Place.countDocuments(filter)
    ]);
    
    res.json({ 
      data: { 
        places,
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

export const getPlace = async (req, res, next) => {
  try {
    const [place, activities] = await Promise.all([
      Place.findById(req.params.id),
      Activity.find({ place: req.params.id, isActive: true })
        .select('title price durationMinutes images tags')
    ]);
    
    if (!place) throw createError(404, "Place not found");
    
    res.json({ 
      data: { 
        place: {
          ...place.toJSON(),
          activities,
          activityCount: activities.length
        }
      } 
    });
  } catch (err) { next(err); }
};

export const updatePlace = async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const place = await Place.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!place) throw createError(404, "Place not found");
    
    res.json({ message: "Place updated", data: { place } });
  } catch (err) { next(err); }
};

export const deletePlace = async (req, res, next) => {
  try {
    // Check if place has activities
    const activityCount = await Activity.countDocuments({ place: req.params.id });
    if (activityCount > 0) {
      throw createError(400, "Cannot delete place with existing activities");
    }
    
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) throw createError(404, "Place not found");
    
    res.json({ message: "Place deleted", data: { id: place._id } });
  } catch (err) { next(err); }
};