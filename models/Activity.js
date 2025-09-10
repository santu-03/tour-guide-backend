// // models/Activity.js
// import mongoose from 'mongoose';

// const activitySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: String,
//     price: { type: Number, required: true },
//     capacity: { type: Number, required: true },
//     location: {
//       city: String,
//       country: String,
//       lat: Number,
//       lng: Number
//     },
//     images: [String],
//     instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

//     // NEW:
//     featured: { type: Boolean, default: false },

//     rating: { type: Number, default: 0 },
//     ratingCount: { type: Number, default: 0 },
//     isPublished: { type: Boolean, default: true }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Activity', activitySchema);
import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const LocationSchema = new Schema({
  city: String, country: String,
  coords: { type: { type: String, enum:['Point'], default:'Point' }, coordinates:[Number] }
}, { _id:false });

const RatingSchema = new Schema({ avg:{type:Number,default:0}, count:{type:Number,default:0} }, { _id:false });

const ActivitySchema = new Schema({
  title: { type:String, required:true },
  description: String,
  category: String,
  tags: [String],
  price: { type:Number, default:0, min:0 },
  basePrice: { type:Number, default:0, min:0 },
  capacity: { type:Number, default:1, min:1 },
  durationMinutes: Number,
  location: LocationSchema,
  images: [String],
  featured: { type:Boolean, default:false },
  isPublished: { type:Boolean, default:true },
  placeId: { type: Types.ObjectId, ref:'Place' },
  rating: { type: RatingSchema, default: () => ({}) },
}, { timestamps:true });

ActivitySchema.pre('save', function(next){
  if (this.isModified('price')) this.basePrice = this.price;
  if (this.isModified('basePrice')) this.price = this.basePrice;
  next();
});

ActivitySchema.index({ title:'text', description:'text', category:'text', tags:'text', 'location.city':'text' });
ActivitySchema.index({ featured:1, isPublished:1, createdAt:-1 });
ActivitySchema.index({ price:1, basePrice:1 });

ActivitySchema.set('toJSON', { virtuals:true, versionKey:false, transform:(_d,r)=>{ r.id=r._id; delete r._id; }});

export default (mongoose.models.Activity || mongoose.model('Activity', ActivitySchema));
