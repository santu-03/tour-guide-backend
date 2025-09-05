import httpStatus from 'http-status';

export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const send = (res, status, data) => res.status(status).json({ success: true, data });
export const fail = (res, status, message, details) =>
  res.status(status).json({ success: false, message, details });

export const pick = (obj, keys) =>
  keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});

export const ensure = (cond, status, message) => {
  if (!cond) throw new ApiError(status, message);
};

export const paginate = ({ page = 1, limit = 10 }) => {
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  return { skip: (p - 1) * l, limit: l, page: p };
};
