// import httpStatus from 'http-status';
// import mongoose from 'mongoose';
// import Activity from '../models/Activity.js';
// import { paginate, pick, send } from '../utils/helpers.js';

// /**
//  * Create Activity
//  * Accepts body.images (Cloudinary URLs) and/or uploaded files (req.files)
//  */
// export const createActivity = async (req, res) => {
//   const payload = { ...req.body, instructor: req.user._id };

//   const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
//   const uploaded = Array.isArray(req.files) && req.files.length
//     ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
//     : [];
//   payload.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];

//   if (typeof payload.featured === 'string') {
//     payload.featured = payload.featured === 'true';
//   }

//   const doc = await Activity.create(payload);
//   return send(res, httpStatus.CREATED, doc);
// };

// /**
//  * List Activities
//  * - supports q, category, instructor, isPublished
//  * - supports ?placeId=..., ?featured=true
//  */
// export const listActivities = async (req, res) => {
//   const { skip, limit, page } = paginate(req.query);
//   const filter = pick(req.query, ['instructor', 'isPublished', 'location.city', 'location.country', 'category']);

//   if (req.query.placeId && mongoose.isValidObjectId(req.query.placeId)) {
//     filter.place = req.query.placeId;
//   }

//   if (req.query.q) {
//     filter.$or = [
//       { title: new RegExp(req.query.q, 'i') },
//       { description: new RegExp(req.query.q, 'i') },
//       { category: new RegExp(req.query.q, 'i') },
//     ];
//   }

//   if ((req.query.featured || '').toString() === 'true') {
//     const cap = Number(req.query.limit || 8);
//     const items = await Activity.find({ ...filter, featured: true, isPublished: true })
//       .sort({ rating: -1, ratingCount: -1, createdAt: -1 })
//       .limit(cap);

//     // Return array directly for Home
//     return send(res, httpStatus.OK, items);
//   }

//   const items = await Activity.find(filter)
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 });

//   const total = await Activity.countDocuments(filter);
//   return send(res, httpStatus.OK, { items, page, total });
// };

// export const getActivity = async (req, res) => {
//   const doc = await Activity.findById(req.params.id);
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const updateActivity = async (req, res) => {
//   const updates = pick(req.body, ['title', 'description', 'price', 'capacity', 'location', 'category', 'isPublished', 'featured']);

//   const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
//   const uploaded = Array.isArray(req.files) && req.files.length
//     ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
//     : [];
//   if (bodyImages.length || uploaded.length) {
//     updates.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];
//   }

//   if (typeof updates.featured === 'string') {
//     updates.featured = updates.featured === 'true';
//   }

//   const doc = await Activity.findOneAndUpdate(
//     { _id: req.params.id, instructor: req.user._id },
//     updates,
//     { new: true }
//   );
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const deleteActivity = async (req, res) => {
//   const ok = await Activity.deleteOne({ _id: req.params.id, instructor: req.user._id });
//   return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
// };


import httpStatus from 'http-status';
import Activity from '../models/Activity.js';

const b = (v) => v === true || v === 'true' || v === 1 || v === '1';

export async function listActivities(req,res,next){
  try{
    const { q, city, category, featured, isPublished, minPrice, maxPrice, limit=20, page=1, sort='-createdAt' } = req.query;
    const filter = {};
    if (featured!=null) filter.featured = b(featured);
    if (isPublished!=null) filter.isPublished = b(isPublished);
    if (category) filter.category = { $regex:String(category), $options:'i' };
    if (city) filter.$or = [{ 'location.city':{ $regex:String(city), $options:'i' } }, { location:{ $regex:String(city), $options:'i' } }];
    if (q){
      const rx = { $regex:String(q), $options:'i' };
      filter.$or = [...(filter.$or||[]), { title:rx }, { description:rx }, { category:rx }, { tags:rx }, { 'location.city':rx }, { location:rx }];
    }
    if (minPrice!=null || maxPrice!=null){
      const min = minPrice!=null?Number(minPrice):0;
      const max = maxPrice!=null?Number(maxPrice):Number.MAX_SAFE_INTEGER;
      filter.$and = [...(filter.$and||[]), { $or: [{ price:{ $gte:min, $lte:max } }, { basePrice:{ $gte:min, $lte:max } }] }];
    }
    let sortBy = sort;
    if (sort==='relevance') sortBy='-rating.avg -createdAt';
    if (sort==='rating') sortBy='-rating.avg';
    if (sort==='price_asc') sortBy='price basePrice';
    if (sort==='price_desc') sortBy='-price -basePrice';

    const lim = Math.min(Math.max(parseInt(limit)||20,1),100);
    const pg = Math.max(parseInt(page)||1,1);
    const skip = (pg-1)*lim;

    const [items,total] = await Promise.all([
      Activity.find(filter).sort(sortBy).skip(skip).limit(lim).lean(),
      Activity.countDocuments(filter),
    ]);
    res.json({ data:items, meta:{ total, page:pg, limit:lim, pages:Math.max(1,Math.ceil(total/lim)) }});
  }catch(err){ next(err); }
}

export async function getActivity(req,res,next){
  try{
    const doc = await Activity.findById(req.params.id).lean();
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Activity not found' });
    res.json({ data:doc });
  }catch(err){ next(err); }
}

export async function createActivity(req,res,next){
  try{
    const { title, description, category, tags, price, basePrice, capacity, durationMinutes, location, images, featured, isPublished, placeId, rating } = req.body;
    const n = Number(price ?? basePrice ?? 0) || 0;
    const loc = typeof location==='string' ? { city:location } : location;
    const doc = await Activity.create({
      title, description, category,
      tags: Array.isArray(tags)?tags:String(tags||'').split(',').map(t=>t.trim()).filter(Boolean),
      price:n, basePrice:n, capacity:Number(capacity)||1, durationMinutes: durationMinutes?Number(durationMinutes):undefined,
      location: loc, images: Array.isArray(images)?images:(images?[images]:[]),
      featured: !!featured, isPublished: isPublished==null?true:!!isPublished,
      placeId: placeId || undefined, rating: rating || { avg:4.6, count:0 },
    });
    res.status(httpStatus.CREATED).json({ data:doc });
  }catch(err){ next(err); }
}

export async function updateActivity(req,res,next){
  try{
    const p = { ...req.body };
    if (p.tags && !Array.isArray(p.tags)) p.tags = String(p.tags).split(',').map(t=>t.trim()).filter(Boolean);
    if (typeof p.location==='string') p.location = { city:p.location };
    if (p.images && !Array.isArray(p.images)) p.images = [p.images];
    if (p.price!=null || p.basePrice!=null){ const n = Number(p.price ?? p.basePrice)||0; p.price=n; p.basePrice=n; }
    const doc = await Activity.findByIdAndUpdate(req.params.id, p, { new:true, runValidators:true });
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Activity not found' });
    res.json({ data:doc });
  }catch(err){ next(err); }
}

export async function deleteActivity(req,res,next){
  try{
    const doc = await Activity.findByIdAndDelete(req.params.id);
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Activity not found' });
    res.json({ data:{ ok:true }});
  }catch(err){ next(err); }
}
