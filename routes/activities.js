import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { activitySchema } from '../utils/validators.js';
import { upload } from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';
import { createActivity, listActivities, getActivity, updateActivity, deleteActivity } from '../controllers/activityController.js';

const r = Router();

r.get('/', listActivities);
r.get('/:id', getActivity);

r.post('/', auth, authorize('instructor'), upload.array('images', 6), validate(activitySchema), createActivity);
r.patch('/:id', auth, authorize('instructor'), upload.array('images', 6), updateActivity);
r.delete('/:id', auth, authorize('instructor'), deleteActivity);

export default r;
