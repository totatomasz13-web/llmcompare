import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { mutate } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: any = {};
  try { body = await req.json(); } catch {}
  const modelId = String(body.modelId || '').trim();
  if (!modelId) return NextResponse.json({ error: 'Missing modelId' }, { status: 400 });
  await mutate((db) => {
    db.activity.push({
      id: `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      type: 'view',
      modelId,
      createdAt: new Date().toISOString(),
    });
    db.activity = db.activity.slice(-2000);
  });
  return NextResponse.json({ ok: true });
}
