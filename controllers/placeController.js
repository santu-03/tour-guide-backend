// import httpStatus from 'http-status';
// import Place from '../models/Place.js';
// import { paginate, pick, send } from '../utils/helpers.js';

// export const createPlace = async (req, res) => {
//   const payload = { ...req.body, createdBy: req.user._id };
//   if (req.files?.length) payload.images = req.files.map(f => f.path);
//   const doc = await Place.create(payload);
//   return send(res, httpStatus.CREATED, doc);
// };

// export const listPlaces = async (req, res) => {
//   const { skip, limit, page } = paginate(req.query);
//   const filter = pick(req.query, ['location.city', 'location.country', 'tags']);
//   const items = await Place.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
//   const total = await Place.countDocuments(filter);
//   return send(res, httpStatus.OK, { items, page, total });
// };

// export const getPlace = async (req, res) => {
//   const doc = await Place.findById(req.params.id);
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const updatePlace = async (req, res) => {
//   const updates = pick(req.body, ['name','description','tags','location']);
//   if (req.files?.length) updates.images = req.files.map(f => f.path);
//   const doc = await Place.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, updates, { new: true });
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const deletePlace = async (req, res) => {
//   const ok = await Place.deleteOne({ _id: req.params.id, createdBy: req.user._id });
//   return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
// };
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Place from '../models/Place.js';
import { paginate, pick, send } from '../utils/helpers.js';

export const createPlace = async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  if (req.files?.length) payload.images = req.files.map(f => f.path);
  const doc = await Place.create(payload);
  return send(res, httpStatus.CREATED, doc);
};

export const listPlaces = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = pick(req.query, ['location.city', 'location.country', 'tags']);
  let query = Place.find(filter);

  // Support /api/places?sort=popular
  if ((req.query.sort || '').toLowerCase() === 'popular') {
    query = query.sort({ rating: -1, ratingCount: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const [items, total] = await Promise.all([
    query.skip(skip).limit(limit),
    Place.countDocuments(filter),
  ]);
  return send(res, httpStatus.OK, { items, page, total });
};

export const listPopularPlaces = async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const items = await Place.find({}).sort({ rating: -1, ratingCount: -1 }).limit(limit);
  return send(res, httpStatus.OK, { items, total: items.length, page: 1 });
};

export const getPlace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid place id' });

  const doc = await Place.findById(id);
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid place id' });

  const updates = pick(req.body, ['name','description','tags','location']);
  if (req.files?.length) updates.images = req.files.map(f => f.path);
  const doc = await Place.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updates, { new: true });
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const deletePlace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid place id' });

  const ok = await Place.deleteOne({ _id: id, createdBy: req.user._id });
  return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
};
