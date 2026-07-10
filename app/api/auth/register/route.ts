import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, createSession, setCookieOnResponse } from '@/lib/auth';
import { mutate, generateId, getDB } from '@/lib/db';

const schema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  username: z
    .string()
    .min(3, 'Min. 3 znaki')
    .max(24, 'Max. 24 znaki')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Tylko litery, cyfry, _ i -'),
  password: z
    .string()
    .min(8, 'Min. 8 znaków')
    .max(128, 'Max. 128 znaków')
    .regex(/[A-Z]/, 'Wymaga wielkiej litery')
    .regex(/[a-z]/, 'Wymaga małej litery')
    .regex(/[0-9]/, 'Wymaga cyfry'),
  displayName: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Błędne dane', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, username, password, displayName } = parsed.data;
  const db = await getDB();

  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { error: 'Email jest już zajęty' },
      { status: 409 }
    );
  }
  if (db.users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return NextResponse.json(
      { error: 'Nazwa użytkownika jest zajęta' },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const userId = generateId('usr');

  await mutate((db) => {
    db.users.push({
      id: userId,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      passwordHash,
      displayName: displayName || username,
      role: db.users.length === 0 ? 'admin' : 'user',
      createdAt: now,
      updatedAt: now,
      emailVerified: false,
      preferences: { defaultView: 'grid', emailNotifications: false },
    });
    db.activity.push({
      id: generateId('act'),
      userId,
      type: 'register',
      createdAt: now,
    });
  });

  const session = await createSession(userId, {
    userAgent: req.headers.get('user-agent') ?? undefined,
    ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
  });

  const res = NextResponse.json({
    user: {
      id: userId,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: displayName || username,
      role: db.users.length === 1 ? 'admin' : 'user',
    },
  });
  setCookieOnResponse(res, session.token);
  return res;
}
