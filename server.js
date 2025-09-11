// // import 'dotenv/config';
// // import express from 'express';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import compression from 'compression';
// // import cookieParser from 'cookie-parser';
// // import morgan from 'morgan';
// // import httpStatus from 'http-status';

// // import { connectDB } from './config/database.js';
// // import logger from './utils/logger.js';
// // import { apiLimiter } from './middleware/rateLimiter.js';
// // import { notFound, errorHandler } from './middleware/errorHandler.js';

// // // routes
// // import authRoutes from './routes/auth.js';
// // import userRoutes from './routes/users.js';
// // import activityRoutes from './routes/activities.js';
// // import placeRoutes from './routes/places.js';
// // import reviewRoutes from './routes/reviews.js';
// // import bookingRoutes from './routes/bookings.js';
// // // import paymentRoutes from './routes/payments.js';
// // import campaignRoutes from './routes/campaigns.js';
// // import dashboardRoutes from './routes/dashboard.js';

// // // --- fail fast on missing envs ---
// // const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
// // for (const k of required) {
// //   if (!process.env[k] || !String(process.env[k]).trim()) {
// //     console.error(`❌ Missing required env: ${k}`);
// //     process.exit(1);
// //   }
// // }

// // const app = express();

// // // core middleware
// // app.use(helmet());
// // //app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
// // app.use(cors({
// //   origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
// //   credentials: true
// // }));

// // app.use(express.json({ limit: '1mb' }));
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser());
// // app.use(compression());
// // if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// // app.set('trust proxy', 1);

// // // health
// // app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// // // rate limit the whole api a bit
// // app.use('/api', apiLimiter);

// // // mount routers
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/activities', activityRoutes);
// // app.use('/api/places', placeRoutes);
// // app.use('/api/reviews', reviewRoutes);
// // app.use('/api/bookings', bookingRoutes);
// // //app.use('/api/payments', paymentRoutes);
// // app.use('/api/campaigns', campaignRoutes);
// // app.use('/api/dashboard', dashboardRoutes);

// // // 404 + errors
// // app.use(notFound);
// // app.use(errorHandler);

// // // boot
// // const PORT = process.env.PORT || 5000;
// // const MONGO = process.env.MONGO_URI || process.env.MONGO_URL;
// // if (!MONGO) {
// //   console.error('❌ Missing MONGO_URI (or MONGO_URL) in .env');
// //   process.exit(1);
// // }

// // await connectDB(MONGO);
// // app.listen(PORT, () => logger.info(`🚀 Server ready on http://localhost:${PORT}`));







// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import httpStatus from 'http-status';

// import { connectDB } from './config/database.js';
// import logger from './utils/logger.js';
// import { apiLimiter } from './middleware/rateLimiter.js';
// import { notFound, errorHandler } from './middleware/errorHandler.js';
// import { handleUploadError } from './middleware/upload.js';

// // routes
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import activityRoutes from './routes/activities.js';
// import placeRoutes from './routes/places.js';
// import reviewRoutes from './routes/reviews.js';
// import bookingRoutes from './routes/bookings.js';
// import campaignRoutes from './routes/campaigns.js';
// import dashboardRoutes from './routes/dashboard.js';
// import mediaRoutes from './routes/media.js';

// // --- fail fast on missing envs ---
// const required = [
//   'JWT_ACCESS_SECRET', 
//   'JWT_REFRESH_SECRET',
//   'CLOUDINARY_CLOUD_NAME',
//   'CLOUDINARY_API_KEY',       
//   'CLOUDINARY_API_SECRET'
// ];

// for (const k of required) {
//   if (!process.env[k] || !String(process.env[k]).trim()) {
//     console.error(`❌ Missing required env: ${k}`);
//     process.exit(1);
//   }
// }

// const app = express();

// // core middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
//   credentials: true
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());
// app.use(compression());
// if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// app.set('trust proxy', 1);

// // health
// app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// // rate limit the whole api
// app.use('/api', apiLimiter);

// // mount routers
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/activities', activityRoutes);
// app.use('/api/places', placeRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/campaigns', campaignRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/media', mediaRoutes);

// // error handling
// app.use(handleUploadError);
// app.use(notFound);
// app.use(errorHandler);

// // boot
// const PORT = process.env.PORT || 5000;
// const MONGO = process.env.MONGO_URI || process.env.MONGO_URL;
// if (!MONGO) {
//   console.error('❌ Missing MONGO_URI (or MONGO_URL) in .env');
//   process.exit(1);
// }

// await connectDB(MONGO);
// app.listen(PORT, () => logger.info(`🚀 Server ready on http://localhost:${PORT}`));



import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import { connectDB } from "./config/database.js";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { limiter } from "./middleware/rateLimiter.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

/* ---------- Boot-time guards (fail fast with clear messages) ---------- */
if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
  console.error("❌ JWT secret missing. Set JWT_ACCESS_SECRET or JWT_SECRET in .env");
  process.exit(1);
}

/* ----------------------------- CORS setup ------------------------------ */
const allowlist = [
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
]
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    if (!origin || allowlist.length === 0) return cb(null, true); // server-to-server or no allowlist: allow
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: Origin not allowed"));
  },
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

/* ----------------------------- Healthcheck ----------------------------- */
app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    service: "tour-guide-backend",
    env: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    ts: Date.now(),
    corsAllowlist: allowlist, // helpful for debugging
  })
);

/* -------------------------------- Routing ------------------------------ */
// NOTE: Your frontend must call http://localhost:5000/api/...
app.use("/api", limiter, apiRouter);

/* --------------------------- Errors & 404s ----------------------------- */
app.use(notFound);
app.use(errorHandler);

/* ---------------------------- Start server ---------------------------- */
const PORT = Number(process.env.PORT || 5000);
let server;

async function start() {
  try {
    await connectDB(); // uses MONGO_URL (or MONGO_URI fallback)
    server = app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err?.message || err);
    process.exit(1);
  }
}

start();

/* ------------------------- Graceful shutdown --------------------------- */
const graceful = async (signal) => {
  try {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    if (server) await new Promise((r) => server.close(r));
    await mongoose.connection.close();
    console.log("✅ Closed HTTP server & Mongo connection. Bye!");
    process.exit(0);
  } catch (err) {
    console.error("⚠️ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => graceful("SIGINT"));
process.on("SIGTERM", () => graceful("SIGTERM"));
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Promise Rejection:", err);
  graceful("unhandledRejection");
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  graceful("uncaughtException");
});

export default app;
