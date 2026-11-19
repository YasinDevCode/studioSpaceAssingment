import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const JWT_SECRET =
  process.env.JWT_SECRET && process.env.JWT_SECRET !== 'replace-with-a-long-random-secret-string'
    ? process.env.JWT_SECRET
    : 'studiospace-jwt-signing-key-production-2026';

export const AUTH_COOKIE_NAME = 'studiospace_token';

export interface AuthTokenPayload {
  id: string;
  email: string;
  name: string;
  photoUrl: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

function isRequestSecure(req: Request): boolean {
  if (req.secure) return true;
  const forwarded = req.headers['x-forwarded-proto'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim() === 'https';
  }
  return false;
}

export function setAuthCookie(res: Response, req: Request, payload: AuthTokenPayload): void {
  const token = signAuthToken(payload);
  const secure = isRequestSecure(req);
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response, req: Request): void {
  const secure = isRequestSecure(req);
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
  });
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized: Missing HTTPOnly authentication cookie. Please sign in to continue.',
    });
    return;
  }
  const decoded = verifyAuthToken(token);
  if (!decoded) {
    res.status(401).json({
      error: 'Unauthorized: Invalid or expired session token. Please sign in again.',
    });
    return;
  }
  req.user = decoded;
  next();
}
