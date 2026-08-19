import express from 'express';
import {
  toggleSimulation,
  triggerManualIntrusion,
  getStatus,
} from '../controllers/simulationController.js';

const router = express.Router();

router.post('/toggle', toggleSimulation);
router.post('/trigger-manual', triggerManualIntrusion);
router.get('/status', getStatus);

export default router;
