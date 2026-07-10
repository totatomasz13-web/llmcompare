import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { dbGetUserComparisons, dbGetComparisonByIdAndUser, dbCreateComparison, dbUpdateComparison, dbDeleteComparison, dbCreateActivity, generateId } from '@/lib/db';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  modelIds: z.array(z.string()).min(2).max(4),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await dbGetUserComparisons(user.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Bad data' }, { status: 400 });

  const now = new Date().toISOString();

  if (parsed.data.id) {
    const existing = await dbGetComparisonByIdAndUser(parsed.data.id, user.id);
    if (existing) {
      await dbUpdateComparison(parsed.data.id, { name: parsed.data.name, modelIds: parsed.data.modelIds } as any);
      const updated = await dbGetComparisonByIdAndUser(parsed.data.id, user.id);
      return NextResponse.json({ comparison: updated }, { status: 200 });
    }
  }

  const saved = {
    id: generateId('cmp'),
    userId: user.id,
    name: parsed.data.name,
    modelIds: parsed.data.modelIds,
    createdAt: now,
    updatedAt: now,
  };
  await dbCreateComparison(saved);
  await dbCreateActivity({
    id: generateId('act'),
    userId: user.id,
    type: 'compare',
    meta: { name: parsed.data.name, modelIds: parsed.data.modelIds },
    createdAt: now,
  });

  return NextResponse.json({ comparison: saved }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await dbDeleteComparison(id, user.id);
  return NextResponse.json({ ok: true });
}
