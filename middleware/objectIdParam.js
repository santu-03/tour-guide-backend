import mongoose from 'mongoose';

export const validateObjectIdParam = (param) => (req, res, next) => {
  const val = req.params[param];
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({ success: false, message: `Invalid ${param}` });
  }
  next();
};
