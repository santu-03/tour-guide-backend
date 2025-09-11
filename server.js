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

// // routes
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import activityRoutes from './routes/activities.js';
// import placeRoutes from './routes/places.js';
// import reviewRoutes from './routes/reviews.js';
// import bookingRoutes from './routes/bookings.js';
// // import paymentRoutes from './routes/payments.js';
// import campaignRoutes from './routes/campaigns.js';
// import dashboardRoutes from './routes/dashboard.js';

// // --- fail fast on missing envs ---
// const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
// for (const k of required) {
//   if (!process.env[k] || !String(process.env[k]).trim()) {
//     console.error(`❌ Missing required env: ${k}`);
//     process.exit(1);
//   }
// }

// const app = express();

// // core middleware
// app.use(helmet());
// //app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
// app.use(cors({
//   origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
//   credentials: true
// }));

// app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(compression());
// if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// app.set('trust proxy', 1);

// // health
// app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// // rate limit the whole api a bit
// app.use('/api', apiLimiter);

// // mount routers
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/activities', activityRoutes);
// app.use('/api/places', placeRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/bookings', bookingRoutes);
// //app.use('/api/payments', paymentRoutes);
// app.use('/api/campaigns', campaignRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// // 404 + errors
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







import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import httpStatus from 'http-status';

import { connectDB } from './config/database.js';
import logger from './utils/logger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { handleUploadError } from './middleware/upload.js';

// routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import placeRoutes from './routes/places.js';
import reviewRoutes from './routes/reviews.js';
import bookingRoutes from './routes/bookings.js';
import campaignRoutes from './routes/campaigns.js';
import dashboardRoutes from './routes/dashboard.js';
import mediaRoutes from './routes/media.js';

// --- fail fast on missing envs ---
const required = [
  'JWT_ACCESS_SECRET', 
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',       
  'CLOUDINARY_API_SECRET'
];

for (const k of required) {
  if (!process.env[k] || !String(process.env[k]).trim()) {
    console.error(`❌ Missing required env: ${k}`);
    process.exit(1);
  }
}

const app = express();

// core middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.set('trust proxy', 1);

// health
app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// rate limit the whole api
app.use('/api', apiLimiter);

// mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/media', mediaRoutes);

// error handling
app.use(handleUploadError);
app.use(notFound);
app.use(errorHandler);

// boot
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || process.env.MONGO_URL;
if (!MONGO) {
  console.error('❌ Missing MONGO_URI (or MONGO_URL) in .env');
  process.exit(1);
}

await connectDB(MONGO);
app.listen(PORT, () => logger.info(`🚀 Server ready on http://localhost:${PORT}`));