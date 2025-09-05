import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';
import { listUsers, updateProfile } from '../controllers/userController.js';

const r = Router();

r.get('/', auth, authorize(ROLES.ADMIN), listUsers);
r.patch('/me', auth, updateProfile);

export default r;
