import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { authSchemas } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { auth, requireSession } from '../middleware/auth.js';
import { login, signup, refresh, logout, me } from '../controllers/authController.js';

const r = Router();

r.post('/signup', authLimiter, validate(authSchemas.signup), signup);
r.post('/login', authLimiter, validate(authSchemas.login), login);
r.post('/refresh', validate(authSchemas.refresh), refresh);
r.post('/logout', requireSession, logout);
r.get('/me', auth, me);

export default r;
