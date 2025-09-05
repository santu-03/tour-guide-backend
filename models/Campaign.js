import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['draft','active','paused','completed'], default: 'draft' },
    budget: { type: Number, default: 0 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', campaignSchema);
