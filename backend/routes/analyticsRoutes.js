import express from 'express';
import { getDashboardMetrics, getTrendAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardMetrics);
router.get('/trends', getTrendAnalytics);

export default router;
