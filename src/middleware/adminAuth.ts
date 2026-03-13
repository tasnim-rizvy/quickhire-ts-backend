import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { ApiResponse } from '../types';

export const adminAuth = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey || adminKey !== config.adminSecretKey) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: valid X-Admin-Key header is required',
    });
    return;
  }

  next();
};
