import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { mutate } from '@/lib/db';

const schema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  preferences: z
    .object({
      defaultView: z.enum(['grid', 'table']).optional(),
      emailNotifications: z.boolean().optional(),
    })
    .optional(),
});

export async function PUT(req: NextRequest) {
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

  const data = parsed.data;
  await mutate((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (!u) return;
    if (data.displayName !== undefined) u.displayName = data.displayName;
    if (data.bio !== undefined) u.bio = data.bio;
    if (data.avatarUrl !== undefined) u.avatarUrl = data.avatarUrl || undefined;
    if (data.preferences) {
      u.preferences = { ...u.preferences, ...data.preferences };
    }
    u.updatedAt = new Date().toISOString();
  });

  return NextResponse.json({ ok: true });
}
