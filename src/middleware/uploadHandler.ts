import multer, { MulterError } from 'multer';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// ─── Multer Configuration ────────────────────────────────────────────────────

const storage = multer.memoryStorage();

const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
): void => {
	// Allow only image files
	const allowedMimes = [
		'image/jpeg',
		'image/png',
		'image/webp',
		'image/svg+xml',
	];

	if (!allowedMimes.includes(file.mimetype)) {
		cb(
			new AppError(
				400,
				'Invalid file type. Only JPEG, PNG, WebP, and SVG images are allowed',
			),
		);
		return;
	}

	cb(null, true);
};

export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
	},
});

// ─── Image Optimization Middleware ──────────────────────────────────────────

export interface ProcessedFile extends Express.Multer.File {
	base64?: string;
	processedSize?: number;
}

export const processImage = async (
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.file) {
			next();
			return;
		}

		const file = req.file as ProcessedFile;

		// Process image with sharp: resize and compress
		const processedBuffer = await sharp(file.buffer)
			.resize(500, 500, {
				fit: 'contain',
				background: { r: 255, g: 255, b: 255, alpha: 1 },
			})
			.webp({ quality: 80 })
			.toBuffer();

		// Convert to base64
		const base64String = processedBuffer.toString('base64');
		file.base64 = `data:image/webp;base64,${base64String}`;
		file.processedSize = processedBuffer.length;

		next();
	} catch (error) {
		if (error instanceof MulterError) {
			if (error.code === 'LIMIT_FILE_SIZE') {
				return next(new AppError(400, 'File size exceeds 5MB limit'));
			}
			return next(new AppError(400, `Upload error: ${error.message}`));
		}
		if (error instanceof Error) {
			return next(new AppError(400, error.message));
		}
		next(error);
	}
};

// ─── Validation Middleware ──────────────────────────────────────────────────

export const validateImageUpload = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	if (!req.file) {
		res.status(400).json({
			success: false,
			message: 'No file uploaded',
			errors: [{ field: 'file', message: 'Image file is required' }],
		});
		return;
	}

	next();
};
