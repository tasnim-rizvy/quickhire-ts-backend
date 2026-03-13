import { Request, Response, NextFunction } from 'express';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { AppError } from '../middleware/errorHandler';
import {
  ApiResponse,
  JobQueryParams,
  CreateJobDTO,
  UpdateJobDTO,
  IJob,
  IApplication,
  PaginationMeta,
} from '../types';

// ─── GET /api/jobs ────────────────────────────────────────────────────────────

export const getJobs = async (
  req: Request<Record<string, never>, ApiResponse<IJob[]>, Record<string, never>, JobQueryParams>,
  res: Response<ApiResponse<IJob[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, category, type, location, page = '1', limit = '10' } = req.query;

    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query['$or'] = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query['category'] = category;
    if (type) query['type'] = type;
    if (location) query['location'] = { $regex: location, $options: 'i' };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Job.countDocuments(query),
    ]);

    const pagination: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    };

    res.json({ success: true, data: jobs as unknown as IJob[], pagination });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/jobs/:id ────────────────────────────────────────────────────────

export const getJobById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<IJob>>,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    res.json({ success: true, data: job as unknown as IJob });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/jobs ───────────────────────────────────────────────────────────

export const createJob = async (
  req: Request<Record<string, never>, ApiResponse<IJob>, CreateJobDTO>,
  res: Response<ApiResponse<IJob>>,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job.toObject() as unknown as IJob,
      message: 'Job created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/jobs/:id ────────────────────────────────────────────────────────

export const updateJob = async (
  req: Request<{ id: string }, ApiResponse<IJob>, UpdateJobDTO>,
  res: Response<ApiResponse<IJob>>,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    res.json({
      success: true,
      data: job as unknown as IJob,
      message: 'Job updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/jobs/:id ─────────────────────────────────────────────────────

export const deleteJob = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    // Cascade delete all applications for this job
    const { deletedCount } = await Application.deleteMany({ job_id: req.params.id });

    res.json({
      success: true,
      message: `Job deleted successfully along with ${deletedCount} associated application(s)`,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/jobs/:id/applications ──────────────────────────────────────────

export const getJobApplications = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<IApplication[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    const applications = await Application.find({ job_id: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: applications as unknown as IApplication[],
      message: `${applications.length} application(s) found`,
    });
  } catch (error) {
    next(error);
  }
};
