import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/uploadService';
import { AppError } from '../middleware/errorHandler';

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const imageUrl = uploadService.processUploadedFile(req.file);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
      image_url: imageUrl, // Frontend contract compatibility
    });
  } catch (error) {
    next(error);
  }
};
