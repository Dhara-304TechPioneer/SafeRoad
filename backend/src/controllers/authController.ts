import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validations/authValidation';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { generateToken } from '../utils/jwt';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(', ');
      return next(new AppError(errorMsg, 400));
    }

    const user = await authService.registerUser(parseResult.data);

    // Generate JWT token upon registration to support immediate auto-login in frontend
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      status: 'success',
      access_token: token, // Frontend login alignment key
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(', ');
      return next(new AppError(errorMsg, 400));
    }

    const data = await authService.loginUser(parseResult.data);
    res.status(200).json({
      status: 'success',
      access_token: data.token, // Frontend login alignment key
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const user = await authService.getUserProfile(req.user.userId);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
