import createError from "http-errors";
import { z } from "zod";
import { Campaign } from "../models/Campaign.js";

const schema = z.object({
  title: z.string().min(2),
  goalAmount: z.number().positive(),
  raisedAmount: z.number().min(0).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed"]).optional(),
});

export const createCampaign = async (req, res, next) => {
  try {
    const body = schema.parse(req.body);
    const campaign = await Campaign.create({ ...body, owner: req.user._id });
    res.status(201).json({ message: "Campaign created", data: { campaign } });
  } catch (err) { next(err); }
};

export const listCampaigns = async (_req, res, next) => {
  try {
    const campaigns = await Campaign.find().populate("owner", "name email role").sort({ createdAt: -1 });
    res.json({ data: { campaigns } });
  } catch (err) { next(err); }
};

export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("owner", "name");
    if (!campaign) throw createError(404, "Campaign not found");
    res.json({ data: { campaign } });
  } catch (err) { next(err); }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!campaign) throw createError(404, "Campaign not found");
    res.json({ message: "Campaign updated", data: { campaign } });
  } catch (err) { next(err); }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) throw createError(404, "Campaign not found");
    res.json({ message: "Campaign deleted", data: { id: campaign._id } });
  } catch (err) { next(err); }
};
