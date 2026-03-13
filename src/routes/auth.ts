import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateRegister, validateLogin } from '../middleware/validate';

const router = Router();

/** POST /api/auth/register — Create new account */
router.post('/register', validateRegister, register);

/** POST /api/auth/login — Log in and receive JWT */
router.post('/login', validateLogin, login);

/** GET /api/auth/me — Get current user profile (requires auth) */
router.get('/me', requireAuth, getMe);

export default router;
