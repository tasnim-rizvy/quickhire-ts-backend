import { Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { ProcessedFile } from '../middleware/uploadHandler';

// Extend Express Request to include file
interface FileRequest extends Express.Request {
  file?: ProcessedFile;
}

// ─── POST /api/uploads/company-logo ────────────────────────────────────────

export interface UploadResponse {
  filename: string;
  mimetype: string;
  size: number;
  processedSize: number;
  imageUrl: string;
}

export const uploadCompanyLogo = async (
  req: FileRequest,
  res: Response<ApiResponse<UploadResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file as ProcessedFile;

    const uploadResponse: UploadResponse = {
      filename: file.originalname || 'logo',
      mimetype: file.mimetype || 'image/webp',
      size: file.size || 0,
      processedSize: file.processedSize || 0,
      imageUrl: file.base64 || '',
    };

    res.status(201).json({
      success: true,
      data: uploadResponse,
      message: 'Company logo uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};
