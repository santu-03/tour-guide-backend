import stream from "stream";
import cloudinary from "../config/cloudinary.js";
import Media from "../models/Media.js";

/** Shared helper: upload a buffer via Cloudinary stream */
export function uploadBuffer(buffer, {
  folder = process.env.CLOUDINARY_DEFAULT_FOLDER,
  resource_type = "auto",
  tags, context
} = {}) {
  return new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const cld = cloudinary.uploader.upload_stream(
      { folder, resource_type, tags, context },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    pass.end(buffer);
    pass.pipe(cld);
  });
}

export const uploadOne = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const r = await uploadBuffer(req.file.buffer, { resource_type: "auto" });
    const doc = await Media.create({
      url: r.secure_url, public_id: r.public_id, resource_type: r.resource_type,
      format: r.format, bytes: r.bytes, width: r.width, height: r.height,
      folder: r.folder, tags: r.tags, context: r.context,
      meta: { original_filename: r.original_filename, etag: r.etag, version: r.version }
    });
    res.status(201).json(doc);
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Upload failed" });
  }
};

export const uploadManyCtrl = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: "No files" });
    const rows = await Promise.all(req.files.map(async f => {
      const r = await uploadBuffer(f.buffer, { resource_type: "auto" });
      return {
        url: r.secure_url, public_id: r.public_id, resource_type: r.resource_type,
        format: r.format, bytes: r.bytes, width: r.width, height: r.height,
        folder: r.folder, tags: r.tags, context: r.context,
        meta: { original_filename: r.original_filename, etag: r.etag, version: r.version }
      };
    }));
    const docs = await Media.insertMany(rows);
    res.status(201).json(docs);
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Bulk upload failed" });
  }
};

export const listMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, q } = req.query;
    const filter = {};
    if (type) filter.resource_type = type;
    if (q) filter.$or = [{ public_id: new RegExp(q, "i") }, { url: new RegExp(q, "i") }];
    const total = await Media.countDocuments(filter);
    const items = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Fetch failed" });
  }
};

export const removeMedia = async (req, res) => {
  try {
    const doc = await Media.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    await cloudinary.uploader.destroy(doc.public_id, { resource_type: doc.resource_type || "image" });
    await doc.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Delete failed" });
  }
};
