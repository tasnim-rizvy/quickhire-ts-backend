import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  adminSecretKey: string;
  frontendUrl: string;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoUri: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/quickhire'),
  adminSecretKey: requireEnv('ADMIN_SECRET_KEY', 'quickhire-admin-2024'),
  frontendUrl: requireEnv('FRONTEND_URL', '*'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: requireEnv('JWT_SECRET', 'quickhire-jwt-secret-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
};
