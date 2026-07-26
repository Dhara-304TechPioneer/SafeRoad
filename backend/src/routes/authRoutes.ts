import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);

export default router;

