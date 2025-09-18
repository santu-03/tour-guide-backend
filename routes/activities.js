// routes/activities.js
import { Router } from 'express';
import {
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';

const router = Router();

router.get('/', listActivities);
router.get('/:id', getActivity);
router.post('/', createActivity);
router.patch('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
