import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
  getComments,
  addComment,
} from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';
import { uploadImage } from '../controllers/uploadController';
import { parseSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

// All report management endpoints require active authorization
router.use(protect);

router.post('/upload', parseSingleImage, uploadImage);
router.post('/', create);
router.get('/my', (req, res, next) => {
  req.query.mine = 'true';
  getAll(req, res, next);
});
router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id', update);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);

export default router;

