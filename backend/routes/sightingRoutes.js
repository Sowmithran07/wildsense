import express from 'express';
import {
  getSightings,
  createSighting,
  updateSightingStatus,
} from '../controllers/sightingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getSightings).post(createSighting);
router.route('/:id/status').put(protect, authorize('admin', 'officer'), updateSightingStatus);

export default router;
