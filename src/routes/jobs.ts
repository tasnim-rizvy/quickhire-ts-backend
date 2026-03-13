import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
} from '../controllers/jobController';
import { requireAdmin } from '../middleware/authMiddleware';
import {
  validateCreateJob,
  validateUpdateJob,
} from '../middleware/validate';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────

/** GET /api/jobs — List jobs with optional search & filters */
router.get('/', getJobs);

/** GET /api/jobs/:id — Get a single job by ID */
router.get('/:id', getJobById);

// ─── Admin (JWT required, role=admin) ────────────────────────────────────────

/** POST /api/jobs — Create a new job listing */
router.post('/', requireAdmin, validateCreateJob, createJob);

/** PUT /api/jobs/:id — Update a job listing */
router.put('/:id', requireAdmin, validateUpdateJob, updateJob);

/** DELETE /api/jobs/:id — Delete a job (cascades to applications) */
router.delete('/:id', requireAdmin, deleteJob);

/** GET /api/jobs/:id/applications — Get all applications for a job */
router.get('/:id/applications', requireAdmin, getJobApplications);

export default router;
