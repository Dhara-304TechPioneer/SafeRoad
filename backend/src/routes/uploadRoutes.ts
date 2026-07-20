import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import { parseSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

// Endpoint protected by JWT auth and multer file validation middleware
router.post('/report-image', protect, parseSingleImage, uploadImage);

export default router;
