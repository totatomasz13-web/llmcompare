import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { mutate } from '@/lib/db';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await mutate((db) => {
    const r = db.reviews.find((r) => r.id === params.id);
    if (r) r.helpful += 1;
  });
  return NextResponse.json({ ok: true });
}
