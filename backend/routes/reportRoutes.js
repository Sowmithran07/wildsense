import express from 'express';
import { getReportSummary, exportCSV } from '../controllers/reportController.js';

const router = express.Router();

router.get('/summary', getReportSummary);
router.get('/download-csv', exportCSV);

export default router;
