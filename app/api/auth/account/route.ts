import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteUserData } from '@/lib/db';

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteUserData(user.id);
  return NextResponse.json({ ok: true });
}
