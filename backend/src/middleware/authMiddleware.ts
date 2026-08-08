import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized, token missing', 401));
    }

    const decoded = verifyToken(token);
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!currentUser) {
      return next(new AppError('Not authorized, user not found', 401));
    }

    req.user = {
      userId: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    next(new AppError('Not authorized, token invalid', 401));
  }
};
