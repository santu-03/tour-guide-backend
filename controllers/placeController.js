import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Place from '../models/Place.js';
import { paginate, pick, send } from '../utils/helpers.js';

/**
 * Create Place
 * Accepts either:
 *  - body.images: array of Cloudinary URLs (recommended via /api/media)
 *  - uploaded files via multer (req.files) -> uses f.path fallback if configured
 */
export const createPlace = async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };

  // Normalize images from body (URLs) and/or uploaded files
  const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
  const uploaded = Array.isArray(req.files) && req.files.length
    ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
    : [];
  payload.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];

  // Ensure boolean for featured if passed as string
  if (typeof payload.featured === 'string') {
    payload.featured = payload.featured === 'true';
  }

  const doc = await Place.create(payload);
  return send(res, httpStatus.CREATED, doc);
};

/**
 * List Places
 * - supports q (text), tags, location.city/country filters
 * - supports ?featured=true (returns array, limited)
 * - supports ?limit, ?page via paginate()
 * - supports sort=popular
 */
export const listPlaces = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = pick(req.query, ['location.city', 'location.country', 'tags']);

  // Text search
  if (req.query.q) {
    filter.$or = [
      { name: new RegExp(req.query.q, 'i') },
      { description: new RegExp(req.query.q, 'i') },
      { 'location.city': new RegExp(req.query.q, 'i') },
    ];
  }

  // Featured branch: simple, fast list for Home
  if ((req.query.featured || '').toString() === 'true') {
    const cap = Number(req.query.limit || 6);
    const items = await Place.find({ ...filter, featured: true })
      .sort({ rating: -1, ratingCount: -1, createdAt: -1 })
      .limit(cap);

    // Return array directly so Home can read data.data as []
    return send(res, httpStatus.OK, items);
  }

  // Normal paginated response
  let query = Place.find(filter);

  if ((req.query.sort || '').toLowerCase() === 'popular') {
    query = query.sort({ rating: -1, ratingCount: -1, createdAt: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const [items, total] = await Promise.all([
    query.skip(skip).limit(limit),
    Place.countDocuments(filter),
  ]);

  return send(res, httpStatus.OK, { items, page, total });
};

export const getPlace = async (req, res) => {
  const doc = await Place.findById(req.params.id);
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const updatePlace = async (req, res) => {
  const updates = pick(req.body, ['name', 'description', 'tags', 'location', 'featured']);

  // Merge images from body + uploads (if present)
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

  const doc = await Place.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    updates,
    { new: true }
  );
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const deletePlace = async (req, res) => {
  const ok = await Place.deleteOne({ _id: req.params.id, createdBy: req.user._id });
  return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
};




