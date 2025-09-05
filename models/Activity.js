import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    location: {
      city: String,
      country: String,
      lat: Number,
      lng: Number
    },
    images: [String],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
