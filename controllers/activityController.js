import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import { paginate, pick, send } from '../utils/helpers.js';

/**
 * Create Activity
 * Accepts body.images (Cloudinary URLs) and/or uploaded files (req.files)
 */
export const createActivity = async (req, res) => {
  const payload = { ...req.body, instructor: req.user._id };

  const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
  const uploaded = Array.isArray(req.files) && req.files.length
    ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
    : [];
  payload.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];

  if (typeof payload.featured === 'string') {
    payload.featured = payload.featured === 'true';
  }

  const doc = await Activity.create(payload);
  return send(res, httpStatus.CREATED, doc);
};

/**
 * List Activities
 * - supports q, category, instructor, isPublished
 * - supports ?placeId=..., ?featured=true
 */
export const listActivities = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = pick(req.query, ['instructor', 'isPublished', 'location.city', 'location.country', 'category']);

  if (req.query.placeId && mongoose.isValidObjectId(req.query.placeId)) {
    filter.place = req.query.placeId;
  }

  if (req.query.q) {
    filter.$or = [
      { title: new RegExp(req.query.q, 'i') },
      { description: new RegExp(req.query.q, 'i') },
      { category: new RegExp(req.query.q, 'i') },
    ];
  }

  if ((req.query.featured || '').toString() === 'true') {
    const cap = Number(req.query.limit || 8);
    const items = await Activity.find({ ...filter, featured: true, isPublished: true })
      .sort({ rating: -1, ratingCount: -1, createdAt: -1 })
      .limit(cap);

    // Return array directly for Home
    return send(res, httpStatus.OK, items);
  }

  const items = await Activity.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Activity.countDocuments(filter);
  return send(res, httpStatus.OK, { items, page, total });
};

export const getActivity = async (req, res) => {
  const doc = await Activity.findById(req.params.id);
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const updateActivity = async (req, res) => {
  const updates = pick(req.body, ['title', 'description', 'price', 'capacity', 'location', 'category', 'isPublished', 'featured']);

  const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
  const uploaded = Array.isArray(req.files) && req.files.length
    ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
    : [];
  if (bodyImages.length || uploaded.length) {
    updates.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];
  }

  if (typeof updates.featured === 'string') {
    updates.featured = updates.featured === 'true';
  }

  const doc = await Activity.findOneAndUpdate(
    { _id: req.params.id, instructor: req.user._id },
    updates,
    { new: true }
  );
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const deleteActivity = async (req, res) => {
  const ok = await Activity.deleteOne({ _id: req.params.id, instructor: req.user._id });
  return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
};


