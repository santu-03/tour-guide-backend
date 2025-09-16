// // // import 'dotenv/config';
// // // import express from 'express';
// // // import cors from 'cors';
// // // import helmet from 'helmet';
// // // import compression from 'compression';
// // // import cookieParser from 'cookie-parser';
// // // import morgan from 'morgan';
// // // import httpStatus from 'http-status';

// // // import { connectDB } from './config/database.js';
// // // import logger from './utils/logger.js';
// // // import { apiLimiter } from './middleware/rateLimiter.js';
// // // import { notFound, errorHandler } from './middleware/errorHandler.js';

// // // // routes
// // // import authRoutes from './routes/auth.js';
// // // import userRoutes from './routes/users.js';
// // // import activityRoutes from './routes/activities.js';
// // // import placeRoutes from './routes/places.js';
// // // import reviewRoutes from './routes/reviews.js';
// // // import bookingRoutes from './routes/bookings.js';
// // // // import paymentRoutes from './routes/payments.js';
// // // import campaignRoutes from './routes/campaigns.js';
// // // import dashboardRoutes from './routes/dashboard.js';

// // // // --- fail fast on missing envs ---
// // // const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
// // // for (const k of required) {
// // //   if (!process.env[k] || !String(process.env[k]).trim()) {
// // //     console.error(`❌ Missing required env: ${k}`);
// // //     process.exit(1);
// // //   }
// // // }

// // // const app = express();

// // // // core middleware
// // // app.use(helmet());
// // // //app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
// // // app.use(cors({
// // //   origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
// // //   credentials: true
// // // }));

// // // app.use(express.json({ limit: '1mb' }));
// // // app.use(express.urlencoded({ extended: true }));
// // // app.use(cookieParser());
// // // app.use(compression());
// // // if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// // // app.set('trust proxy', 1);

// // // // health
// // // app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// // // // rate limit the whole api a bit
// // // app.use('/api', apiLimiter);

// // // // mount routers
// // // app.use('/api/auth', authRoutes);
// // // app.use('/api/users', userRoutes);
// // // app.use('/api/activities', activityRoutes);
// // // app.use('/api/places', placeRoutes);
// // // app.use('/api/reviews', reviewRoutes);
// // // app.use('/api/bookings', bookingRoutes);
// // // //app.use('/api/payments', paymentRoutes);
// // // app.use('/api/campaigns', campaignRoutes);
// // // app.use('/api/dashboard', dashboardRoutes);

// // // // 404 + errors
// // // app.use(notFound);
// // // app.use(errorHandler);

// // // // boot
// // // const PORT = process.env.PORT || 5000;
// // // const MONGO = process.env.MONGO_URI || process.env.MONGO_URL;
// // // if (!MONGO) {
// // //   console.error('❌ Missing MONGO_URI (or MONGO_URL) in .env');
// // //   process.exit(1);
// // // }

// // // await connectDB(MONGO);
// // // app.listen(PORT, () => logger.info(`🚀 Server ready on http://localhost:${PORT}`));







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
// // import { handleUploadError } from './middleware/upload.js';

// // // routes
// // import authRoutes from './routes/auth.js';
// // import userRoutes from './routes/users.js';
// // import activityRoutes from './routes/activities.js';
// // import placeRoutes from './routes/places.js';
// // import reviewRoutes from './routes/reviews.js';
// // import bookingRoutes from './routes/bookings.js';
// // import campaignRoutes from './routes/campaigns.js';
// // import dashboardRoutes from './routes/dashboard.js';
// // import mediaRoutes from './routes/media.js';

// // // --- fail fast on missing envs ---
// // const required = [
// //   'JWT_ACCESS_SECRET', 
// //   'JWT_REFRESH_SECRET',
// //   'CLOUDINARY_CLOUD_NAME',
// //   'CLOUDINARY_API_KEY',       
// //   'CLOUDINARY_API_SECRET'
// // ];

// // for (const k of required) {
// //   if (!process.env[k] || !String(process.env[k]).trim()) {
// //     console.error(`❌ Missing required env: ${k}`);
// //     process.exit(1);
// //   }
// // }

// // const app = express();

// // // core middleware
// // app.use(helmet());
// // app.use(cors({
// //   origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
// //   credentials: true
// // }));

// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// // app.use(cookieParser());
// // app.use(compression());
// // if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
// // app.set('trust proxy', 1);

// // // health
// // app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ ok: true }));

// // // rate limit the whole api
// // app.use('/api', apiLimiter);

