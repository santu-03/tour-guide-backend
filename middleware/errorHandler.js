import createError from "http-errors";
import { ZodError } from "zod";

export const notFound = (req, _res, next) => {
  next(createError(404, `Not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  // Normalize common errors
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details;

  // Zod validation error
  if (err instanceof ZodError) {
    status = 400;
    message = "Validation error";
    details = err.flatten();
  }

  // Mongoose cast/validation/duplicate errors
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid identifier";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error";
    details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
    );
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate key";
    details = err.keyValue;
  }

  if (status >= 500) console.error(err);

  const payload = { status, message };
  if (details) payload.details = details;
  if (process.env.NODE_ENV !== "production" && err.stack) payload.stack = err.stack;

  res.status(status).json(payload);
};
