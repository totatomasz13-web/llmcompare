import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { dbGetUserById, dbUpdateUser } from '@/lib/db';

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
  const updates: any = {};
  if (data.displayName !== undefined) updates.displayName = data.displayName;
  if (data.bio !== undefined) updates.bio = data.bio;
  if (data.avatarUrl !== undefined) updates.avatarUrl = data.avatarUrl || undefined;
  if (data.preferences) {
    const existing = await dbGetUserById(user.id);
    updates.preferences = { ...existing?.preferences, ...data.preferences };
  }
  await dbUpdateUser(user.id, updates);

  return NextResponse.json({ ok: true });
}