// // // mount routers
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/activities', activityRoutes);
// // app.use('/api/places', placeRoutes);
// // app.use('/api/reviews', reviewRoutes);
// // app.use('/api/bookings', bookingRoutes);
// // app.use('/api/campaigns', campaignRoutes);
// // app.use('/api/dashboard', dashboardRoutes);
// // app.use('/api/media', mediaRoutes);

// // // error handling
// // app.use(handleUploadError);
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



// import "dotenv/config";
// import express from "express";
// import helmet from "helmet";
// import cors from "cors";
// import morgan from "morgan";
// import mongoose from "mongoose";
// import axios from "axios";


// import { connectDB } from "./config/database.js";
// import apiRouter from "./routes/index.js";
// import { notFound, errorHandler } from "./middleware/errorHandler.js";
// import { limiter } from "./middleware/rateLimiter.js";

// const app = express();
// app.disable("x-powered-by");
// app.set("trust proxy", 1);

// /* ---------- Boot-time guards (fail fast with clear messages) ---------- */
// if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
//   console.error("❌ JWT secret missing. Set JWT_ACCESS_SECRET or JWT_SECRET in .env");
//   process.exit(1);
// }

// /* ----------------------------- CORS setup ------------------------------ */
// const allowlist = [
//   ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
//   ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
// ]
//   .map((s) => s.trim())
//   .filter(Boolean);

// const corsOptions = {
//   credentials: true,
//   origin: (origin, cb) => {
//     if (!origin || allowlist.length === 0) return cb(null, true); // server-to-server or no allowlist: allow
//     if (allowlist.includes(origin)) return cb(null, true);
//     return cb(new Error("CORS: Origin not allowed"));
//   },
// };

// app.use(helmet());
// app.use(cors(corsOptions));
// app.use(express.json({ limit: "2mb" }));
// app.use(express.urlencoded({ extended: true }));
// if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// /* ----------------------------- Healthcheck ----------------------------- */
// app.get("/health", (_req, res) =>
//   res.json({
//     ok: true,
//     service: "tour-guide-backend",
//     env: process.env.NODE_ENV || "development",
//     uptime: process.uptime(),
//     ts: Date.now(),
//     corsAllowlist: allowlist, // helpful for debugging



//   })
// );

// /* -------------------------------- Routing ------------------------------ */
// // NOTE: Your frontend must call http://localhost:5000/api/...
// app.use("/api", limiter, apiRouter);

// /* --------------------------- Errors & 404s ----------------------------- */
// app.use(notFound);
// app.use(errorHandler);

// /* ---------------------------- Start server ---------------------------- */
// const PORT = Number(process.env.PORT || 5000);
// let server;

// async function start() {
//   try {
//     await connectDB(); // uses MONGO_URL (or MONGO_URI fallback)
//     // server = app.listen(PORT, () => {
//     //   console.log(`🚀 API running on http://localhost:${PORT}`);
//     // });
//     server = app.listen(PORT, () => {
//   console.log(`🚀 API running on http://localhost:${PORT}`);

//   // 🔁 Periodic self-ping (every 1 minute)
//   const pingUrl =
//     process.env.NODE_ENV === "development"
//       ? "https://tour-guide-backend-ygiv.onrender.com"
//       : `http://localhost:${PORT}/health`;

//   setInterval(async () => {
//     try {
//       await axios.get(pingUrl);
//       console.log("[SELF-PING] Success. Server responding OK.");
//     } catch (err) {
//       console.error("[SELF-PING ERROR]:", err.message);
//     }
//   }, 60_000); // 1 minute
// });




//   } catch (err) {
//     console.error("❌ Failed to start server:", err?.message || err);
//     process.exit(1);
//   }
// }

// start();

// /* ------------------------- Graceful shutdown --------------------------- */
// const graceful = async (signal) => {
//   try {
//     console.log(`\n${signal} received. Shutting down gracefully…`);
//     if (server) await new Promise((r) => server.close(r));
//     await mongoose.connection.close();
//     console.log("✅ Closed HTTP server & Mongo connection. Bye!");
//     process.exit(0);
//   } catch (err) {
//     console.error("⚠️ Error during shutdown:", err);
//     process.exit(1);
//   }
// };

// process.on("SIGINT", () => graceful("SIGINT"));
// process.on("SIGTERM", () => graceful("SIGTERM"));
// process.on("unhandledRejection", (err) => {
//   console.error("💥 Unhandled Promise Rejection:", err);
//   graceful("unhandledRejection");
// });
// process.on("uncaughtException", (err) => {
//   console.error("💥 Uncaught Exception:", err);
//   graceful("uncaughtException");
// });

