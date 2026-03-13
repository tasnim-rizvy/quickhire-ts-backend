// api/index.ts — Vercel serverless entry point
// Wraps the Express app for Vercel's Node.js serverless runtime.

import connectDB from '../src/config/db';
import { createApp } from '../src/app';
import { Application } from 'express';

let app: Application | null = null;

// Reuse app instance across warm invocations
async function getApp(): Promise<Application> {
  if (!app) {
    await connectDB();
    app = createApp();
  }
  return app;
}

export default async function handler(
  req: Parameters<Application>[0],
  res: Parameters<Application>[1]
): Promise<void> {
  const application = await getApp();
  application(req, res);
}
