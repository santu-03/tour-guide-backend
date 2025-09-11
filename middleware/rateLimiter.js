import rateLimit from "express-rate-limit";

// General API limiter (e.g., applied at /api/v1)
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,            // 120 requests/min
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (optional)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,                  // 30 tries / 10 min
  message: { status: 429, message: "Too many attempts. Please try later." },
  standardHeaders: true,
  legacyHeaders: false,
});
