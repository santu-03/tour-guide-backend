import httpStatus from 'http-status';
import { overviewStats } from '../services/analyticsService.js';
import { send } from '../utils/helpers.js';

export const overview = async (req, res) => {
  const stats = await overviewStats();
  return send(res, httpStatus.OK, stats);
};
