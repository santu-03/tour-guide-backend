import httpStatus from 'http-status';
import { fail } from '../utils/helpers.js';

export const validate = (schema, key = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[key], { abortEarly: false, stripUnknown: true });
  if (error) return fail(res, httpStatus.BAD_REQUEST, 'Validation failed', error.details);
  req[key] = value;
  next();
};
