// import stream from "stream";
// import cloudinary from "../config/cloudinary.js";
// import Media from "../models/Media.js";

// /** Shared helper: upload a buffer via Cloudinary stream */
// export function uploadBuffer(buffer, {
//   folder = process.env.CLOUDINARY_DEFAULT_FOLDER,
//   resource_type = "auto",
//   tags, context
// } = {}) {
//   return new Promise((resolve, reject) => {
//     const pass = new stream.PassThrough();
//     const cld = cloudinary.uploader.upload_stream(
//       { folder, resource_type, tags, context },
//       (err, result) => (err ? reject(err) : resolve(result))
//     );
//     pass.end(buffer);
//     pass.pipe(cld);
//   });
// }

// export const uploadOne = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file" });
//     const r = await uploadBuffer(req.file.buffer, { resource_type: "auto" });
//     const doc = await Media.create({
//       url: r.secure_url, public_id: r.public_id, resource_type: r.resource_type,
//       format: r.format, bytes: r.bytes, width: r.width, height: r.height,
//       folder: r.folder, tags: r.tags, context: r.context,
//       meta: { original_filename: r.original_filename, etag: r.etag, version: r.version }
//     });
//     res.status(201).json(doc);
//   } catch (e) {
//     console.error(e); res.status(500).json({ error: "Upload failed" });
//   }
// };

// export const uploadManyCtrl = async (req, res) => {
//   try {
//     if (!req.files?.length) return res.status(400).json({ error: "No files" });
//     const rows = await Promise.all(req.files.map(async f => {
//       const r = await uploadBuffer(f.buffer, { resource_type: "auto" });
//       return {
//         url: r.secure_url, public_id: r.public_id, resource_type: r.resource_type,
//         format: r.format, bytes: r.bytes, width: r.width, height: r.height,
//         folder: r.folder, tags: r.tags, context: r.context,
//         meta: { original_filename: r.original_filename, etag: r.etag, version: r.version }
//       };
//     }));
//     const docs = await Media.insertMany(rows);
//     res.status(201).json(docs);
//   } catch (e) {
//     console.error(e); res.status(500).json({ error: "Bulk upload failed" });
//   }
// };

// export const listMedia = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, type, q } = req.query;
//     const filter = {};
//     if (type) filter.resource_type = type;
//     if (q) filter.$or = [{ public_id: new RegExp(q, "i") }, { url: new RegExp(q, "i") }];
//     const total = await Media.countDocuments(filter);
//     const items = await Media.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((Number(page) - 1) * Number(limit))
//       .limit(Number(limit));
//     res.json({ total, page: Number(page), limit: Number(limit), items });
//   } catch (e) {
//     console.error(e); res.status(500).json({ error: "Fetch failed" });
//   }
// };

// export const removeMedia = async (req, res) => {
//   try {
//     const doc = await Media.findById(req.params.id);
//     if (!doc) return res.status(404).json({ error: "Not found" });
//     await cloudinary.uploader.destroy(doc.public_id, { resource_type: doc.resource_type || "image" });
//     await doc.deleteOne();
//     res.json({ ok: true });
//   } catch (e) {
//     console.error(e); res.status(500).json({ error: "Delete failed" });
//   }
// };





import stream from "stream";
import httpStatus from 'http-status';
import cloudinary, { getResponsiveUrls } from "../config/cloudinary.js";
import Media from "../models/Media.js";
import { send, fail, ensure, paginate } from '../utils/helpers.js';

/** Shared helper: upload a buffer via Cloudinary stream */
export function uploadBuffer(buffer, options = {}) {
  const {
    folder = process.env.CLOUDINARY_DEFAULT_FOLDER,
    resource_type = "auto",
    tags = [],
    context = {},
    transformation = []
  } = options;

  return new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type, 
        tags, 
        context,
        transformation: transformation.length > 0 ? transformation : undefined,
        quality: 'auto:good',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    pass.end(buffer);
    pass.pipe(uploadStream);
  });
}

