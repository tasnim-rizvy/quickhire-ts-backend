import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { signToken } from '../config/jwt';
import {
  ApiResponse,
  AuthResponse,
  RegisterDTO,
  LoginDTO,
  IUserPublic,
  AuthRequest,
} from '../types';

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export const register = async (
  req: Request<Record<string, never>, ApiResponse<AuthResponse>, RegisterDTO>,
  res: Response<ApiResponse<AuthResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, 'An account with this email already exists');
    }

    const user = await User.create({ name, email, password });

    const token = signToken(user._id.toString(), user.role);

    const userPublic: IUserPublic = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: { token, user: userPublic },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export const login = async (
  req: Request<Record<string, never>, ApiResponse<AuthResponse>, LoginDTO>,
  res: Response<ApiResponse<AuthResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Include password field (excluded by default via `select: false`)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Generic message to prevent user enumeration
      throw new AppError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken(user._id.toString(), user.role);

    const userPublic: IUserPublic = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: 'Logged in successfully!',
      data: { token, user: userPublic },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export const getMe = async (
  req: AuthRequest,
  res: Response<ApiResponse<IUserPublic>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).lean();
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const userPublic: IUserPublic = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({ success: true, data: userPublic });
  } catch (error) {
    next(error);
  }
};
