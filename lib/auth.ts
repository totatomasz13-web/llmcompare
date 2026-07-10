import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB, mutate, generateId, type User, type Session } from './db';
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
  await mutate((db) => {
    db.sessions.push(session);
    db.sessions = db.sessions.filter(
      (s) => new Date(s.expiresAt).getTime() > Date.now()
    );
  });
  return session;
}

export async function destroySession(token: string) {
  await mutate((db) => {
    db.sessions = db.sessions.filter((s) => s.token !== token);
  });
}

export async function getUserFromToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const db = await getDB();
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) return null;
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
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

export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
