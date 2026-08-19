import express from 'express';
import {
  getSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
} from '../controllers/sensorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getSensors).post(protect, authorize('admin'), createSensor);
router
  .route('/:id')
  .get(getSensorById)
  .put(protect, authorize('admin', 'officer'), updateSensor)
  .delete(protect, authorize('admin'), deleteSensor);

export default router;
