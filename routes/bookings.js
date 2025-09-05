import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { bookingSchema } from '../utils/validators.js';
import { createBooking, myBookings, updateStatus } from '../controllers/bookingController.js';

const r = Router();

r.get('/me', auth, myBookings);
r.post('/', auth, validate(bookingSchema), createBooking);
r.patch('/:id/status', auth, updateStatus);

export default r;
