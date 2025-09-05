import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { reviewSchema } from '../utils/validators.js';
import { addReview, listReviews } from '../controllers/reviewController.js';

const r = Router();

r.get('/', listReviews);
r.post('/', auth, validate(reviewSchema), addReview);

export default r;
