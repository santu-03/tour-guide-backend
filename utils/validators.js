import Joi from 'joi';
import { TARGET_TYPE } from '../config/constants.js';

export const authSchemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('traveller','guide','instructor','advisor','admin').default('traveller')
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required()
  })
};

export const activitySchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().max(5000).required(),
  price: Joi.number().min(0).required(),
  capacity: Joi.number().integer().min(1).required(),
  location: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  }).required(),
  images: Joi.array().items(Joi.string()).default([])
});

export const placeSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(5000).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  location: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  }).required(),
  images: Joi.array().items(Joi.string()).default([])
});

export const bookingSchema = Joi.object({
  targetType: Joi.string().valid(...Object.values(TARGET_TYPE)).required(),
  targetId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  partySize: Joi.number().integer().min(1).default(1),
  price: Joi.object({
    currency: Joi.string().default('INR'),
    total: Joi.number().min(0).required()
  }).required()
});

export const reviewSchema = Joi.object({
  targetType: Joi.string().valid(...Object.values(TARGET_TYPE)).required(),
  targetId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(2000).allow('')
});

export const campaignSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  status: Joi.string().valid('draft','active','paused','completed').default('draft'),
  budget: Joi.number().min(0).default(0),
  startsAt: Joi.date().iso().required(),
  endsAt: Joi.date().iso().min(Joi.ref('startsAt')).required()
});
