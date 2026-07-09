import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDB, mutate, generateId } from '@/lib/db';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  modelIds: z.array(z.string()).min(2).max(4),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await getDB();
  const items = db.comparisons
    .filter((c) => c.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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
  let saved: any;
  await mutate((db) => {
    if (parsed.data.id) {
      const existing = db.comparisons.find((c) => c.id === parsed.data.id && c.userId === user.id);
      if (existing) {
        existing.name = parsed.data.name;
        existing.modelIds = parsed.data.modelIds;
        existing.updatedAt = now;
        saved = existing;
        return;
      }
    }
    saved = {
      id: generateId('cmp'),
      userId: user.id,
      name: parsed.data.name,
      modelIds: parsed.data.modelIds,
      createdAt: now,
      updatedAt: now,
    };
    db.comparisons.push(saved);
    db.activity.push({
      id: generateId('act'),
      userId: user.id,
      type: 'compare',
      meta: { name: parsed.data.name, modelIds: parsed.data.modelIds },
      createdAt: now,
    });
  });

  return NextResponse.json({ comparison: saved }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await mutate((db) => {
    db.comparisons = db.comparisons.filter((c) => !(c.id === id && c.userId === user.id));
  });
  return NextResponse.json({ ok: true });
}
