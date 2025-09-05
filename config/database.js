import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async (URL) => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(URL);
    logger.info('✅ MongoDB connected');
  } catch (err) {
    logger.error({ err }, '❌ MongoDB connection error');
    process.exit(1);
  }
};
