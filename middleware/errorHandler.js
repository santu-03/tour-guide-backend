import httpStatus from 'http-status';
import logger from '../utils/logger.js';

export const notFound = (req, res) =>
  res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Route not found' });

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  if (status >= 500) logger.error({ err }, 'Unhandled error');
  else logger.warn({ err }, 'Request error');

  res.status(status).json({ success: false, message, details });
};
