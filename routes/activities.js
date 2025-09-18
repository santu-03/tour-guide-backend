// routes/activities.js
import { Router } from 'express';
import {
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateObjectIdParam } from '../middleware/objectIdParam.js';

const router = Router();

router.get('/', listActivities);
router.get('/:id', getActivity);
router.get('/:id', validateObjectIdParam('id'), getActivity);
router.post('/', requireAuth, requireRole('admin'), createActivity);
router.patch('/:id', requireAuth, requireRole('admin'), validateObjectIdParam('id'), updateActivity);
router.delete('/:id', requireAuth, requireRole('admin'), validateObjectIdParam('id'), deleteActivity);


export default router;
