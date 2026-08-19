import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  getOfficers,
  getResidents,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);
router.get('/officers', protect, getOfficers);
router.get('/residents', protect, authorize('admin', 'officer'), getResidents);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
