// import jwt from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import User from '../models/User.js';
// import Session from '../models/Session.js';
// import { send } from '../utils/helpers.js';
// import { sendEmail } from '../services/emailService.js';

// const signAccess = (sub) =>
//   jwt.sign({ sub }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
// const signRefresh = (sub) =>
//   jwt.sign({ sub }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || '30d' });

// export const signup = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   const exists = await User.findOne({ email });
//   if (exists) return res.status(httpStatus.CONFLICT).json({ success: false, message: 'Email already registered' });

//   const user = await User.create({ name, email, password, role });
//   await sendEmail({ to: email, subject: 'Welcome to Tour', html: `<p>Hi ${name}, welcome! 🎉</p>` });

//   const accessToken = signAccess(user._id.toString());
//   const refreshToken = signRefresh(user._id.toString());
//   await Session.create({ user: user._id, refreshToken, userAgent: req.headers['user-agent'], ip: req.ip });

//   return send(res, httpStatus.CREATED, {
//     user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
//     tokens: { accessToken, refreshToken }
//   });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await user.compare(password))) {
//     return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid credentials' });
//   }
//   const accessToken = signAccess(user._id.toString());
//   const refreshToken = signRefresh(user._id.toString());
//   await Session.create({ user: user._id, refreshToken, userAgent: req.headers['user-agent'], ip: req.ip });

//   return send(res, httpStatus.OK, {
//     user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
//     tokens: { accessToken, refreshToken }
//   });
// };

// export const refresh = async (req, res) => {
//   const { refreshToken } = req.body;
//   try {
//     const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const session = await Session.findOne({ refreshToken, user: payload.sub, valid: true });
//     if (!session) throw new Error('invalid');

//     const accessToken = signAccess(payload.sub);
//     return send(res, httpStatus.OK, { accessToken });
//   } catch (_) {
//     return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid refresh token' });
//   }
// };

// export const logout = async (req, res) => {
//   const { refreshToken } = req.body;
//   await Session.updateOne({ refreshToken }, { $set: { valid: false } });
//   return send(res, httpStatus.OK, { loggedOut: true });
// };

// export const me = async (req, res) => send(res, httpStatus.OK, req.user);
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { send } from '../utils/helpers.js';
import { sendEmail } from '../services/emailService.js';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
const ACCESS_TTL  = process.env.JWT_EXPIRES_IN     || '15m';
const REFRESH_TTL = process.env.REFRESH_EXPIRES_IN || '30d';

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_ACCESS_SECRET / JWT_REFRESH_SECRET missing in .env');
}

const signAccess  = (sub) => jwt.sign({ sub }, JWT_ACCESS_SECRET,  { expiresIn: ACCESS_TTL });
const signRefresh = (sub) => jwt.sign({ sub }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(httpStatus.CONFLICT).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role });
  try { await sendEmail({ to: email, subject: 'Welcome to Tour', html: `<p>Hi ${name}, welcome! 🎉</p>` }); } catch {}

  const accessToken  = signAccess(user._id.toString());
  const refreshToken = signRefresh(user._id.toString());
  await Session.create({ user: user._id, refreshToken, userAgent: req.headers['user-agent'], ip: req.ip });

  return send(res, httpStatus.CREATED, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    tokens: { accessToken, refreshToken }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.compare(password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid credentials' });
  }

  const accessToken  = signAccess(user._id.toString());
  const refreshToken = signRefresh(user._id.toString());
  await Session.create({ user: user._id, refreshToken, userAgent: req.headers['user-agent'], ip: req.ip });

  return send(res, httpStatus.OK, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    tokens: { accessToken, refreshToken }
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const session = await Session.findOne({ refreshToken, user: payload.sub, valid: true });
    if (!session) throw new Error('invalid');

    const accessToken = signAccess(payload.sub);
    return send(res, httpStatus.OK, { accessToken });
  } catch {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await Session.updateOne({ refreshToken }, { $set: { valid: false } });
  return send(res, httpStatus.OK, { loggedOut: true });
};

export const me = async (req, res) => send(res, httpStatus.OK, req.user);
