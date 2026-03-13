import { Schema, model, Document, Model, Types } from 'mongoose';
import { IApplication, ApplicationStatus } from '../types';

// ─── Document Interface ───────────────────────────────────────────────────────

export interface ApplicationDocument extends Omit<IApplication, '_id' | 'job_id'>, Document {
  job_id: Types.ObjectId;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const applicationSchema = new Schema<ApplicationDocument>(
  {
    job_id: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    resume_link: {
      type: String,
      required: [true, 'Resume link is required'],
      match: [/^https?:\/\/.+/, 'Resume link must be a valid URL starting with http(s)://'],
    },
    cover_note: {
      type: String,
      default: '',
      maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ApplicationStatus),
        message: `Status must be one of: ${Object.values(ApplicationStatus).join(', ')}`,
      },
      default: ApplicationStatus.Pending,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// Prevent duplicate applications per email per job
applicationSchema.index({ job_id: 1, email: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

// ─── Model ───────────────────────────────────────────────────────────────────

export const Application: Model<ApplicationDocument> = model<ApplicationDocument>(
  'Application',
  applicationSchema
);
