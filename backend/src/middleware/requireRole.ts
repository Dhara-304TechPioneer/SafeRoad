import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const requireRole = (...roles: string[]) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Access forbidden: insufficient permissions', 403));
  }

  next();
};
