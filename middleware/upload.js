import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'tour_app',
    resource_type: 'image',
    format: 'jpg',
    transformation: [{ width: 1600, crop: 'limit' }]
  })
});

export const upload = multer({ storage });
