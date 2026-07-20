import { Request, Response, NextFunction } from 'express';
import {
  createReportSchema,
  updateReportSchema,
} from '../validations/reportValidation';
import * as reportService from '../services/reportService';
import { AppError } from '../middleware/errorHandler';
import { analyzeReportImage } from '../services/aiService';
import * as socketService from '../services/socketService';
import prisma from '../config/db';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    // Adapt frontend snake_case attributes
    if (req.body.image_url && !req.body.imageUrl) {
      req.body.imageUrl = req.body.image_url;
    }
    if (!req.body.city) {
      req.body.city = req.body.address?.split(', ').at(-1) || 'Unknown';
    }

    const parseResult = createReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(', ');
      return next(new AppError(errorMsg, 400));
    }

    const report = await reportService.createReport(
      req.user.userId,
      parseResult.data
    );

    let aiResult = null;
    let warning: string | undefined = undefined;

    if (parseResult.data.imageUrl) {
      aiResult = await analyzeReportImage(report.id, parseResult.data.imageUrl);
      if (!aiResult) {
        warning =
          'AI analysis is pending: AI service is currently unavailable or timed out.';
      }
    }

    // 1. Emit Report Created websocket event
    socketService.emitReportCreated(report);

    // 2. Broadcast generic notification to Admins
    socketService.emitNotification(['admin'], {
      title: 'New Pothole Report',
      message: `A new report "${report.title}" was submitted in ${report.city}.`,
      type: 'REPORT_CREATED',
      reportId: report.id,
    });

    // 3. Emit AI Analysis notifications to user and admin rooms
    if (aiResult) {
      socketService.emitNotification([`user:${report.userId}`, 'admin'], {
        title: 'AI Analysis Completed',
        message: aiResult.potholeDetected
          ? `AI verified pothole in report "${report.title}" with confidence ${Math.round(aiResult.confidenceScore * 100)}%.`
          : `AI finished analysis of report "${report.title}". No potholes were detected.`,
        type: 'AI_ANALYSIS',
        reportId: report.id,
      });
    }

    const formattedReport = {
      ...report,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
      image_url: report.attachments?.[0]?.url || null,
      reported_by: report.userId,
      assigned_to: report.officerId,
    };

    // Destructure status to prevent duplicate property error in TS when spreading
    const { status, ...reportRest } = formattedReport;

    res.status(201).json({
      ...reportRest,
      status, // Set explicitly
      data: {
        report: formattedReport,
        aiResult,
      },
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    // Convert frontend size parameter to backend limit query parameter
    if (req.query.size && !req.query.limit) {
      req.query.limit = req.query.size;
    }

    const result = await reportService.getReports(req.user, req.query);

    const formattedReports = result.data.map((report: any) => ({
      ...report,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
      image_url: report.attachments?.[0]?.url || null,
      reported_by: report.userId,
      assigned_to: report.officerId,
    }));

    res.status(200).json({
      status: 'success',
      data: formattedReports,
      pagination: result.pagination,
      // Frontend pagination contract properties
      items: formattedReports,
      total: result.pagination.total,
      page: result.pagination.page,
      size: result.pagination.limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const id = req.params.id as string;
    const report = await reportService.getReportById(id, req.user);
    if (!report) {
      return next(new AppError('Report not found', 404));
    }

    const formattedReport = {
      ...report,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
      image_url: report.attachments?.[0]?.url || null,
      reported_by: report.userId,
      assigned_to: report.officerId,
    };

    const { status, ...reportRest } = formattedReport;

    res.status(200).json({
      ...reportRest,
      status, // Set explicitly
      data: { report: formattedReport },
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const id = req.params.id as string;

    // Adapt frontend snake_case attributes
    if (req.body.image_url && !req.body.imageUrl) {
      req.body.imageUrl = req.body.image_url;
    }

    const parseResult = updateReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(', ');
      return next(new AppError(errorMsg, 400));
    }

    // Retrieve original report state to identify modified status/assignments
    const originalReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!originalReport) {
      return next(new AppError('Report not found', 404));
    }

    const report = await reportService.updateReport(
      id,
      parseResult.data,
      req.user
    );

    const oldStatus = originalReport.status;
    const newStatus = report.status;
    const oldOfficerId = originalReport.officerId;
    const newOfficerId = report.officerId;

    // 1. Emit base report-updated event
    socketService.emitReportUpdated(report);

    // 2. Emit status changed events
    if (oldStatus !== newStatus) {
      socketService.emitStatusChanged(
        report.id,
        oldStatus,
        newStatus,
        report.userId,
        report.officerId || undefined
      );

      socketService.emitNotification(
        [
          `user:${report.userId}`,
          'admin',
          ...(report.officerId ? [`officer:${report.officerId}`] : []),
        ],
        {
          title: 'Status Updated',
          message: `The status of report #${report.id} was updated from ${oldStatus} to ${newStatus}.`,
          type: 'STATUS_CHANGE',
          reportId: report.id,
        }
      );
    }

    // 3. Emit report assigned event
    if (newOfficerId && oldOfficerId !== newOfficerId) {
      socketService.emitReportAssigned(report.id, newOfficerId);

      socketService.emitNotification(
        [`officer:${newOfficerId}`],
        {
          title: 'New Assignment',
          message: `You have been assigned to pothole report #${report.id}.`,
          type: 'ASSIGNMENT',
          reportId: report.id,
        }
      );
    }

    const formattedReport = {
      ...report,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
      image_url: report.attachments?.[0]?.url || null,
      reported_by: report.userId,
      assigned_to: report.officerId,
    };

    const { status, ...reportRest } = formattedReport;

    res.status(200).json({
      ...reportRest,
      status, // Set explicitly
      data: { report: formattedReport },
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const id = req.params.id as string;
    await reportService.deleteReport(id, req.user);
    res.status(200).json({
      status: 'success',
      message: 'Report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
