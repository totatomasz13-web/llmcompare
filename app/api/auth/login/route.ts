import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword, createSession, setCookieOnResponse } from '@/lib/auth';
import { mutate, generateId, getDB } from '@/lib/db';

const schema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(1, 'Wymagane hasło'),
  remember: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Nieprawidłowy JSON' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Błędne dane' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const db = await getDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      );
    }

    const session = await createSession(user.id, {
      userAgent: req.headers.get('user-agent') ?? undefined,
      ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName || user.username,
        role: user.role,
      },
    });
    setCookieOnResponse(res, session.token);

    await mutate((db) => {
      const u = db.users.find((u) => u.id === user.id);
      if (u) u.lastLoginAt = new Date().toISOString();
      db.activity.push({
        id: generateId('act'),
        userId: user.id,
        type: 'login',
        createdAt: new Date().toISOString(),
      });
    });

    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: `Błąd serwera: ${err?.message || 'nieznany błąd'}` },
      { status: 500 }
    );
  }
}
