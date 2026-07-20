import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';
import { uploadImage } from '../controllers/uploadController';
import { parseSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

// All report management endpoints require active authorization
router.use(protect);

router.post('/upload', parseSingleImage, uploadImage);
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
