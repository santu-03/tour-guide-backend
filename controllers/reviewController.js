import httpStatus from 'http-status';
import Review from '../models/Review.js';
import Activity from '../models/Activity.js';
import Place from '../models/Place.js';
import { paginate, send } from '../utils/helpers.js';

export const addReview = async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });
  // naive rating aggregation
  if (review.targetType === 'activity') {
    const agg = await Review.aggregate([
      { $match: { targetType: 'activity', targetId: review.targetId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    await Activity.findByIdAndUpdate(review.targetId, { rating: agg[0]?.avg || 0, ratingCount: agg[0]?.count || 0 });
  } else if (review.targetType === 'place') {
    const agg = await Review.aggregate([
      { $match: { targetType: 'place', targetId: review.targetId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    await Place.findByIdAndUpdate(review.targetId, { rating: agg[0]?.avg || 0, ratingCount: agg[0]?.count || 0 });
  }
  return send(res, httpStatus.CREATED, review);
};

export const listReviews = async (req, res) => {
  const { skip, limit, page } = paginate(req.query);
  const filter = {};
  if (req.query.targetType) filter.targetType = req.query.targetType;
  if (req.query.targetId) filter.targetId = req.query.targetId;
  const items = await Review.find(filter).populate('user', 'name avatarUrl').skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Review.countDocuments(filter);
  return send(res, httpStatus.OK, { items, page, total });
};



