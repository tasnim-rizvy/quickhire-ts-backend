import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload, UserRole } from '../types';

export function signToken(userId: string, role: UserRole): string {
  return jwt.sign(
    { userId, role } satisfies JwtPayload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
  );
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, config.jwtSecret);
  if (typeof payload === 'string' || !('userId' in payload)) {
    throw new Error('Invalid token payload');
  }
  return payload as JwtPayload;
}
