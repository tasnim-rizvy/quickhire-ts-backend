import { Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { AuthRequest, ApiResponse, UserRole } from '../types';
import { AppError } from './errorHandler';

// ─── requireAuth — any logged-in user ────────────────────────────────────────

export const requireAuth = (
  req: AuthRequest,
  _res: Response<ApiResponse>,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required. Please log in.');
    }
    const token = authHeader.slice(7);
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof AppError) { next(error); return; }
    next(new AppError(401, 'Invalid or expired token. Please log in again.'));
  }
};

// ─── requireAdmin — only admin role ──────────────────────────────────────────

export const requireAdmin = (
  req: AuthRequest,
  _res: Response<ApiResponse>,
  next: NextFunction
): void => {
  requireAuth(req, _res, (err?: unknown) => {
    if (err) { next(err); return; }
    if (req.user?.role !== UserRole.Admin) {
      next(new AppError(403, 'Access denied. Admin privileges required.'));
      return;
    }
    next();
  });
};
