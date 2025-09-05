import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { placeSchema } from '../utils/validators.js';
import { upload } from '../middleware/upload.js';
import { createPlace, listPlaces, getPlace, updatePlace, deletePlace } from '../controllers/placeController.js';

const r = Router();

r.get('/', listPlaces);
r.get('/:id', getPlace);
r.post('/', auth, upload.array('images', 6), validate(placeSchema), createPlace);
r.patch('/:id', auth, upload.array('images', 6), updatePlace);
r.delete('/:id', auth, deletePlace);

export default r;
