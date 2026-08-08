import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from '../utils/password';

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'OFFICER', 'ADMIN']),
});

const createOfficerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  departmentName: z.string().min(2).optional(),
  departmentId: z.string().optional(),
  badgeNumber: z.string().min(2).optional(),
});

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        officer: {
          select: {
            id: true,
            badgeNumber: true,
            status: true,
            department: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const listOfficers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const officers = await prisma.officer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        department: true,
      },
    });

    res.status(200).json({ status: 'success', data: { officers } });
  } catch (error) {
    next(error);
  }
};

export const createOfficer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createOfficerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.issues.map((issue) => issue.message).join(', '), 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) {
      return next(new AppError('Email is already registered', 400));
    }

    const department = parsed.data.departmentId
      ? await prisma.department.findUnique({ where: { id: parsed.data.departmentId } })
      : await prisma.department.findFirst({ where: { name: parsed.data.departmentName || 'Road Maintenance' } });

    const resolvedDepartment = department ?? await prisma.department.create({
      data: { name: parsed.data.departmentName || 'Road Maintenance' },
    });

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: passwordHash,
        role: 'OFFICER',
      },
    });

    const officer = await prisma.officer.create({
      data: {
        userId: user.id,
        departmentId: resolvedDepartment.id,
        badgeNumber: parsed.data.badgeNumber || `OFF-${Date.now().toString().slice(-6)}`,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        officer,
      },
    });
  } catch (error) {
    next(error);
  }
};

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
