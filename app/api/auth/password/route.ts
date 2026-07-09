import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { mutate } from '@/lib/db';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Wymaga wielkiej litery')
    .regex(/[a-z]/, 'Wymaga małej litery')
    .regex(/[0-9]/, 'Wymaga cyfry'),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: 'Nieprawidłowe obecne hasło' },
      { status: 401 }
    );
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await mutate((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (u) {
      u.passwordHash = newHash;
      u.updatedAt = new Date().toISOString();
    }
  });

  return NextResponse.json({ ok: true });
}
