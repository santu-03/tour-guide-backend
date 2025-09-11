// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary.js';

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: 'tour_app',
//     resource_type: 'image',
//     format: 'jpg',
//     transformation: [{ width: 1600, crop: 'limit' }]
//   })
// });

// export const upload = multer({ storage });



import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { uploadPresets } from '../config/cloudinary.js';
import { fail } from '../utils/helpers.js';
import httpStatus from 'http-status';

// Create storage for different upload types
const createStorage = (uploadType = 'places') => {
  const preset = uploadPresets[uploadType] || uploadPresets.places;
  
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const timestamp = Date.now();
      const fileName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      
      return {
        folder: preset.folder,
        public_id: `${fileName}_${timestamp}`,
        transformation: preset.transformation,
        allowed_formats: preset.allowed_formats,
        resource_type: 'auto'
      };
    }
  });
};

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only images are allowed.`), false);
  }
};

// Memory storage for buffer uploads
const memoryStorage = multer.memoryStorage();

// Multer configurations
const multerConfig = {
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Max 10 files
  },
  fileFilter
};

// Export functions that match your routes pattern
export const uploadSingle = multer(multerConfig).single('file');
export const uploadMany = multer(multerConfig).array('files', 10);

// Keep your existing upload for backward compatibility with places/activities
export const upload = multer({
  storage: createStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Error handling middleware for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return fail(res, httpStatus.BAD_REQUEST, 'File too large. Maximum size is 5MB');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return fail(res, httpStatus.BAD_REQUEST, 'Too many files. Maximum is 10 files');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return fail(res, httpStatus.BAD_REQUEST, 'Unexpected file field');
    }
    return fail(res, httpStatus.BAD_REQUEST, `Upload error: ${err.message}`);
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return fail(res, httpStatus.BAD_REQUEST, err.message);
  }
  
  next(err);
};