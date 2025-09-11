import createError from "http-errors";

// Generic validator for body/query/params using Zod schemas.
// Usage: router.post("/", validateBody(schema), handler)
export const validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.flatten();
    return res.status(400).json({ status: 400, message: "Validation error", details });
  }
  req.body = parsed.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    const details = parsed.error.flatten();
    return res.status(400).json({ status: 400, message: "Validation error", details });
  }
  req.query = parsed.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.params);
  if (!parsed.success) {
    const details = parsed.error.flatten();
    return res.status(400).json({ status: 400, message: "Validation error", details });
  }
  req.params = parsed.data;
  next();
};
