import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized, token missing', 401));
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError('Not authorized, token invalid', 401));
  }
};