export const uploadOne = async (req, res) => {
  try {
    ensure(req.file, httpStatus.BAD_REQUEST, "No file provided");

    const { uploadType = 'places', tags = [], title, description, altText } = req.body;
    
    const uploadOptions = {
      folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/${uploadType}`,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      context: {
        uploadedBy: req.user?.id || 'anonymous',
        uploadType
      }
    };

    const result = await uploadBuffer(req.file.buffer, uploadOptions);
    
    const mediaDoc = await Media.create({
      ownerId: req.user?.id,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder: result.folder,
      tags: result.tags || [],
      context: result.context || {},
      title,
      description,
      altText,
      meta: {
        original_filename: result.original_filename,
        etag: result.etag,
        version: result.version,
        uploadType
      }
    });

    const responseData = mediaDoc.toObject();
    if (result.resource_type === 'image') {
      responseData.responsiveUrls = getResponsiveUrls(result.public_id);
    }

    send(res, httpStatus.CREATED, responseData);

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || "Upload failed");
  }
};

export const uploadManyCtrl = async (req, res) => {
  try {
    ensure(req.files?.length, httpStatus.BAD_REQUEST, "No files provided");

    const { uploadType = 'places', tags = [], title, description } = req.body;
    const parsedTags = Array.isArray(tags) ? tags : (tags ? [tags] : []);

    const uploadPromises = req.files.map(async (file) => {
      const uploadOptions = {
        folder: `${process.env.CLOUDINARY_DEFAULT_FOLDER}/${uploadType}`,
        tags: parsedTags,
        context: {
          uploadedBy: req.user?.id || 'anonymous',
          uploadType
        }
      };

      const result = await uploadBuffer(file.buffer, uploadOptions);
      
      return {
        ownerId: req.user?.id,
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        folder: result.folder,
        tags: result.tags || [],
        context: result.context || {},
        title,
        description,
        meta: {
          original_filename: result.original_filename,
          etag: result.etag,
          version: result.version,
          uploadType
        }
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    const mediaDocs = await Media.insertMany(uploadResults);

    const enhancedResults = mediaDocs.map(doc => {
      const docObj = doc.toObject();
      if (doc.resource_type === 'image') {
        docObj.responsiveUrls = getResponsiveUrls(doc.public_id);
      }
      return docObj;
    });

    send(res, httpStatus.CREATED, enhancedResults);

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || "Bulk upload failed");
  }
};

export const listMedia = async (req, res) => {
  try {
    const { 
      page, 
      limit, 
      type, 
      q, 
      uploadType,
      ownerId 
    } = req.query;
    
    const { skip, limit: pLimit, page: pPage } = paginate({ page, limit });
    const filter = { isActive: true };
    
    if (type) filter.resource_type = type;
    if (uploadType) filter['meta.uploadType'] = uploadType;
    if (ownerId) filter.ownerId = ownerId;
    if (q) {
      filter.$or = [
        { public_id: new RegExp(q, "i") },
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { 'meta.original_filename': new RegExp(q, "i") },
        { tags: new RegExp(q, "i") }
      ];
    }

    const total = await Media.countDocuments(filter);
    const items = await Media.find(filter)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pLimit);

    const enhancedItems = items.map(item => {
      const itemObj = item.toObject();
      if (item.resource_type === 'image') {
        itemObj.responsiveUrls = getResponsiveUrls(item.public_id);
      }
      return itemObj;
    });

    send(res, httpStatus.OK, {
      total,
      page: pPage,
      limit: pLimit,
      totalPages: Math.ceil(total / pLimit),
      items: enhancedItems
    });

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || "Failed to fetch media");
  }
};

export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('ownerId', 'name email');
    
    ensure(media, httpStatus.NOT_FOUND, "Media not found");

    const mediaObj = media.toObject();
    if (media.resource_type === 'image') {
      mediaObj.responsiveUrls = getResponsiveUrls(media.public_id);
    }

    send(res, httpStatus.OK, mediaObj);

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || "Failed to fetch media");
  }
};

export const removeMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    ensure(media, httpStatus.NOT_FOUND, "Media not found");

    const canDelete = !media.ownerId || 
                     media.ownerId.toString() === req.user.id || 
                     req.user.role === 'admin';
    
    ensure(canDelete, httpStatus.FORBIDDEN, "Not authorized to delete this media");

    await cloudinary.uploader.destroy(media.public_id, { 
      resource_type: media.resource_type || "image" 
    });

    await media.deleteOne();

    send(res, httpStatus.OK, { message: "Media deleted successfully" });

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || "Delete failed");
  }
};

export const getTransformedImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop = 'limit', quality = 'auto' } = req.query;

    ensure(publicId, httpStatus.BAD_REQUEST, 'Public ID is required');

    const transformedUrl = cloudinary.url(publicId, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      crop,
      quality,
      fetch_format: 'auto'
    });

    send(res, httpStatus.OK, { 
      url: transformedUrl,
      publicId 
    });

  } catch (error) {
    fail(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, 
         error.message || 'Failed to generate transformed URL');
  }
};