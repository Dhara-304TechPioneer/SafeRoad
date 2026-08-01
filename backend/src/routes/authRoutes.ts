import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refresh,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

router.post('/register', authAttemptLimiter, register);
router.post('/login', authAttemptLimiter, login);
router.post('/forgot-password', authAttemptLimiter, forgotPassword);
router.post('/verify-otp', authAttemptLimiter, verifyOtp);
router.post('/reset-password', authAttemptLimiter, resetPassword);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);

export default router;
