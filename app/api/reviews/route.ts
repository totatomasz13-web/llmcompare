import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { dbGetReviews, dbGetReviewByUserAndModel, dbCreateReview, dbUpdateReview, dbCreateActivity, generateId } from '@/lib/db';

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
  const modelId = searchParams.get('modelId') ?? undefined;
  const userId = searchParams.get('userId') ?? undefined;

  const items = await dbGetReviews(modelId, userId);
  return NextResponse.json({ items });
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
  const existing = await dbGetReviewByUserAndModel(user.id, parsed.data.modelId);

  if (existing) {
    await dbUpdateReview(existing.id, { ...parsed.data, updatedAt: now } as any);
    const updated = await dbGetReviewByUserAndModel(user.id, parsed.data.modelId);
    return NextResponse.json({ review: updated }, { status: 200 });
  }

  const review = {
    id: generateId('rev'),
    userId: user.id,
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
    helpful: 0,
    reported: false,
  };
  await dbCreateReview(review);
  await dbCreateActivity({
    id: generateId('act'),
    userId: user.id,
    type: 'review',
    modelId: parsed.data.modelId,
    meta: { rating: parsed.data.rating },
    createdAt: now,
  });

  return NextResponse.json({ review }, { status: 201 });
}
