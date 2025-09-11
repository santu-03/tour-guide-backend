import createError from "http-errors";
import { z } from "zod";
import { Place } from "../models/Place.js";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(), // [lng, lat]
  }).optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
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
    const { q, country, tag } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: String(q), $options: "i" };
    if (country) filter["location.country"] = String(country);
    if (tag) filter.tags = String(tag);
    const places = await Place.find(filter).sort({ createdAt: -1 });
    res.json({ data: { places } });
  } catch (err) { next(err); }
};

export const getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) throw createError(404, "Place not found");
    res.json({ data: { place } });
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
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) throw createError(404, "Place not found");
    res.json({ message: "Place deleted", data: { id: place._id } });
  } catch (err) { next(err); }
};
