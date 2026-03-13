import { Types } from 'mongoose';
import { Request } from 'express';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: IUserPublic;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum JobCategory {
  Engineering = 'Engineering',
  Design = 'Design',
  Marketing = 'Marketing',
  Sales = 'Sales',
  Finance = 'Finance',
  HR = 'HR',
  Product = 'Product',
  Operations = 'Operations',
  Data = 'Data',
  Other = 'Other',
}

export enum JobType {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Contract = 'Contract',
  Remote = 'Remote',
  Internship = 'Internship',
}

export enum ApplicationStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

// ─── Job ──────────────────────────────────────────────────────────────────────

export interface IJob {
  _id: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type: JobType;
  description: string;
  requirements: string;
  salary: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDTO {
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type?: JobType;
  description: string;
  requirements?: string;
  salary?: string;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {
  isActive?: boolean;
}

// ─── Application ─────────────────────────────────────────────────────────────

export interface IApplication {
  _id: Types.ObjectId;
  job_id: Types.ObjectId | IJob;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationDTO {
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface JobQueryParams {
  search?: string;
  category?: JobCategory;
  type?: JobType;
  location?: string;
  page?: string;
  limit?: string;
}

export interface ApplicationQueryParams {
  status?: ApplicationStatus;
  page?: string;
  limit?: string;
}
