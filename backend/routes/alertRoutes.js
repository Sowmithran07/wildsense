import express from 'express';
import {
  getAlerts,
  getAlertById,
  updateAlertStatus,
  assignOfficer,
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getAlerts);
router.route('/:id').get(getAlertById);
router.route('/:id/status').put(protect, authorize('admin', 'officer'), updateAlertStatus);
router.route('/:id/assign').put(protect, authorize('admin', 'officer'), assignOfficer);

export default router;
