import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'OFFICER', 'ADMIN']),
});

export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.issues.map((issue) => issue.message).join(', '), 400));
    }

    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await authService.updateUserRole(userId, parsed.data.role);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return next(new AppError('User not found', 404));
    }
    next(error);
  }
};
