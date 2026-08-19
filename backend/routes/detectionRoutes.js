import express from 'express';
import {
  getDetections,
  getDetectionById,
  createDetection,
} from '../controllers/detectionController.js';

const router = express.Router();

router.route('/').get(getDetections).post(createDetection);
router.route('/:id').get(getDetectionById);

export default router;
