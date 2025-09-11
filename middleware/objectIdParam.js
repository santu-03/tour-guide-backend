import createError from "http-errors";

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

export const validateObjectIdParam = (paramName = "id") => (req, _res, next) => {
  const id = req.params[paramName];
  if (!id || !OBJECT_ID_RE.test(id)) {
    return next(createError(400, `Invalid ObjectId for param "${paramName}"`));
  }
  next();
};
