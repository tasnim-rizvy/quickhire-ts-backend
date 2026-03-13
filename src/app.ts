import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import { uploadRoutes } from './routes/uploads';

export function createApp(): Application {
	const app = express();

	// ─── CORS ───────────────────────────────────────────────────────────────────
	app.use(
		cors({
			origin: config.frontendUrl === '*' ? '*' : config.frontendUrl.split(','),
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: config.frontendUrl !== '*',
		}),
	);

	// ─── Body parsing ────────────────────────────────────────────────────────────
	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true }));

	// ─── Routes ──────────────────────────────────────────────────────────────────
	app.use('/api/auth', authRoutes);
	app.use('/api/jobs', jobRoutes);
	app.use('/api/applications', applicationRoutes);
	app.use('/api/uploads', uploadRoutes);

	// ─── Health check ────────────────────────────────────────────────────────────
	app.get('/api/health', (_req: Request, res: Response) => {
		res.json({
			status: 'ok',
			message: 'QuickHire API is running',
			environment: config.nodeEnv,
			timestamp: new Date().toISOString(),
		});
	});

	app.get('/', (_req: Request, res: Response) => {
		res.json({
			message: 'QuickHire API',
			version: '2.0.0',
			docs: '/api/health',
		});
	});

	// ─── 404 ─────────────────────────────────────────────────────────────────────
	app.use((_req: Request, res: Response) => {
		res.status(404).json({ success: false, message: 'Route not found' });
	});

	// ─── Error handler ───────────────────────────────────────────────────────────
	app.use(errorHandler);

	return app;
}
