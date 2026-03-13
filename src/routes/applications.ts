import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { requireAdmin } from '../middleware/authMiddleware';
import { validateCreateApplication, validateStatusUpdate } from '../middleware/validate';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────

/** POST /api/applications — Submit a job application */
router.post('/', validateCreateApplication, createApplication);

// ─── Admin (JWT required, role=admin) ────────────────────────────────────────

/** GET /api/applications — List all applications */
router.get('/', requireAdmin, getApplications);

/** GET /api/applications/:id — Get a single application */
router.get('/:id', requireAdmin, getApplicationById);

/** PATCH /api/applications/:id/status — Update application status */
router.patch('/:id/status', requireAdmin, validateStatusUpdate, updateApplicationStatus);

export default router;
