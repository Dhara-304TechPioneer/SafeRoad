import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import {
  getUploadDirectoryPath,
  generateUniqueFileName,
} from '../utils/fileStorage';
import { AppError } from './errorHandler';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = getUploadDirectoryPath();
      cb(null, uploadDir);
    } catch (error: any) {
      cb(error, '');
    }
  },
  filename: (req, file, cb) => {
    try {
      const fileName = generateUniqueFileName(file.originalname);
      cb(null, fileName);
    } catch (error: any) {
      cb(error, '');
    }
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed.',
        400
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

export const parseSingleImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  uploadFields(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new AppError('File size limit exceeded. Maximum size is 10 MB.', 400)
          );
        }
        return next(new AppError(err.message, 400));
      }
      return next(err);
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const file = files?.image?.[0] || files?.file?.[0];

    if (!file) {
      return next(new AppError('Please upload an image file.', 400));
    }

    req.file = file;
    next();
  });
};
export default parseSingleImage;
