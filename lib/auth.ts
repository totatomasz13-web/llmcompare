import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  dbGetUserById, dbGetSessionByToken, dbCreateSession, dbDeleteSession,
  dbCreateActivity, generateId, type User, type Session,
} from './db';
import { signToken, verifyToken, COOKIE_NAME } from './jwt';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { signToken, verifyToken, COOKIE_NAME };

export function setCookieOnResponse(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearCookieOnResponse(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function createSession(
  userId: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<Session> {
  const token = await signToken(userId);
  const session: Session = {
    id: generateId('sess'),
    userId,
    token,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
    createdAt: new Date().toISOString(),
  };
  await dbCreateSession(session);
  return session;
}

export async function destroySession(token: string) {
  await dbDeleteSession(token);
}

export async function getUserFromToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const user = await dbGetUserById(payload.sub);
  if (!user) return null;
  const session = await dbGetSessionByToken(token);
  if (!session) return null;
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export async function getCurrentUserFromRequest(req: NextRequest): Promise<User | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return getUserFromToken(token);
}
