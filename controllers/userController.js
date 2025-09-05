import httpStatus from 'http-status';
import User from '../models/User.js';
import { paginate, pick, send } from '../utils/helpers.js';

export const listUsers = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = pick(req.query, ['role']);
  const [items, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);
  return send(res, httpStatus.OK, { items, page, total });
};

export const updateProfile = async (req, res) => {
  const updates = pick(req.body, ['name', 'avatarUrl']);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  return send(res, httpStatus.OK, user);
};