// export default app;


import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import axios from "axios";

import { connectDB } from "./config/database.js";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { limiter } from "./middleware/rateLimiter.js";
import { handleUploadError } from "./middleware/upload.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

/* ---------- Environment Validation (fail fast) ---------- */
const requiredEnvVars = [
  'MONGO_URL',
  'JWT_ACCESS_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// JWT validation
if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
  console.error("❌ JWT secret missing. Set JWT_ACCESS_SECRET or JWT_SECRET in .env");
  process.exit(1);
}

console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`✅ All required environment variables present`);

/* ----------------------------- CORS Configuration ----------------------------- */
const allowlist = [
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
]
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return cb(null, true);
    
    // If no allowlist configured, allow all origins (development only)
    if (allowlist.length === 0 && process.env.NODE_ENV !== 'production') {
      return cb(null, true);
    }
    
    // Check if origin is in allowlist
    if (allowlist.includes(origin)) return cb(null, true);
    
    return cb(new Error(`CORS: Origin ${origin} not allowed`));
  },
};

/* ----------------------------- Security Middleware ----------------------------- */
// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
    },
  } : false, // Disable CSP in development
  crossOriginEmbedderPolicy: false, // Needed for Cloudinary
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));

app.use(cors(corsOptions));

// Body parsing with limits
app.use(express.json({ 
  limit: "10mb",
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: "10mb",
  parameterLimit: 50
}));

// Request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Request size monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 2000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
    
    // Log errors
    if (res.statusCode >= 400) {
      console.error(`❌ Error response: ${res.statusCode} - ${req.method} ${req.originalUrl}`);
    }
  });
  
  next();
});

/* ----------------------------- Health Checks ----------------------------- */
app.get("/health", (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    service: "tour-guide-backend",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
    },
    corsAllowlist: allowlist
  };
  
  res.status(200).json(healthcheck);
});

// Database health check
app.get("/health/db", async (_req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    if (dbState === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      res.status(200).json({
        status: 'healthy',
        database: states[dbState],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        database: states[dbState]
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'error',
      error: error.message
    });
  }
});

// Liveness probe for Kubernetes/Docker
app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe for Kubernetes/Docker
app.get("/health/ready", async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

/* -------------------------------- API Routes ------------------------------ */
app.use("/api", limiter, apiRouter);

/* ----------------------------- Error Handling ----------------------------- */
// Handle upload errors specifically
app.use(handleUploadError);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

/* ---------------------------- Server Startup ---------------------------- */
const PORT = Number(process.env.PORT || 5000);
let server;

async function start() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Start server
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API base URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS origins: ${allowlist.length ? allowlist.join(', ') : 'all (development mode)'}`);
      
      // Setup keep-alive for production deployment
      setupKeepAlive();
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

/* ----------------------------- Keep-Alive Setup ----------------------------- */
function setupKeepAlive() {
  // Only run keep-alive in production and if we have the external URL
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const pingUrl = `${process.env.RENDER_EXTERNAL_URL}/health`;
    
    console.log(`🔄 Setting up keep-alive ping to: ${pingUrl}`);
    
    const keepAlive = setInterval(async () => {
      try {
        const response = await axios.get(pingUrl, { 
          timeout: 30000,
          headers: {
            'User-Agent': 'KeepAlive-Ping/1.0'
          }
        });
        
        if (response.status === 200) {
          console.log(`[KEEP-ALIVE] ✅ Ping successful - ${new Date().toISOString()}`);
        }
      } catch (error) {
        console.error(`[KEEP-ALIVE] ❌ Ping failed:`, error.message);
      }
    }, 14 * 60 * 1000); // Every 14 minutes
    
    // Clear interval on app termination
    process.on('SIGTERM', () => clearInterval(keepAlive));
    process.on('SIGINT', () => clearInterval(keepAlive));
  }
}

/* ------------------------- Graceful Shutdown --------------------------- */
const gracefulShutdown = async (signal) => {
  console.log(`\n📤 ${signal} received. Initiating graceful shutdown...`);
  
  try {
    // Stop accepting new requests
    if (server) {
      console.log('🔌 Closing HTTP server...');
      await new Promise((resolve) => {
        server.close(resolve);
      });
      console.log('✅ HTTP server closed');
    }
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Closing database connection...');
      await mongoose.connection.close();
      console.log('✅ Database connection closed');
    }
    
    console.log('🎉 Graceful shutdown completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
start();

export default app;