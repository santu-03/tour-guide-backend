import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';
import { overview } from '../controllers/dashboardController.js';

const r = Router();
r.get('/overview', auth, authorize(ROLES.ADMIN), overview);

export default r;
