import { Schema, model, Document, Model } from 'mongoose';
import { IJob, JobCategory, JobType } from '../types';

// ─── Document Interface ───────────────────────────────────────────────────────

export interface JobDocument extends Omit<IJob, '_id'>, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const jobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: Object.values(JobCategory),
        message: `Category must be one of: ${Object.values(JobCategory).join(', ')}`,
      },
    },
    type: {
      type: String,
      enum: {
        values: Object.values(JobType),
        message: `Type must be one of: ${Object.values(JobType).join(', ')}`,
      },
      default: JobType.FullTime,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
    },
    requirements: {
      type: String,
      default: '',
      trim: true,
    },
    salary: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ category: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });

// ─── Model ───────────────────────────────────────────────────────────────────

export const Job: Model<JobDocument> = model<JobDocument>('Job', jobSchema);
