// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
//   api_key: process.env.CLOUDINARY_API_KEY || '',
//   api_secret: process.env.CLOUDINARY_API_SECRET || '',
//   secure: true,
// });

// export default cloudinary;


import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

// Upload presets for different content types
export const uploadPresets = {
  places: {
    folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/places`,
    transformation: [
      { width: 1600, height: 1200, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  },
  
  activities: {
    folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/activities`,
    transformation: [
      { width: 1400, height: 1000, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  },
  
  profiles: {
    folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/profiles`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    allowed_formats: ['jpg', 'jpeg', 'png']
  },
  
  reviews: {
    folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/reviews`,
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  },
  
  campaigns: {
    folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/campaigns`,
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
};

// Helper function to get responsive image URLs
export const getResponsiveUrls = (publicId, baseTransformation = {}) => {
  const sizes = {
    thumbnail: { width: 300, height: 200, crop: 'fill' },
    small: { width: 600, height: 400, crop: 'limit' },
    medium: { width: 1000, height: 700, crop: 'limit' },
    large: { width: 1600, height: 1200, crop: 'limit' }
  };

  const urls = {};
  Object.entries(sizes).forEach(([size, transformation]) => {
    urls[size] = cloudinary.url(publicId, {
      ...baseTransformation,
      ...transformation,
      quality: 'auto:good',
      fetch_format: 'auto'
    });
  });

  return urls;
};

export default cloudinary;