// import httpStatus from 'http-status';
// import Activity from '../models/Activity.js';
// import { paginate, pick, send } from '../utils/helpers.js';

// export const createActivity = async (req, res) => {
//   const payload = { ...req.body, instructor: req.user._id };
//   if (req.files?.length) payload.images = req.files.map(f => f.path);
//   const doc = await Activity.create(payload);
//   return send(res, httpStatus.CREATED, doc);
// };

// export const listActivities = async (req, res) => {
//   const { skip, limit, page } = paginate(req.query);
//   const filter = pick(req.query, ['instructor', 'isPublished', 'location.city', 'location.country']);
//   const items = await Activity.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
//   const total = await Activity.countDocuments(filter);
//   return send(res, httpStatus.OK, { items, page, total });
// };

// export const getActivity = async (req, res) => {
//   const doc = await Activity.findById(req.params.id);
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const updateActivity = async (req, res) => {
//   const updates = pick(req.body, ['title','description','price','capacity','location','isPublished']);
//   if (req.files?.length) updates.images = req.files.map(f => f.path);
//   const doc = await Activity.findOneAndUpdate({ _id: req.params.id, instructor: req.user._id }, updates, { new: true });
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const deleteActivity = async (req, res) => {
//   const ok = await Activity.deleteOne({ _id: req.params.id, instructor: req.user._id });
//   return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
// };
 




import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import { paginate, pick, send } from '../utils/helpers.js';

export const createActivity = async (req, res) => {
  const payload = { ...req.body, instructor: req.user._id };
  if (req.files?.length) payload.images = req.files.map(f => f.path);
  const doc = await Activity.create(payload);
  return send(res, httpStatus.CREATED, doc);
};

export const listActivities = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = pick(req.query, ['instructor', 'isPublished', 'location.city', 'location.country']);
  const items = await Activity.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Activity.countDocuments(filter);
  return send(res, httpStatus.OK, { items, page, total });
};

export const getActivity = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid activity id' });

  const doc = await Activity.findById(id);
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const updateActivity = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid activity id' });

  const updates = pick(req.body, ['title','description','price','capacity','location','isPublished']);
  if (req.files?.length) updates.images = req.files.map(f => f.path);
  const doc = await Activity.findOneAndUpdate({ _id: id, instructor: req.user._id }, updates, { new: true });
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};

export const deleteActivity = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid activity id' });

  const ok = await Activity.deleteOne({ _id: id, instructor: req.user._id });
  return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
};
