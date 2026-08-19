import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNotifications);
router.put('/read-all', protect, markAllNotificationsRead);
router.put('/:id/read', protect, markNotificationRead);

export default router;
