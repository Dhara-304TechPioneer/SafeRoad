import prisma from '../config/db';
import {
  CreateReportInput,
  UpdateReportInput,
} from '../validations/reportValidation';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export const createReport = async (userId: string, input: CreateReportInput) => {
  const { imageUrl, ...reportData } = input;

  return prisma.report.create({
    data: {
      ...reportData,
      userId,
      attachments: imageUrl
        ? {
            create: {
              url: imageUrl,
              fileType: 'IMAGE',
            },
          }
        : undefined,
    },
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
      attachments: true,
    },
  });
};

export const getReports = async (
  user: { userId: string; role: string },
  filters: any
) => {
  const page = Math.max(1, parseInt(filters.page || '1', 10));
  const limit = Math.max(1, parseInt(filters.limit || '10', 10));
  const skip = (page - 1) * limit;

  const where: Prisma.ReportWhereInput = {};

  // 1. Role-based visibility
  if (user.role === 'USER') {
    where.userId = user.userId;
  } else if (filters.mine === 'true' || filters.mine === true) {
    where.userId = user.userId;
  }

  // 2. Search filter
  if (filters.search) {
    const searchStr = String(filters.search);
    where.OR = [
      { title: { contains: searchStr, mode: 'insensitive' } },
      { description: { contains: searchStr, mode: 'insensitive' } },
      { address: { contains: searchStr, mode: 'insensitive' } },
      { city: { contains: searchStr, mode: 'insensitive' } },
    ];
  }

  // 3. Enums and relational filters
  if (filters.severity) {
    where.severity = filters.severity;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.departmentId) {
    where.departmentId = filters.departmentId;
  }
  if (filters.officerId) {
    where.officerId = filters.officerId;
  }

  // 4. Fetch data & total count
  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
        department: true,
        officer: {
          include: {
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return {
    data: reports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getReportById = async (
  id: string,
  user: { userId: string; role: string }
) => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
      department: true,
      officer: {
        include: {
          user: { select: { id: true, fullName: true, email: true } },
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, fullName: true } },
        },
      },
      attachments: true,
      aiResults: true,
    },
  });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (user.role === 'USER' && report.userId !== user.userId) {
    throw new AppError('Access forbidden to this report', 403);
  }

  return report;
};

export const updateReport = async (
  id: string,
  input: UpdateReportInput,
  user: { userId: string; role: string }
) => {
  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (user.role === 'USER' && report.userId !== user.userId) {
    throw new AppError('Access forbidden to update this report', 403);
  }

  // USER role cannot alter status, departmentId or officerId
  let updateData: any = { ...input };
  if (user.role === 'USER') {
    const { status, departmentId, officerId, ...allowedData } = input as any;
    updateData = allowedData;
  }

  return prisma.report.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
      department: true,
      officer: {
        include: {
          user: { select: { id: true, fullName: true, email: true } },
        },
      },
      attachments: true,
    },
  });
};

export const deleteReport = async (
  id: string,
  user: { userId: string; role: string }
) => {
  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (user.role === 'USER' && report.userId !== user.userId) {
    throw new AppError('Access forbidden to delete this report', 403);
  }

  await prisma.report.delete({
    where: { id },
  });

  return true;
};
