import express from 'express';
import { ingestSensorData } from '../controllers/iotController.js';

const router = express.Router();

router.post('/sensor-data', ingestSensorData);

export default router;
