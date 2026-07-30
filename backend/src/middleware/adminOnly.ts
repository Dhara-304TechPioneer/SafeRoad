import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const adminOnly = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Administrator access is required', 403));
  }

  next();
};
