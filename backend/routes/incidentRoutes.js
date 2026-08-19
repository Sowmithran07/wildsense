import express from 'express';
import {
  getIncidents,
  getIncidentById,
  updateIncident,
  addResponseNote,
} from '../controllers/incidentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getIncidents);
router.route('/:id').get(getIncidentById).put(protect, authorize('admin', 'officer'), updateIncident);
router.route('/:id/notes').post(protect, authorize('admin', 'officer'), addResponseNote);

export default router;
