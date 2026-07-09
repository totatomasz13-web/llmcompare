import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDB, mutate, generateId } from '@/lib/db';

const schema = z.object({
  modelId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDB();
  const items = db.favorites
    .filter((f) => f.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  const now = new Date().toISOString();

  let result: { created: boolean; favorite?: any } = { created: false };
  await mutate((db) => {
    const existing = db.favorites.find((f) => f.userId === user.id && f.modelId === modelId);
    if (existing) {
      result = { created: false, favorite: existing };
      return;
    }
    const fav = {
      id: generateId('fav'),
      userId: user.id,
      modelId,
      note,
      createdAt: now,
    };
    db.favorites.push(fav);
    db.activity.push({
      id: generateId('act'),
      userId: user.id,
      type: 'favorite',
      modelId,
      createdAt: now,
    });
    result = { created: true, favorite: fav };
  });

  return NextResponse.json(result, { status: result.created ? 201 : 200 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const modelId = searchParams.get('modelId');
  if (!modelId) return NextResponse.json({ error: 'Missing modelId' }, { status: 400 });

  await mutate((db) => {
    db.favorites = db.favorites.filter(
      (f) => !(f.userId === user.id && f.modelId === modelId)
    );
  });

  return NextResponse.json({ ok: true });
}
