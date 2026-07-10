import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbCreateActivity, dbTrimActivity, generateId } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: any = {};
  try { body = await req.json(); } catch {}
  const modelId = String(body.modelId || '').trim();
  if (!modelId) return NextResponse.json({ error: 'Missing modelId' }, { status: 400 });

  await dbCreateActivity({
    id: generateId('act'),
    userId: user.id,
    type: 'view',
    modelId,
    createdAt: new Date().toISOString(),
  });
  await dbTrimActivity(user.id, 2000);

  return NextResponse.json({ ok: true });
}
