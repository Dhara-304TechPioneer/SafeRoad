import { Router } from 'express';
import { updateRole } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

router.patch('/:id/role', protect, adminOnly, updateRole);

export default router;
