import jwt from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../models/User.js";

const getJwtSecret = () => (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "").trim();

export const requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw createError(401, "Missing token");

    const secret = getJwtSecret();
    if (!secret) throw createError(500, "JWT secret missing");

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw createError(401, "Invalid token");

    req.user = user;
    next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") return next(createError(401, "Token expired"));
    if (err?.name === "JsonWebTokenError") return next(createError(401, "Invalid token"));
    next(createError(401, "Unauthorized"));
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(createError(401, "Unauthorized"));
  if (!roles.includes(req.user.role)) return next(createError(403, "Forbidden"));
  next();
};
