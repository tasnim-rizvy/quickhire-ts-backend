import { Router } from 'express';
import { uploadCompanyLogo } from '../controllers/uploadController';
import {
	upload,
	processImage,
	validateImageUpload,
} from '../middleware/uploadHandler';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * POST /api/uploads/company-logo
 * Upload and process a company logo image
 * Returns: Base64 encoded image URL
 * Auth: Admin only
 * Body: multipart/form-data with 'logo' field
 * Max size: 5MB
 * Allowed: JPEG, PNG, WebP, SVG
 */
router.post(
	'/company-logo',
	requireAdmin,
	upload.single('logo'),
	validateImageUpload,
	processImage,
	uploadCompanyLogo,
);

export const uploadRoutes = router;
