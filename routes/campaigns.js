import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { campaignSchema } from '../utils/validators.js';
import { createCampaign, listCampaigns, updateCampaign } from '../controllers/campaignController.js';

const r = Router();

r.get('/', auth, authorize('advisor'), listCampaigns);
r.post('/', auth, authorize('advisor'), validate(campaignSchema), createCampaign);
r.patch('/:id', auth, authorize('advisor'), updateCampaign);

export default r;
