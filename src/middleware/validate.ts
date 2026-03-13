import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { JobCategory, JobType, ApplicationStatus, ApiResponse } from '../types';

// ─── Error handler ────────────────────────────────────────────────────────────

export const handleValidationErrors = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: e.type === 'field' ? (e as { path: string }).path : 'unknown',
      message: e.msg as string,
    }));
    res.status(400).json({
      success: false,
      message: errors.map((e) => e.message).join(', '),
      errors,
    });
    return;
  }
  next();
};

// ─── Auth validation ──────────────────────────────────────────────────────────

export const validateRegister: (ValidationChain | typeof handleValidationErrors)[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),

  handleValidationErrors,
];

export const validateLogin: (ValidationChain | typeof handleValidationErrors)[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// ─── Job validation ───────────────────────────────────────────────────────────

export const validateCreateJob: (ValidationChain | typeof handleValidationErrors)[] = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(Object.values(JobCategory))
    .withMessage(`Category must be one of: ${Object.values(JobCategory).join(', ')}`),

  body('type')
    .optional()
    .isIn(Object.values(JobType))
    .withMessage(`Type must be one of: ${Object.values(JobType).join(', ')}`),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),

  body('salary')
    .optional()
    .isString().withMessage('Salary must be a string'),

  body('requirements')
    .optional()
    .isString().withMessage('Requirements must be a string'),

  handleValidationErrors,
];

export const validateUpdateJob: (ValidationChain | typeof handleValidationErrors)[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

  body('company')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Company must be between 1 and 100 characters'),

  body('location')
    .optional()
    .trim()
    .notEmpty().withMessage('Location cannot be empty'),

  body('category')
    .optional()
    .isIn(Object.values(JobCategory))
    .withMessage(`Category must be one of: ${Object.values(JobCategory).join(', ')}`),

  body('type')
    .optional()
    .isIn(Object.values(JobType))
    .withMessage(`Type must be one of: ${Object.values(JobType).join(', ')}`),

  body('description')
    .optional()
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),

  handleValidationErrors,
];

// ─── Application validation ───────────────────────────────────────────────────

export const validateCreateApplication: (ValidationChain | typeof handleValidationErrors)[] = [
  body('job_id')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Job ID must be a valid MongoDB ObjectId'),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('resume_link')
    .trim()
    .notEmpty().withMessage('Resume link is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Resume link must be a valid URL (http:// or https://)'),

  body('cover_note')
    .optional()
    .isLength({ max: 2000 }).withMessage('Cover note cannot exceed 2000 characters'),

  handleValidationErrors,
];

// ─── Status update validation ─────────────────────────────────────────────────

export const validateStatusUpdate: (ValidationChain | typeof handleValidationErrors)[] = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(ApplicationStatus))
    .withMessage(`Status must be one of: ${Object.values(ApplicationStatus).join(', ')}`),

  handleValidationErrors,
];
