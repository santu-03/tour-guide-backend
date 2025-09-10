import httpStatus from 'http-status';
import Campaign from '../models/Campaign.js';
import { paginate, pick, send } from '../utils/helpers.js';

export const createCampaign = async (req, res) => {
  const doc = await Campaign.create({ ...req.body, owner: req.user._id });
  return send(res, httpStatus.CREATED, doc);
};

export const listCampaigns = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = { owner: req.user._id, ...pick(req.query, ['status']) };
  const items = await Campaign.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Campaign.countDocuments(filter);
  return send(res, httpStatus.OK, { items, page, total });
};

export const updateCampaign = async (req, res) => {
  const updates = pick(req.body, ['name','status','budget','startsAt','endsAt']);
  const doc = await Campaign.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, updates, { new: true });
  if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
  return send(res, httpStatus.OK, doc);
};



