import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  console.error(`[Error] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && (err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json({ success: false, message: 'Duplicate entry detected' });
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  res.status(500).json({ success: false, message: 'Internal server error' });
};
