import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getDB, mutate, generateId } from '@/lib/db';

const createSchema = z.object({
  modelId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  content: z.string().min(10, 'Min. 10 znaków').max(2000),
  pros: z.array(z.string().max(100)).max(10).default([]),
  cons: z.array(z.string().max(100)).max(10).default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const modelId = searchParams.get('modelId');
  const userId = searchParams.get('userId');

  const db = await getDB();
  let items = db.reviews.filter((r) => !r.reported);
  if (modelId) items = items.filter((r) => r.modelId === modelId);
  if (userId) items = items.filter((r) => r.userId === userId);

  const enriched = items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => {
      const u = db.users.find((u) => u.id === r.userId);
      return {
        ...r,
        author: u
          ? {
              id: u.id,
              username: u.username,
              displayName: u.displayName || u.username,
              avatarUrl: u.avatarUrl,
            }
          : null,
      };
    });

  return NextResponse.json({ items: enriched });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Błędne dane', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  let review: any;
  await mutate((db) => {
    const existing = db.reviews.find(
      (r) => r.userId === user.id && r.modelId === parsed.data.modelId
    );
    if (existing) {
      review = { ...existing, ...parsed.data, updatedAt: now };
      Object.assign(existing, review);
    } else {
      review = {
        id: generateId('rev'),
        userId: user.id,
        ...parsed.data,
        createdAt: now,
        updatedAt: now,
        helpful: 0,
        reported: false,
      };
      db.reviews.push(review);
      db.activity.push({
        id: generateId('act'),
        userId: user.id,
        type: 'review',
        modelId: parsed.data.modelId,
        meta: { rating: parsed.data.rating },
        createdAt: now,
      });
    }
  });

  return NextResponse.json({ review }, { status: 201 });
}
