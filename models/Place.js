import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    tags: [String],
    location: {
      city: String,
      country: String,
      lat: Number,
      lng: Number
    },
    images: [String],
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Place', placeSchema);
