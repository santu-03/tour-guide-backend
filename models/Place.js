// // models/Place.js
// import mongoose from 'mongoose';

// const placeSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     description: String,
//     tags: [String],
//     location: {
//       city: String,
//       country: String,
//       lat: Number,
//       lng: Number
//     },
//     images: [String],
//     // NEW:
//     featured: { type: Boolean, default: false },

//     rating: { type: Number, default: 0 },
//     ratingCount: { type: Number, default: 0 },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Place', placeSchema);


import mongoose from "mongoose";
const { Schema } = mongoose;

const LocationSchema = new Schema({
  city: String,
  country: String,
  coords: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] } // [lng,lat]
}, { _id:false });

const RatingSchema = new Schema({ avg: {type:Number, default:0}, count: {type:Number, default:0} }, { _id:false });

const PlaceSchema = new Schema({
  title: String,
  name: String,
  description: String,
  category: String,
  tags: [String],
  location: LocationSchema,
  images: [String],
  featured: { type:Boolean, default:false },
  approved: { type:Boolean, default:true },
  rating: { type: RatingSchema, default: () => ({}) },
}, { timestamps:true });

PlaceSchema.index({ title:'text', name:'text', description:'text', category:'text', tags:'text', 'location.city':'text' });
PlaceSchema.index({ featured:1, createdAt:-1 });
PlaceSchema.index({ 'location.city':1 });

PlaceSchema.set('toJSON', { virtuals:true, versionKey:false, transform:(_d,r)=>{ r.id=r._id; delete r._id; }});

export default (mongoose.models.Place || mongoose.model('Place', PlaceSchema));
