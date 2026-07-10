import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { dbGetUserFavorites, dbGetFavorite, dbCreateFavorite, dbDeleteFavorite, dbCreateActivity, generateId } from '@/lib/db';

const schema = z.object({
  modelId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await dbGetUserFavorites(user.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Bad data' }, { status: 400 });

  const { modelId, note } = parsed.data;
  const existing = await dbGetFavorite(user.id, modelId);
  if (existing) {
    return NextResponse.json({ created: false, favorite: existing });
  }

  const now = new Date().toISOString();
  const fav = {
    id: generateId('fav'),
    userId: user.id,
    modelId,
    note,
    createdAt: now,
  };
  await dbCreateFavorite(fav);
  await dbCreateActivity({
    id: generateId('act'),
    userId: user.id,
    type: 'favorite',
    modelId,
    createdAt: now,
  });

  return NextResponse.json({ created: true, favorite: fav }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const modelId = searchParams.get('modelId');
  if (!modelId) return NextResponse.json({ error: 'Missing modelId' }, { status: 400 });

  await dbDeleteFavorite(user.id, modelId);
  return NextResponse.json({ ok: true });
}
