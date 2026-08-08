import { Router } from 'express';
import { createOfficer, listOfficers, listUsers, updateRole } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

router.get('/', protect, adminOnly, listUsers);
router.get('/officers', protect, adminOnly, listOfficers);
router.post('/officers', protect, adminOnly, createOfficer);
router.patch('/:id/role', protect, adminOnly, updateRole);

export default router;
