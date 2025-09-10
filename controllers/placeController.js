// import httpStatus from 'http-status';
// import mongoose from 'mongoose';
// import Place from '../models/Place.js';
// import { paginate, pick, send } from '../utils/helpers.js';

// /**
//  * Create Place
//  * Accepts either:
//  *  - body.images: array of Cloudinary URLs (recommended via /api/media)
//  *  - uploaded files via multer (req.files) -> uses f.path fallback if configured
//  */
// export const createPlace = async (req, res) => {
//   const payload = { ...req.body, createdBy: req.user._id };

//   // Normalize images from body (URLs) and/or uploaded files
//   const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];
//   const uploaded = Array.isArray(req.files) && req.files.length
//     ? req.files.map(f => f.path || f.location || f.url).filter(Boolean)
//     : [];
//   payload.images = [...new Set([...(bodyImages || []), ...(uploaded || [])])];

//   // Ensure boolean for featured if passed as string
//   if (typeof payload.featured === 'string') {
//     payload.featured = payload.featured === 'true';
//   }

//   const doc = await Place.create(payload);
//   return send(res, httpStatus.CREATED, doc);
// };

// /**
//  * List Places
//  * - supports q (text), tags, location.city/country filters
//  * - supports ?featured=true (returns array, limited)
//  * - supports ?limit, ?page via paginate()
//  * - supports sort=popular
//  */
// export const listPlaces = async (req, res) => {
//   const { skip, limit, page } = paginate(req.query);
//   const filter = pick(req.query, ['location.city', 'location.country', 'tags']);

//   // Text search
//   if (req.query.q) {
//     filter.$or = [
//       { name: new RegExp(req.query.q, 'i') },
//       { description: new RegExp(req.query.q, 'i') },
//       { 'location.city': new RegExp(req.query.q, 'i') },
//     ];
//   }

//   // Featured branch: simple, fast list for Home
//   if ((req.query.featured || '').toString() === 'true') {
//     const cap = Number(req.query.limit || 6);
//     const items = await Place.find({ ...filter, featured: true })
//       .sort({ rating: -1, ratingCount: -1, createdAt: -1 })
//       .limit(cap);

//     // Return array directly so Home can read data.data as []
//     return send(res, httpStatus.OK, items);
//   }

//   // Normal paginated response
//   let query = Place.find(filter);

//   if ((req.query.sort || '').toLowerCase() === 'popular') {
//     query = query.sort({ rating: -1, ratingCount: -1, createdAt: -1 });
//   } else {
//     query = query.sort({ createdAt: -1 });
//   }

//   const [items, total] = await Promise.all([
//     query.skip(skip).limit(limit),
//     Place.countDocuments(filter),
//   ]);

//   return send(res, httpStatus.OK, { items, page, total });
// };

// export const getPlace = async (req, res) => {
//   const doc = await Place.findById(req.params.id);
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const updatePlace = async (req, res) => {
//   const updates = pick(req.body, ['name', 'description', 'tags', 'location', 'featured']);

//   // Merge images from body + uploads (if present)
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

//   const doc = await Place.findOneAndUpdate(
//     { _id: req.params.id, createdBy: req.user._id },
//     updates,
//     { new: true }
//   );
//   if (!doc) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
//   return send(res, httpStatus.OK, doc);
// };

// export const deletePlace = async (req, res) => {
//   const ok = await Place.deleteOne({ _id: req.params.id, createdBy: req.user._id });
//   return send(res, httpStatus.OK, { deleted: ok.deletedCount === 1 });
// };



import httpStatus from 'http-status';
import Place from '../models/Place.js';

const b = (v) => v === true || v === 'true' || v === 1 || v === '1';

export async function listPlaces(req,res,next){
  try{
    const { q, city, category, featured, approved, limit=20, page=1, sort='-createdAt' } = req.query;
    const filter = {};
    if (featured!=null) filter.featured = b(featured);
    if (approved!=null) filter.approved = b(approved);
    if (category) filter.category = { $regex:String(category), $options:'i' };
    if (city) filter.$or = [{ 'location.city':{ $regex:String(city), $options:'i' } }, { location:{ $regex:String(city), $options:'i' } }];
    if (q){
      const rx = { $regex:String(q), $options:'i' };
      filter.$or = [...(filter.$or||[]), { title:rx }, { name:rx }, { description:rx }, { tags:rx }, { 'location.city':rx }, { location:rx }];
    }
    let sortBy = sort;
    if (sort==='relevance') sortBy='-rating.avg -createdAt';
    if (sort==='rating') sortBy='-rating.avg';
    if (sort==='name') sortBy='title name';

    const lim = Math.min(Math.max(parseInt(limit)||20,1),100);
    const pg = Math.max(parseInt(page)||1,1);
    const skip = (pg-1)*lim;

    const [items,total] = await Promise.all([
      Place.find(filter).sort(sortBy).skip(skip).limit(lim).lean(),
      Place.countDocuments(filter),
    ]);
    res.json({ data:items, meta:{ total, page:pg, limit:lim, pages:Math.max(1,Math.ceil(total/lim)) }});
  }catch(err){ next(err); }
}

export async function getPlace(req,res,next){
  try{
    const doc = await Place.findById(req.params.id).lean();
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Place not found' });
    res.json({ data:doc });
  }catch(err){ next(err); }
}

export async function createPlace(req,res,next){
  try{
    const { title, name, description, category, tags, location, images, featured, approved, rating } = req.body;
    const loc = typeof location==='string' ? { city: location } : location;
    const doc = await Place.create({
      title: title || name, name: name || title, description, category,
      tags: Array.isArray(tags) ? tags : String(tags||'').split(',').map(t=>t.trim()).filter(Boolean),
      location: loc, images: Array.isArray(images)?images:(images?[images]:[]),
      featured: !!featured, approved: approved==null?true:!!approved,
      rating: rating || { avg:4.6, count:0 },
    });
    res.status(httpStatus.CREATED).json({ data:doc });
  }catch(err){ next(err); }
}

export async function updatePlace(req,res,next){
  try{
    const p = { ...req.body };
    if (p.tags && !Array.isArray(p.tags)) p.tags = String(p.tags).split(',').map(t=>t.trim()).filter(Boolean);
    if (typeof p.location==='string') p.location = { city:p.location };
    if (p.images && !Array.isArray(p.images)) p.images = [p.images];
    const doc = await Place.findByIdAndUpdate(req.params.id, p, { new:true, runValidators:true });
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Place not found' });
    res.json({ data:doc });
  }catch(err){ next(err); }
}

export async function deletePlace(req,res,next){
  try{
    const doc = await Place.findByIdAndDelete(req.params.id);
    if(!doc) return res.status(httpStatus.NOT_FOUND).json({ message:'Place not found' });
    res.json({ data:{ ok:true }});
  }catch(err){ next(err); }
}
