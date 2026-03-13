import { Request, Response, NextFunction } from 'express';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { AppError } from '../middleware/errorHandler';
import {
  ApiResponse,
  CreateApplicationDTO,
  ApplicationQueryParams,
  ApplicationStatus,
  IApplication,
  PaginationMeta,
} from '../types';

// ─── POST /api/applications ───────────────────────────────────────────────────

export const createApplication = async (
  req: Request<Record<string, never>, ApiResponse<IApplication>, CreateApplicationDTO>,
  res: Response<ApiResponse<IApplication>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { job_id, name, email, resume_link, cover_note } = req.body;

    // Verify job exists and is accepting applications
    const job = await Job.findById(job_id).lean();
    if (!job) {
      throw new AppError(404, 'Job not found');
    }
    if (!job.isActive) {
      throw new AppError(400, 'This job is no longer accepting applications');
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      resume_link,
      cover_note: cover_note ?? '',
    });

    res.status(201).json({
      success: true,
      data: application.toObject() as unknown as IApplication,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    // Mongoose duplicate key — same email applied to same job
    if (
      error instanceof Error &&
      error.name === 'MongoServerError' &&
      (error as NodeJS.ErrnoException).code === '11000'
    ) {
      next(new AppError(409, 'You have already applied for this job with this email address'));
      return;
    }
    next(error);
  }
};

// ─── GET /api/applications ────────────────────────────────────────────────────

export const getApplications = async (
  req: Request<
    Record<string, never>,
    ApiResponse<IApplication[]>,
    Record<string, never>,
    ApplicationQueryParams
  >,
  res: Response<ApiResponse<IApplication[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const query: Record<string, unknown> = {};
    if (status) query['status'] = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('job_id', 'title company location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Application.countDocuments(query),
    ]);

    const pagination: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    };

    res.json({
      success: true,
      data: applications as unknown as IApplication[],
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/applications/:id ────────────────────────────────────────────────

export const getApplicationById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<IApplication>>,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job_id')
      .lean();

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    res.json({ success: true, data: application as unknown as IApplication });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/applications/:id/status ──────────────────────────────────────

export const updateApplicationStatus = async (
  req: Request<{ id: string }, ApiResponse<IApplication>, { status: ApplicationStatus }>,
  res: Response<ApiResponse<IApplication>>,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    )
      .populate('job_id', 'title company')
      .lean();

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    res.json({
      success: true,
      data: application as unknown as IApplication,
      message: `Status updated to "${req.body.status}"`,
    });
  } catch (error) {
    next(error);
  }
};
