import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { fail } from '../utils/helpers.js';
import { ROLES } from '../config/constants.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return fail(res, httpStatus.UNAUTHORIZED, 'Missing Authorization header');

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(payload.sub).select('-password');
    if (!req.user) return fail(res, httpStatus.UNAUTHORIZED, 'User not found');
    next();
  } catch (e) {
    return fail(res, httpStatus.UNAUTHORIZED, 'Invalid/expired token');
  }
};

export const authorize = (...allowed) => (req, res, next) => {
  if (!req.user) return fail(res, httpStatus.UNAUTHORIZED, 'Not authenticated');
  if (allowed.length && !allowed.includes(req.user.role)) {
    return fail(res, httpStatus.FORBIDDEN, 'Insufficient permissions');
  }
  next();
};

// refresh token guard (for logout/rotation)
export const requireSession = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return fail(res, httpStatus.BAD_REQUEST, 'Missing refreshToken');
  const session = await Session.findOne({ refreshToken, valid: true });
  if (!session) return fail(res, httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  req.sessionDoc = session;
  next();
};
